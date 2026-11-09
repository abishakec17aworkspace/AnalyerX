
import React, {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    toPng,
    toJpeg,
    toSvg
} from "html-to-image";

import jsPDF from "jspdf";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ScatterChart,
    Scatter
} from "recharts";

import {
    Download,
    ChevronDown,
    Database,
    ChartNoAxesColumn,
    Activity,
    ChartPie,
    AlertCircle,
    BarChart3,
    RefreshCw
} from "lucide-react";

import mariola from "../assets/CyberGirl.jpg";

// =====================================================
// 1. CONSTANTS
// =====================================================

const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#14b8a6"
];

const TOOLTIP_STYLE = {
    background: "#111111",
    border: "1px solid #292929",
    borderRadius: "8px",
    color: "#ffffff"
};

const GRID_STYLE = {
    stroke: "#292929",
    strokeDasharray: "3 3"
};

const AXIS_STYLE = {
    stroke: "white",
    fontSize: 16
};

// =====================================================
// 2. HELPER FUNCTIONS
// =====================================================

const toNumber = (value) => {
    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {
        return null;
    }

    const cleanedValue =
        typeof value === "string"
            ? value.replace(/,/g, "").trim()
            : value;

    const number = Number(cleanedValue);

    return Number.isFinite(number) ? number : null;
};

const getNumericValues = (rows, column) => {
    return rows
        .map((row) => toNumber(row[column]))
        .filter((value) => value !== null);
};

const downloadFile = (data, filename) => {
    const link = document.createElement("a");

    link.href = data;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const sanitizeFilename = (name) => {
    return name
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
};

// =====================================================
// 3. INDIVIDUAL CHART EXPORT
// =====================================================

const downloadSingleChart = async (
    chartElement,
    chartTitle,
    format
) => {
    if (!chartElement) return;

    const options = {
        backgroundColor: "#0b0b0b",
        pixelRatio: 3,
        cacheBust: true,
        filter: (node) =>
            !node?.dataset?.exportIgnore
    };

    const filename = sanitizeFilename(chartTitle);

    let image;

    try {
        switch (format) {

            case "PNG":
                image = await toPng(
                    chartElement,
                    options
                );

                downloadFile(
                    image,
                    `${filename}.png`
                );
                break;

            case "JPG":
                image = await toJpeg(
                    chartElement,
                    {
                        ...options,
                        quality: 0.95
                    }
                );

                downloadFile(
                    image,
                    `${filename}.jpg`
                );
                break;

            case "SVG":
                image = await toSvg(
                    chartElement,
                    options
                );

                downloadFile(
                    image,
                    `${filename}.svg`
                );
                break;

            case "PDF": {
                image = await toPng(
                    chartElement,
                    options
                );

                const pdf = new jsPDF(
                    "l",
                    "mm",
                    "a4"
                );

                const pageWidth =
                    pdf.internal.pageSize.getWidth();

                const pageHeight =
                    pdf.internal.pageSize.getHeight();

                const properties =
                    pdf.getImageProperties(image);

                const margin = 10;

                const scale = Math.min(
                    (pageWidth - margin * 2) /
                        properties.width,

                    (pageHeight - margin * 2) /
                        properties.height
                );

                const width =
                    properties.width * scale;

                const height =
                    properties.height * scale;

                pdf.addImage(
                    image,
                    "PNG",
                    (pageWidth - width) / 2,
                    (pageHeight - height) / 2,
                    width,
                    height
                );

                pdf.save(`${filename}.pdf`);
                break;
            }

            default:
                throw new Error(
                    `Unsupported format: ${format}`
                );
        }

    } catch (error) {
        console.error(
            "Chart export failed:",
            error
        );

        throw error;
    }
};

// =====================================================
// 4. DOWNLOAD ALL CHARTS
// =====================================================

const downloadAllCharts = async () => {
    try {
        const chartElements =
            document.querySelectorAll(
                ".export-chart-card"
            );

        if (!chartElements.length) {
            alert("No charts available to download.");
            return;
        }

        const pdf = new jsPDF(
            "p",
            "mm",
            "a4"
        );

        const pdfWidth =
            pdf.internal.pageSize.getWidth();

        const pdfHeight =
            pdf.internal.pageSize.getHeight();

        const margin = 10;

        for (
            let index = 0;
            index < chartElements.length;
            index++
        ) {
            const chart = chartElements[index];

            const image = await toPng(
                chart,
                {
                    backgroundColor: "#0b0b0b",
                    pixelRatio: 2,
                    cacheBust: true,
                    filter: (node) =>
                        !node?.dataset?.exportIgnore
                }
            );

            const properties =
                pdf.getImageProperties(image);

            const imageWidth =
                pdfWidth - margin * 2;

            const imageHeight =
                (
                    properties.height *
                    imageWidth
                ) / properties.width;

            if (index > 0) {
                pdf.addPage();
            }

            // Scale image to fit the page.
            const scale = Math.min(
                1,
                (pdfHeight - margin * 2) / imageHeight
            );

            const finalWidth = imageWidth * scale;
            const finalHeight = imageHeight * scale;

            pdf.addImage(
                image,
                "PNG",
                (pdfWidth - finalWidth) / 2,
                margin,
                finalWidth,
                finalHeight
            );
        }

        pdf.save("AnalyxerX_All_Charts_Report.pdf");

    } catch (error) {
        console.error(
            "Chart download failed:",
            error
        );

        alert(
            "Unable to download charts. Please try again."
        );
    }
};

// =====================================================
// 5. STATISTICAL FUNCTIONS
// =====================================================

const calculatePercentile = (
    sortedValues,
    percentile
) => {
    if (!sortedValues.length) return null;

    const index =
        (sortedValues.length - 1) * percentile;

    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) {
        return sortedValues[lower];
    }

    return (
        sortedValues[lower] +
        (
            sortedValues[upper] -
            sortedValues[lower]
        ) * (index - lower)
    );
};

const calculateNumericalStatistics = (values) => {
    if (!values.length) return null;

    const sortedValues = [...values].sort(
        (a, b) => a - b
    );

    const sum = values.reduce(
        (total, value) => total + value,
        0
    );

    return {
        count: values.length,
        min: sortedValues[0],

        q1: calculatePercentile(
            sortedValues,
            0.25
        ),

        median: calculatePercentile(
            sortedValues,
            0.50
        ),

        q3: calculatePercentile(
            sortedValues,
            0.75
        ),

        max: sortedValues[sortedValues.length - 1],

        mean: sum / values.length
    };
};

// =====================================================
// 6. HISTOGRAM
// =====================================================

const createHistogram = (
    values,
    binCount = 10
) => {
    if (!values.length) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);

    if (min === max) {
        return [
            {
                range: String(min),
                count: values.length
            }
        ];
    }

    const binSize =
        (max - min) / binCount;

    const bins = Array.from(
        { length: binCount },
        (_, index) => {
            const start =
                min + index * binSize;

            const end =
                index === binCount - 1
                    ? max
                    : start + binSize;

            return {
                range:
                    `${start.toFixed(1)} - ${end.toFixed(1)}`,
                count: 0
            };
        }
    );

    values.forEach((value) => {
        let index = Math.floor(
            (value - min) / binSize
        );

        index = Math.min(
            index,
            binCount - 1
        );

        bins[index].count += 1;
    });

    return bins;
};

// =====================================================
// 7. CATEGORICAL FREQUENCY
// =====================================================

const getCategoryCounts = (
    rows,
    column
) => {
    const counts = {};

    rows.forEach((row) => {
        const value = row[column];

        if (
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        ) {
            const key = String(value);

            counts[key] =
                (counts[key] || 0) + 1;
        }
    });

    return Object.entries(counts)
        .map(([name, count]) => ({
            name,
            count
        }))
        .sort(
            (a, b) => b.count - a.count
        )
        .slice(0, 10);
};

// =====================================================
// 8. CORRELATION
// =====================================================

const getCorrelation = (
    rows,
    columnA,
    columnB
) => {
    const pairs = rows
        .map((row) => ({
            x: toNumber(row[columnA]),
            y: toNumber(row[columnB])
        }))
        .filter(
            (pair) =>
                pair.x !== null &&
                pair.y !== null
        );

    if (pairs.length < 2) return null;

    const meanX =
        pairs.reduce(
            (sum, pair) => sum + pair.x,
            0
        ) / pairs.length;

    const meanY =
        pairs.reduce(
            (sum, pair) => sum + pair.y,
            0
        ) / pairs.length;

    const numerator = pairs.reduce(
        (sum, pair) =>
            sum +
            (pair.x - meanX) *
            (pair.y - meanY),
        0
    );

    const denominatorX = Math.sqrt(
        pairs.reduce(
            (sum, pair) =>
                sum +
                (pair.x - meanX) ** 2,
            0
        )
    );

    const denominatorY = Math.sqrt(
        pairs.reduce(
            (sum, pair) =>
                sum +
                (pair.y - meanY) ** 2,
            0
        )
    );

    if (
        denominatorX === 0 ||
        denominatorY === 0
    ) {
        return null;
    }

    return (
        numerator /
        (denominatorX * denominatorY)
    );
};

// =====================================================
// 9. BOX PLOT STATISTICS
// =====================================================

const getBoxStatistics = (values) => {
    if (!values.length) return null;

    const sorted = [...values].sort(
        (a, b) => a - b
    );

    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    const q1 = calculatePercentile(
        sorted,
        0.25
    );

    const median = calculatePercentile(
        sorted,
        0.50
    );

    const q3 = calculatePercentile(
        sorted,
        0.75
    );

    const iqr = q3 - q1;

    const lowerFence =
        q1 - 1.5 * iqr;

    const upperFence =
        q3 + 1.5 * iqr;

    const outliers = sorted.filter(
        (value) =>
            value < lowerFence ||
            value > upperFence
    );

    return {
        min,
        q1,
        median,
        q3,
        max,
        iqr,
        outliers,
        outlierCount: outliers.length
    };
};

// =====================================================
// 10. REUSABLE SUMMARY CARD
// =====================================================

const SummaryCard = ({
    title,
    value,
    icon: Icon,
    color,
    description
}) => {
    return (
        <div
            className="
                rounded-xl
                border border-[#252525]
                bg-[#0b0b0b18]
                backdrop-blur-lg
                p-5
                transition
                hover:border-gray-600
            "
        >
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-950">
                    {title}
                </p>

                <div
                    className={`rounded-lg p-2 ${
                        color || "bg-black/70"
                    }`}
                >
                    <Icon size={20} />
                </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-black">
                {value}
            </h2>

            <p className="mt-2 text-xs text-gray-950">
                {description}
            </p>
        </div>
    );
};

// =====================================================
// 11. CHART CARD WITH EXPORT OPTIONS
// =====================================================

const ChartCard = ({
    title,
    description,
    children,
    className = ""
}) => {
    const chartRef = useRef(null);

    const [format, setFormat] =
        useState("PNG");

    const [downloading, setDownloading] =
        useState(false);

    const handleDownload = async () => {
        if (downloading) return;

        setDownloading(true);

        try {
            // Allow chart rendering to complete.
            await new Promise((resolve) =>
                setTimeout(resolve, 300)
            );

            await downloadSingleChart(
                chartRef.current,
                title,
                format
            );

        } catch (error) {
            alert(
                "Unable to export chart. Please try again."
            );

        } finally {
            setDownloading(false);
        }
    };

    return (
        <div
            ref={chartRef}
            className={`
                min-w-0
                export-chart-card
                rounded-xl
                border border-[#252525]
                bg-[#0b0b0b81]
                backdrop-blur-lg
                p-5 md:p-6
                transition
                hover:border-gray-600
                ${className}
            `}
        >
            <div
                className="
                    flex flex-col gap-3
                    md:flex-row
                    md:items-center
                    md:justify-between
                "
            >
                <h2
                    className="
                        text-lg md:text-xl
                        font-semibold text-white
                        p-2 rounded-lg w-fit
                    "
                >
                    {title}
                </h2>

                <div
                    data-export-ignore="true"
                    className="flex items-center gap-2"
                >
                    <div className="relative">
                        <select
                            value={format}
                            onChange={(event) =>
                                setFormat(event.target.value)
                            }
                            aria-label={`Export format for ${title}`}
                            className="
                                appearance-none
                                rounded-lg border border-[#383838]
                                bg-[#111111] text-gray-300 text-sm
                                px-3 py-2 pr-9 outline-none
                                focus:border-indigo-500 cursor-pointer
                            "
                        >
                            <option value="PNG">PNG</option>
                            <option value="JPG">JPG</option>
                            <option value="SVG">SVG</option>
                            <option value="PDF">PDF</option>
                        </select>

                        <ChevronDown
                            size={15}
                            className="
                                absolute right-3 top-1/2
                                -translate-y-1/2
                                text-gray-400
                                pointer-events-none
                            "
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={downloading}
                        className="
                            flex items-center gap-2
                            rounded-lg bg-indigo-600
                            hover:bg-indigo-700
                            disabled:opacity-50
                            px-4 py-2 text-sm
                            font-semibold text-white
                            transition whitespace-nowrap
                        "
                    >
                        <Download size={16} />

                        {downloading
                            ? "Exporting..."
                            : "Download"}
                    </button>
                </div>
            </div>

            <p className="mt-2 mb-6 pl-2 text-sm text-slate-300">
                {description}
            </p>

            {children}
        </div>
    );
};

// =====================================================
// 12. SELECT FIELD
// =====================================================

const SelectField = ({
    label,
    value,
    onChange,
    options
}) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-black">
                {label}
            </label>

            <select
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="
                    w-full md:w-64
                    rounded-lg
                    border border-[#292929]
                    bg-[#111111]
                    px-4 py-3
                    text-sm text-gray-300
                    outline-none
                    transition
                    focus:border-gray-500
                "
            >
                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

// =====================================================
// 13. EMPTY CHART
// =====================================================

const EmptyChart = ({ message }) => {
    return (
        <div
            className="
                h-72
                flex flex-col
                items-center justify-center
                text-gray-500
            "
        >
            <ChartNoAxesColumn
                size={35}
                className="mb-3 opacity-50"
            />

            <p className="text-sm">
                {message}
            </p>
        </div>
    );
};

// =====================================================
// 14. MAIN CHARTS COMPONENT
// =====================================================

const Charts = ({
    dataset: suppliedData = null
}) => {

    // ---------------------------------------------
    // GET DATASET
    // ---------------------------------------------

    const storedData = useMemo(() => {
        try {
            const stored =
                sessionStorage.getItem("uploadeddata");

            return stored
                ? JSON.parse(stored)
                : null;

        } catch (error) {
            console.error(
                "Dataset retrieval error:",
                error
            );

            return null;
        }
    }, []);

    // Prefer the dataset passed from ReportPage.
    // Otherwise, use the original uploaded dataset.

    const data = suppliedData || storedData;

    const overview = data?.overview;

    // ---------------------------------------------
    // EXTRACT DATASET INFORMATION
    // ---------------------------------------------

    const rows = Array.isArray(
        overview?.complete_data
    )
        ? overview.complete_data
        : [];

    const datasetSize =
        overview?.dataset_size || {};

    const missingValues =
        overview?.missing_values || {};

    const duplicates =
        overview?.duplicates || {};

    const columnInformation =
        overview?.column_information || [];

    // ---------------------------------------------
    // IDENTIFY COLUMNS
    // ---------------------------------------------

    const allColumns = useMemo(() => {
        return rows.length > 0
            ? Object.keys(rows[0])
            : [];
    }, [rows]);

    // ---------------------------------------------
    // NUMERICAL COLUMNS
    // ---------------------------------------------

    const numericColumns = useMemo(() => {
        return allColumns.filter((column) => {

            const values = getNumericValues(
                rows,
                column
            );

            if (!values.length) return false;

            const nonEmptyValues = rows.filter(
                (row) =>
                    row[column] !== null &&
                    row[column] !== undefined &&
                    String(row[column]).trim() !== ""
            );

            return (
                nonEmptyValues.length > 0 &&
                values.length / nonEmptyValues.length >= 0.8
            );
        });
    }, [rows, allColumns]);

    // ---------------------------------------------
    // CATEGORICAL COLUMNS
    // ---------------------------------------------

    const categoricalColumns = useMemo(() => {
        return allColumns.filter(
            (column) =>
                !numericColumns.includes(column)
        );
    }, [allColumns, numericColumns]);

    // ---------------------------------------------
    // STATE MANAGEMENT
    // ---------------------------------------------

    const [selectedColumn, setSelectedColumn] =
        useState("");

    const [xColumn, setXColumn] =
        useState("");

    const [yColumn, setYColumn] =
        useState("");

    const [categoryColumn, setCategoryColumn] =
        useState("");

    // ---------------------------------------------
    // DEFAULT COLUMN SELECTIONS
    // ---------------------------------------------

    useEffect(() => {

        if (
            !numericColumns.includes(selectedColumn) &&
            numericColumns.length > 0
        ) {
            setSelectedColumn(numericColumns[0]);
        }

        if (
            !numericColumns.includes(xColumn) &&
            numericColumns.length > 0
        ) {
            setXColumn(numericColumns[0]);
        }

        if (
            !numericColumns.includes(yColumn) &&
            numericColumns.length > 1
        ) {
            setYColumn(numericColumns[1]);

        } else if (
            !numericColumns.includes(yColumn) &&
            numericColumns.length === 1
        ) {
            setYColumn(numericColumns[0]);
        }

        if (
            !categoricalColumns.includes(categoryColumn) &&
            categoricalColumns.length > 0
        ) {
            setCategoryColumn(
                categoricalColumns[0]
            );
        }

    }, [
        numericColumns,
        categoricalColumns,
        selectedColumn,
        xColumn,
        yColumn,
        categoryColumn
    ]);

    // ---------------------------------------------
    // MISSING VALUES CHART
    // ---------------------------------------------

    const missingChartData = useMemo(() => {
        return Object.entries(
            missingValues.column_wise || {}
        )
            .map(([column, count]) => ({
                column,
                missing: Number(count)
            }))
            .filter(
                (item) =>
                    Number.isFinite(item.missing)
            );
    }, [missingValues]);

    // ---------------------------------------------
    // DATA TYPE DISTRIBUTION
    // ---------------------------------------------

    const dataTypeChartData = useMemo(() => {

        const counts = columnInformation.reduce(
            (result, column) => {

                const type =
                    column.datatype ||
                    column.data_type ||
                    column.data_type_name ||
                    "Unknown";

                result[type] =
                    (result[type] || 0) + 1;

                return result;
            },
            {}
        );

        return Object.entries(counts).map(
            ([name, value]) => ({
                name,
                value
            })
        );

    }, [columnInformation]);

    // ---------------------------------------------
    // NUMERICAL STATISTICS
    // ---------------------------------------------

    const selectedStats = useMemo(() => {

        if (!selectedColumn) return null;

        const values = getNumericValues(
            rows,
            selectedColumn
        );

        return calculateNumericalStatistics(
            values
        );

    }, [rows, selectedColumn]);

    const statisticalChartData = selectedStats
        ? [
            {
                statistic: "Minimum",
                value: selectedStats.min
            },
            {
                statistic: "25%",
                value: selectedStats.q1
            },
            {
                statistic: "Median",
                value: selectedStats.median
            },
            {
                statistic: "75%",
                value: selectedStats.q3
            },
            {
                statistic: "Maximum",
                value: selectedStats.max
            }
        ]
        : [];

    // ---------------------------------------------
    // HISTOGRAM
    // ---------------------------------------------

    const histogramData = useMemo(() => {

        if (!selectedColumn) return [];

        const values = getNumericValues(
            rows,
            selectedColumn
        );

        return createHistogram(
            values,
            10
        );

    }, [rows, selectedColumn]);

    // ---------------------------------------------
    // SCATTER PLOT
    // ---------------------------------------------

    const scatterData = useMemo(() => {

        if (!xColumn || !yColumn) return [];

        return rows
            .map((row) => ({
                x: toNumber(row[xColumn]),
                y: toNumber(row[yColumn])
            }))
            .filter(
                (point) =>
                    point.x !== null &&
                    point.y !== null
            );

    }, [rows, xColumn, yColumn]);

    // ---------------------------------------------
    // CATEGORICAL FREQUENCY
    // ---------------------------------------------

    const categoryData = useMemo(() => {

        if (!categoryColumn) return [];

        return getCategoryCounts(
            rows,
            categoryColumn
        );

    }, [rows, categoryColumn]);

    // ---------------------------------------------
    // CORRELATION MATRIX
    // ---------------------------------------------

    const correlationData = useMemo(() => {

        return numericColumns.map(
            (columnA) => ({
                column: columnA,

                values: numericColumns.map(
                    (columnB) =>
                        getCorrelation(
                            rows,
                            columnA,
                            columnB
                        )
                )
            })
        );

    }, [rows, numericColumns]);

    // ---------------------------------------------
    // BOX PLOT STATISTICS
    // ---------------------------------------------

    const boxStatistics = useMemo(() => {

        if (!selectedColumn) return null;

        const values = getNumericValues(
            rows,
            selectedColumn
        );

        return getBoxStatistics(values);

    }, [rows, selectedColumn]);

    // ---------------------------------------------
    // DATASET QUALITY
    // ---------------------------------------------

    const missingPercentage =
        Number(missingValues.percentage || 0);

    const duplicatePercentage =
        Number(duplicates.percentage || 0);

    // ---------------------------------------------
    // NO DATASET HANDLING
    // ---------------------------------------------

    if (!overview || !rows.length) {
        return (
            <div
                className="
                    min-h-screen
                    flex items-center justify-center
                    bg-black p-6 text-white
                "
            >
                <div
                    className="
                        rounded-xl
                        border border-[#252525]
                        bg-[#0b0b0b15]
                        backdrop-blur-lg
                        p-10
                        text-center
                    "
                >
                    <AlertCircle
                        size={45}
                        className="mx-auto mb-4 text-red-400"
                    />

                    <h1 className="text-2xl font-bold">
                        No Dataset Found
                    </h1>

                    <p className="mt-3 text-gray-400">
                        Please upload a CSV file first.
                    </p>
                </div>
            </div>
        );
    }

    // =================================================
    // 15. MAIN DASHBOARD UI
    // =================================================

    return (
        <div
            className="
                min-h-screen w-full
                bg-black p-5 md:p-8
                space-y-8 text-white
                bg-cover bg-center
            "
            style={{
                backgroundImage: `url(${mariola})`
            }}
        >

            {/* HEADER */}

            <div
                className="
                    flex flex-col
                    gap-4
                    md:flex-row
                    md:items-center
                    md:justify-between
                "
            >
                <div>

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                rounded-xl
                                border border-[#252525]
                                bg-[#0b0b0b15]
                                backdrop-blur-lg
                                p-3
                            "
                        >
                            <BarChart3
                                className="text-black"
                                size={28}
                            />
                        </div>

                        <h1
                            className="
                                text-3xl font-bold
                                tracking-tight text-black
                            "
                        >
                            Data Visualization
                        </h1>

                    </div>

                    <p className="mt-3 text-sm text-gray-950">
                        Explore patterns, distributions and
                        relationships in your dataset.
                    </p>

                    <p className="mt-3 text-sm text-black bg-white rounded-2xl p-3">
                        File: {data?.filename || "Uploaded Dataset"}
                    </p>

                </div>

                {/* DATASET DIMENSIONS */}

                <div
                    className="
                        rounded-lg
                        border border-[#252525]
                        bg-[#0b0b0b15]
                        backdrop-blur-lg
                        px-4 py-3
                    "
                >
                    <p className="text-xs text-gray-950">
                        DATASET DIMENSIONS
                    </p>

                    <p className="mt-1 text-lg font-semibold text-white">
                        {datasetSize.total_rows ?? rows.length}
                        {" "}Rows

                        <span className="mx-2 text-black">
                            ×
                        </span>

                        {datasetSize.total_columns ?? allColumns.length}
                        {" "}Columns
                    </p>
                </div>

            </div>

            {/* SUMMARY CARDS */}

            <div
                className="
                    grid grid-cols-1
                    gap-4 sm:grid-cols-2
                    xl:grid-cols-4
                "
            >
                <SummaryCard
                    title="Total Rows"
                    value={(
                        datasetSize.total_rows ??
                        rows.length
                    ).toLocaleString()}
                    icon={Database}
                    color="bg-blue-500/10 text-blue-400"
                    description="Total records in dataset"
                />

                <SummaryCard
                    title="Total Columns"
                    value={
                        datasetSize.total_columns ??
                        allColumns.length
                    }
                    icon={ChartNoAxesColumn}
                    color="bg-green-500/10 text-green-400"
                    description="Available dataset attributes"
                />

                <SummaryCard
                    title="Missing Values"
                    value={(
                        missingValues.total ?? 0
                    ).toLocaleString()}
                    icon={Activity}
                    color="bg-red-500/10 text-red-400"
                    description={`${missingPercentage}% of total cells`}
                />

                <SummaryCard
                    title="Duplicate Rows"
                    value={(
                        duplicates.count ?? 0
                    ).toLocaleString()}
                    icon={ChartPie}
                    color="bg-orange-500/10 text-orange-400"
                    description={`${duplicatePercentage}% duplicate records`}
                />
            </div>

            {/* MISSING VALUES + DATA TYPES */}

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

                <ChartCard
                    title="Missing Values Analysis"
                    description="Missing values across dataset columns."
                >
                    {missingChartData.some(
                        (item) => item.missing > 0
                    ) ? (

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >
                            <BarChart
                                data={missingChartData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 10
                                }}
                            >
                                <CartesianGrid {...GRID_STYLE} />

                                <XAxis
                                    dataKey="column"
                                    {...AXIS_STYLE}
                                    angle={-25}
                                    textAnchor="end"
                                    interval={0}
                                    height={85}
                                />

                                <YAxis
                                    {...AXIS_STYLE}
                                    allowDecimals={false}
                                />

                                <Tooltip
                                    contentStyle={TOOLTIP_STYLE}
                                />

                                <Legend />

                                <Bar
                                    dataKey="missing"
                                    name="Missing Values"
                                    fill="#ef4444"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>

                    ) : (
                        <EmptyChart message="No missing values found." />
                    )}
                </ChartCard>

                <ChartCard
                    title="Column Data Type Distribution"
                    description="Distribution of different column data types."
                >
                    {dataTypeChartData.length > 0 ? (

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >
                            <PieChart>
                                <Pie
                                    data={dataTypeChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={105}
                                    label
                                >
                                    {dataTypeChartData.map(
                                        (entry, index) => (
                                            <Cell
                                                key={entry.name}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        )
                                    )}
                                </Pie>

                                <Tooltip
                                    contentStyle={TOOLTIP_STYLE}
                                />

                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>

                    ) : (
                        <EmptyChart message="No column type information available." />
                    )}
                </ChartCard>

            </div>

            {/* NUMERICAL STATISTICAL ANALYSIS */}

            <ChartCard
                title="Numerical Statistical Analysis"
                description="Compare minimum, quartiles, median, mean and maximum values."
            >
                {numericColumns.length > 0 ? (
                    <>
                        <div className="mb-6">
                            <SelectField
                                label="Select Numerical Column"
                                value={selectedColumn}
                                onChange={setSelectedColumn}
                                options={numericColumns}
                            />
                        </div>

                        {selectedStats && (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
                                {[
                                    ["Count", selectedStats.count],
                                    ["Mean", selectedStats.mean],
                                    ["Minimum", selectedStats.min],
                                    ["Q1 (25%)", selectedStats.q1],
                                    ["Median", selectedStats.median],
                                    ["Q3 (75%)", selectedStats.q3]
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-lg border border-[#292929] bg-black/30 p-4"
                                    >
                                        <p className="text-xs text-gray-400">
                                            {label}
                                        </p>

                                        <p className="mt-2 text-lg font-semibold text-white">
                                            {Number(value).toLocaleString(
                                                undefined,
                                                {
                                                    maximumFractionDigits: 3
                                                }
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {statisticalChartData.length > 0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height={330}
                            >
                                <BarChart
                                    data={statisticalChartData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 10
                                    }}
                                >
                                    <CartesianGrid {...GRID_STYLE} />

                                    <XAxis
                                        dataKey="statistic"
                                        {...AXIS_STYLE}
                                    />

                                    <YAxis {...AXIS_STYLE} />

                                    <Tooltip
                                        contentStyle={TOOLTIP_STYLE}
                                    />

                                    <Legend />

                                    <Bar
                                        dataKey="value"
                                        name={selectedColumn}
                                        fill="#6366f1"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart message="Could not calculate statistics for this column." />
                        )}
                    </>
                ) : (
                    <EmptyChart message="No numerical columns detected." />
                )}
            </ChartCard>

            {/* HISTOGRAM + SCATTER PLOT */}

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

                {/* HISTOGRAM */}

                <ChartCard
                    title="Numerical Distribution"
                    description="Understand the frequency distribution of numerical values."
                >
                    {numericColumns.length > 0 ? (
                        <>
                            <div className="mb-5">
                                <SelectField
                                    label="Select Numerical Column"
                                    value={selectedColumn}
                                    onChange={setSelectedColumn}
                                    options={numericColumns}
                                />
                            </div>

                            <ResponsiveContainer
                                width="100%"
                                height={320}
                            >
                                <BarChart
                                    data={histogramData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 10
                                    }}
                                >
                                    <CartesianGrid {...GRID_STYLE} />

                                    <XAxis
                                        dataKey="range"
                                        {...AXIS_STYLE}
                                        angle={-25}
                                        textAnchor="end"
                                        height={75}
                                    />

                                    <YAxis
                                        {...AXIS_STYLE}
                                        allowDecimals={false}
                                    />

                                    <Tooltip
                                        contentStyle={TOOLTIP_STYLE}
                                    />

                                    <Legend />

                                    <Bar
                                        dataKey="count"
                                        name="Frequency"
                                        fill="#8b5cf6"
                                        radius={[5, 5, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </>
                    ) : (
                        <EmptyChart message="No numerical columns available." />
                    )}
                </ChartCard>

                {/* SCATTER PLOT */}

                <ChartCard
                    title="Numerical Relationship Analysis"
                    description="Compare two numerical columns to identify possible relationships."
                >
                    {numericColumns.length > 0 ? (
                        <>
                            <div className="flex flex-col gap-4 mb-5 md:flex-row">
                                <SelectField
                                    label="X Axis"
                                    value={xColumn}
                                    onChange={setXColumn}
                                    options={numericColumns}
                                />

                                <SelectField
                                    label="Y Axis"
                                    value={yColumn}
                                    onChange={setYColumn}
                                    options={numericColumns}
                                />
                            </div>

                            {scatterData.length > 0 ? (
                                <ResponsiveContainer
                                    width="100%"
                                    height={320}
                                >
                                    <ScatterChart
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: 0,
                                            bottom: 10
                                        }}
                                    >
                                        <CartesianGrid {...GRID_STYLE} />

                                        <XAxis
                                            type="number"
                                            dataKey="x"
                                            name={xColumn}
                                            {...AXIS_STYLE}
                                        />

                                        <YAxis
                                            type="number"
                                            dataKey="y"
                                            name={yColumn}
                                            {...AXIS_STYLE}
                                        />

                                        <Tooltip
                                            cursor={{
                                                strokeDasharray: "3 3"
                                            }}
                                            contentStyle={TOOLTIP_STYLE}
                                        />

                                        <Legend />

                                        <Scatter
                                            name={`${xColumn} vs ${yColumn}`}
                                            data={scatterData}
                                            fill="#06b6d4"
                                        />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            ) : (
                                <EmptyChart message="No valid numerical pairs found." />
                            )}
                        </>
                    ) : (
                        <EmptyChart message="At least one numerical column is required." />
                    )}
                </ChartCard>

            </div>

            {/* BOX PLOT AND OUTLIER ANALYSIS */}

            <ChartCard
                title="Box Plot & Outlier Analysis"
                description="Understand the spread of numerical data, quartiles and potential outliers."
            >
                {boxStatistics ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-7 md:grid-cols-5">
                            {[
                                ["Minimum", boxStatistics.min],
                                ["Q1", boxStatistics.q1],
                                ["Median", boxStatistics.median],
                                ["Q3", boxStatistics.q3],
                                ["Maximum", boxStatistics.max]
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-xl border border-[#252525] bg-[#0b0b0b15] p-4 transition hover:border-gray-600"
                                >
                                    <p className="text-xs text-gray-500">
                                        {label}
                                    </p>

                                    <p className="mt-2 text-lg font-semibold text-white">
                                        {Number(value).toLocaleString(
                                            undefined,
                                            {
                                                maximumFractionDigits: 3
                                            }
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-xl border border-[#252525] bg-[#0b0b0b15] p-5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Selected column
                                    </p>

                                    <h3 className="mt-1 text-lg font-semibold text-white">
                                        {selectedColumn}
                                    </h3>
                                </div>

                                <div className="text-sm text-orange-400">
                                    Potential outliers:{" "}
                                    {boxStatistics.outlierCount}
                                </div>
                            </div>

                            {/* SCALE */}

                            <div className="mt-7">
                                <div className="mb-3 flex justify-between text-xs text-gray-500">
                                    <span>
                                        Min: {boxStatistics.min}
                                    </span>

                                    <span>
                                        Max: {boxStatistics.max}
                                    </span>
                                </div>

                                <div className="relative flex h-12 items-center">
                                    <div className="absolute left-0 right-0 h-0.5 bg-gray-700" />

                                    {/* IQR BOX */}

                                    <div
                                        className="absolute h-7 rounded border-2 border-violet-400 bg-violet-500/20"
                                        style={{
                                            left: `${
                                                boxStatistics.max === boxStatistics.min
                                                    ? 50
                                                    : (
                                                        (boxStatistics.q1 - boxStatistics.min) /
                                                        (boxStatistics.max - boxStatistics.min)
                                                    ) * 100
                                            }%`,

                                            width: `${
                                                boxStatistics.max === boxStatistics.min
                                                    ? 0
                                                    : (
                                                        (boxStatistics.q3 - boxStatistics.q1) /
                                                        (boxStatistics.max - boxStatistics.min)
                                                    ) * 100
                                            }%`
                                        }}
                                    />

                                    {/* MEDIAN */}

                                    <div
                                        className="absolute h-10 w-0.5 bg-cyan-400"
                                        style={{
                                            left: `${
                                                boxStatistics.max === boxStatistics.min
                                                    ? 50
                                                    : (
                                                        (boxStatistics.median - boxStatistics.min) /
                                                        (boxStatistics.max - boxStatistics.min)
                                                    ) * 100
                                            }%`
                                        }}
                                    />

                                    <div className="absolute left-0 h-4 w-0.5 bg-gray-300" />

                                    <div className="absolute right-0 h-4 w-0.5 bg-gray-300" />
                                </div>

                                <div className="mt-4 flex flex-wrap gap-5 text-xs text-gray-400">
                                    <span className="flex items-center gap-2">
                                        <span className="h-3 w-3 border border-violet-400 bg-violet-500/40" />
                                        Interquartile range
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-1 bg-cyan-400" />
                                        Median
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* IQR AND OUTLIER CARDS */}

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-xl border border-[#252525] bg-[#0b0b0b15] p-5 transition hover:border-gray-600">
                                <p className="text-sm text-gray-400">
                                    Interquartile Range (IQR)
                                </p>

                                <p className="mt-2 text-2xl font-bold text-violet-400">
                                    {boxStatistics.iqr.toFixed(3)}
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#252525] bg-[#0b0b0b15] p-5 transition hover:border-gray-600">
                                <p className="text-sm text-gray-400">
                                    Potential Outlier Count
                                </p>

                                <p className="mt-2 text-2xl font-bold text-orange-400">
                                    {boxStatistics.outlierCount}
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                            Outliers are identified using the
                            1.5 × IQR rule. This indicates
                            potential unusual values, not
                            necessarily errors.
                        </p>
                    </>
                ) : (
                    <EmptyChart message="No numerical data available for box plot analysis." />
                )}
            </ChartCard>

            {/* CATEGORICAL FREQUENCY */}

            <ChartCard
                title="Categorical Frequency Analysis"
                description="Explore the ten most frequent values in a categorical column."
            >
                {categoricalColumns.length > 0 ? (
                    <>
                        <div className="mb-5">
                            <SelectField
                                label="Select Categorical Column"
                                value={categoryColumn}
                                onChange={setCategoryColumn}
                                options={categoricalColumns}
                            />
                        </div>

                        {categoryData.length > 0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height={350}
                            >
                                <BarChart
                                    data={categoryData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 10
                                    }}
                                >
                                    <CartesianGrid {...GRID_STYLE} />

                                    <XAxis
                                        dataKey="name"
                                        {...AXIS_STYLE}
                                        angle={-25}
                                        textAnchor="end"
                                        height={80}
                                    />

                                    <YAxis
                                        {...AXIS_STYLE}
                                        allowDecimals={false}
                                    />

                                    <Tooltip
                                        contentStyle={TOOLTIP_STYLE}
                                    />

                                    <Legend />

                                    <Bar
                                        dataKey="count"
                                        name="Frequency"
                                        fill="#10b981"
                                        radius={[5, 5, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart message="No category values available." />
                        )}
                    </>
                ) : (
                    <EmptyChart message="No categorical columns detected." />
                )}
            </ChartCard>

            {/* CORRELATION HEATMAP */}

            <ChartCard
                title="Correlation Heatmap"
                description="Explore positive and negative relationships between numerical columns."
            >
                {numericColumns.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-max w-full text-sm text-center border-collapse">
                            <thead>
                                <tr className="bg-[#141414]">
                                    <th className="border border-[#292929] p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Column
                                    </th>

                                    {numericColumns.map((column) => (
                                        <th
                                            key={column}
                                            className="border border-[#292929] p-4 text-xs font-semibold uppercase tracking-wider text-gray-400"
                                        >
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {correlationData.map((row) => (
                                    <tr key={row.column}>
                                        <th className="border border-[#292929] bg-[#111111] p-4 text-left font-medium text-gray-300">
                                            {row.column}
                                        </th>

                                        {row.values.map(
                                            (value, index) => {
                                                const intensity =
                                                    value === null
                                                        ? 0
                                                        : Math.abs(value);

                                                const background =
                                                    value === null
                                                        ? "#292929"
                                                        : value >= 0
                                                            ? `rgba(16, 185, 129, ${0.15 + intensity * 0.75})`
                                                            : `rgba(239, 68, 68, ${0.15 + intensity * 0.75})`;

                                                return (
                                                    <td
                                                        key={`${row.column}-${numericColumns[index]}`}
                                                        className="border border-[#292929] p-4 font-semibold text-white"
                                                        style={{
                                                            backgroundColor: background
                                                        }}
                                                    >
                                                        {value === null
                                                            ? "N/A"
                                                            : value.toFixed(2)}
                                                    </td>
                                                );
                                            }
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyChart message="No numerical columns available for correlation analysis." />
                )}

                <div className="flex flex-wrap gap-5 mt-6 text-xs text-gray-400">
                    <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded bg-emerald-500" />
                        Positive correlation
                    </span>

                    <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded bg-red-500" />
                        Negative correlation
                    </span>

                    <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded bg-gray-600" />
                        Not available
                    </span>
                </div>
            </ChartCard>

            {/* DATASET QUALITY INFORMATION */}

            <ChartCard
                title="Dataset Quality Information"
                description="Review the overall quality of your dataset."
            >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {/* MISSING VALUES */}

                    <div className="rounded-xl border border-[#252525] bg-[#0b0b0b15] backdrop-blur-lg p-5 transition hover:border-gray-600">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-400">
                                Missing Values Percentage
                            </p>

                            <Activity className="text-red-400" />
                        </div>

                        <h2 className="mt-4 text-3xl font-bold text-red-400">
                            {missingPercentage}%
                        </h2>

                        <div className="mt-4 h-2 w-full rounded-full bg-[#292929]">
                            <div
                                className="h-2 rounded-full bg-red-500 transition-all"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Math.max(0, missingPercentage)
                                    )}%`
                                }}
                            />
                        </div>
                    </div>

                    {/* DUPLICATES */}

                    <div className="rounded-xl border border-[#252525] bg-[#0b0b0b15] backdrop-blur-lg p-5 transition hover:border-gray-600">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-400">
                                Duplicate Rows Percentage
                            </p>

                            <RefreshCw className="text-orange-400" />
                        </div>

                        <h2 className="mt-4 text-3xl font-bold text-orange-400">
                            {duplicatePercentage}%
                        </h2>

                        <div className="mt-4 h-2 w-full rounded-full bg-[#292929]">
                            <div
                                className="h-2 rounded-full bg-orange-500 transition-all"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Math.max(0, duplicatePercentage)
                                    )}%`
                                }}
                            />
                        </div>
                    </div>

                </div>
            </ChartCard>

            {/* FOOTER */}

            <div className="border-t border-[#252525] pt-5">
                <button
                    type="button"
                    data-export-ignore="true"
                    onClick={downloadAllCharts}
                    className="
                        flex items-center gap-3
                        rounded-xl
                        bg-indigo-600 hover:bg-indigo-700
                        px-5 py-3
                        text-white font-semibold
                        shadow-lg transition-all duration-300
                    "
                >
                    <Download size={20} />
                    Download All Charts
                </button>

                <p className="mt-5 text-center text-xs text-gray-500">
                    AnalyzerX | Dataset Visualization Dashboard
                </p>
            </div>

        </div>
    );
};

export default Charts;
