
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import {
  ArrowLeft,
  Database,
  Rows3,
  Columns3,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  FileText,
  Activity,
} from "lucide-react";

const COLORS = [
  "#38bdf8",
  "#818cf8",
  "#c084fc",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#2dd4bf",
  "#a78bfa",
  "#60a5fa",
  "#f472b6",
];

const formatNumber = (value) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "N/A";
  }

  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

const getNumericValue = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const getColumnType = (values) => {
  const validValues = values.filter(
    (value) => value !== null && value !== undefined && value !== ""
  );

  if (validValues.length === 0) {
    return "Empty";
  }

  const numericValues = validValues.filter(
    (value) => getNumericValue(value) !== null
  );

  return numericValues.length / validValues.length >= 0.8
    ? "Numerical"
    : "Categorical";
};

const calculateMedian = (values) => {
  if (!values.length) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
};

const createHistogram = (values) => {
  if (!values.length) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const binCount = 10;

  if (min === max) {
    return [
      {
        range: formatNumber(min),
        count: values.length,
      },
    ];
  }

  const binSize = (max - min) / binCount;

  const bins = Array.from({ length: binCount }, (_, index) => {
    const start = min + index * binSize;
    const end = start + binSize;

    return {
      range: `${formatNumber(start)} - ${formatNumber(end)}`,
      count: 0,
    };
  });

  values.forEach((value) => {
    let index = Math.floor((value - min) / binSize);

    if (index >= binCount) {
      index = binCount - 1;
    }

    bins[index].count += 1;
  });

  return bins;
};

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cleanedOutput = location.state?.cleanedOutput;

  const completeData = cleanedOutput?.complete_data || [];

  const [selectedNumericColumn, setSelectedNumericColumn] = useState("");
  const [selectedCategoryColumn, setSelectedCategoryColumn] = useState("");

  // -----------------------------------------
  // DATASET ANALYSIS
  // -----------------------------------------

  const report = useMemo(() => {
    if (!Array.isArray(completeData) || completeData.length === 0) {
      return null;
    }

    const rows = completeData;
    const columns = Object.keys(rows[0] || {});

    const totalRows = rows.length;
    const totalColumns = columns.length;
    const totalCells = totalRows * totalColumns;

    let totalMissing = 0;

    const columnDetails = columns.map((column) => {
      const values = rows.map((row) => row[column]);

      const missingCount = values.filter(
        (value) =>
          value === null ||
          value === undefined ||
          value === ""
      ).length;

      totalMissing += missingCount;

      return {
        name: column,
        type: getColumnType(values),
        missing: missingCount,
        missingPercentage:
          totalRows > 0 ? (missingCount / totalRows) * 100 : 0,
        uniqueValues: new Set(
          values
            .filter(
              (value) =>
                value !== null &&
                value !== undefined &&
                value !== ""
            )
            .map(String)
        ).size,
      };
    });

    const numericColumns = columnDetails
      .filter((column) => column.type === "Numerical")
      .map((column) => column.name);

    const categoricalColumns = columnDetails
      .filter((column) => column.type === "Categorical")
      .map((column) => column.name);

    const duplicateCount = rows.length -
      new Set(rows.map((row) => JSON.stringify(row))).size;

    return {
      totalRows,
      totalColumns,
      totalCells,
      totalMissing,
      duplicateCount,
      columnDetails,
      numericColumns,
      categoricalColumns,
    };
  }, [completeData]);

  // -----------------------------------------
  // DEFAULT SELECTED COLUMNS
  // -----------------------------------------

  React.useEffect(() => {
    if (!report) return;

    if (
      !selectedNumericColumn &&
      report.numericColumns.length > 0
    ) {
      setSelectedNumericColumn(report.numericColumns[0]);
    }

    if (
      !selectedCategoryColumn &&
      report.categoricalColumns.length > 0
    ) {
      setSelectedCategoryColumn(report.categoricalColumns[0]);
    }
  }, [report, selectedNumericColumn, selectedCategoryColumn]);

  // -----------------------------------------
  // NUMERICAL STATISTICS
  // -----------------------------------------

  const numericalAnalysis = useMemo(() => {
    if (!selectedNumericColumn || !completeData.length) {
      return null;
    }

    const values = completeData
      .map((row) => getNumericValue(row[selectedNumericColumn]))
      .filter((value) => value !== null);

    if (!values.length) return null;

    const sum = values.reduce((total, value) => total + value, 0);

    return {
      count: values.length,
      mean: sum / values.length,
      median: calculateMedian(values),
      min: Math.min(...values),
      max: Math.max(...values),
      histogram: createHistogram(values),
    };
  }, [completeData, selectedNumericColumn]);

  // -----------------------------------------
  // CATEGORICAL ANALYSIS
  // -----------------------------------------

  const categoricalAnalysis = useMemo(() => {
    if (!selectedCategoryColumn || !completeData.length) {
      return [];
    }

    const frequency = {};

    completeData.forEach((row) => {
      const value = row[selectedCategoryColumn];

      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return;
      }

      const label = String(value);

      frequency[label] = (frequency[label] || 0) + 1;
    });

    return Object.entries(frequency)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [completeData, selectedCategoryColumn]);

  // -----------------------------------------
  // EMPTY REPORT STATE
  // -----------------------------------------

  if (!report) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center border border-white/10 bg-white/5 rounded-2xl p-8">
          <FileText size={48} className="mx-auto mb-5 text-sky-400" />

          <h2 className="text-2xl font-bold mb-3">
            Report Not Available
          </h2>

          <p className="text-gray-400 mb-6">
            No cleaned dataset was received. Please apply the cleaning
            process before opening the report.
          </p>

          <button
            onClick={() => navigate("/CleaningPage")}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-semibold"
          >
            Back to Cleaning
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // REUSABLE SUMMARY CARD
  // -----------------------------------------

  const SummaryCard = ({ title, value, icon: Icon, description }) => (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-sky-400/40 transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <h3 className="text-3xl font-bold text-white mt-3">
            {formatNumber(value)}
          </h3>

          <p className="text-xs text-gray-500 mt-2">
            {description}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
          <Icon size={23} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-8">

      {/* PAGE HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/CleaningPage")}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            title="Back to Cleaning"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <div className="flex items-center gap-2 text-sky-400 text-sm mb-1">
              <Activity size={16} />
              <span>ANALYTICAL REPORT</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">
              Dataset Report
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              Insights and statistics from your cleaned dataset
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-3 rounded-xl">
          <CheckCircle2 size={18} />
          Cleaned Dataset
        </div>
      </div>

      {/* SECTION 1: DATASET SUMMARY */}

      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <Database className="text-sky-400" size={22} />
          <h2 className="text-xl font-semibold">
            Dataset Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <SummaryCard
            title="Total Rows"
            value={report.totalRows}
            icon={Rows3}
            description="Records after cleaning"
          />

          <SummaryCard
            title="Total Columns"
            value={report.totalColumns}
            icon={Columns3}
            description="Available features"
          />

          <SummaryCard
            title="Missing Values"
            value={report.totalMissing}
            icon={AlertTriangle}
            description="Remaining empty cells"
          />

          <SummaryCard
            title="Duplicate Rows"
            value={report.duplicateCount}
            icon={CheckCircle2}
            description="Identical records in output"
          />

        </div>
      </section>

      {/* SECTION 2: DATA QUALITY */}

      <section className="mb-10">

        <div className="flex items-center gap-3 mb-5">
          <CheckCircle2 className="text-sky-400" size={22} />

          <h2 className="text-xl font-semibold">
            Data Quality Report
          </h2>
        </div>

        <div className="bg-black/60 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden">

          <div className="p-5 border-b border-white/10">
            <h3 className="font-semibold">
              Column Information
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Data types, missing values and unique values
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">

              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="p-4">Column Name</th>
                  <th className="p-4">Data Type</th>
                  <th className="p-4">Missing Values</th>
                  <th className="p-4">Missing %</th>
                  <th className="p-4">Unique Values</th>
                </tr>
              </thead>

              <tbody>
                {report.columnDetails.map((column) => (
                  <tr
                    key={column.name}
                    className="border-t border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4 font-medium text-white">
                      {column.name}
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        column.type === "Numerical"
                          ? "bg-sky-400/10 text-sky-400"
                          : column.type === "Categorical"
                          ? "bg-purple-400/10 text-purple-400"
                          : "bg-gray-400/10 text-gray-400"
                      }`}>
                        {column.type}
                      </span>
                    </td>

                    <td className="p-4 text-gray-300">
                      {column.missing}
                    </td>

                    <td className="p-4 text-gray-300">
                      {column.missingPercentage.toFixed(2)}%
                    </td>

                    <td className="p-4 text-gray-300">
                      {column.uniqueValues}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </section>

      {/* SECTION 3: COLUMN TYPE DISTRIBUTION */}

      <section className="mb-10">

        <div className="flex items-center gap-3 mb-5">
          <BarChart3 className="text-sky-400" size={22} />

          <h2 className="text-xl font-semibold">
            Column Distribution
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <div className="bg-black/60 border border-white/10 rounded-2xl p-5">
            <h3 className="font-semibold mb-1">
              Numerical vs Categorical
            </h3>

            <p className="text-sm text-gray-400 mb-5">
              Distribution of column data types
            </p>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Numerical",
                        value: report.numericColumns.length,
                      },
                      {
                        name: "Categorical",
                        value: report.categoricalColumns.length,
                      },
                      {
                        name: "Empty",
                        value: report.columnDetails.filter(
                          (column) => column.type === "Empty"
                        ).length,
                      },
                    ].filter((item) => item.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={index} fill={color} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background: "#111",
                      border: "1px solid #333",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-black/60 border border-white/10 rounded-2xl p-5">
            <h3 className="font-semibold mb-1">
              Missing Values by Column
            </h3>

            <p className="text-sm text-gray-400 mb-5">
              Number of empty cells in each column
            </p>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={report.columnDetails}
                  margin={{ bottom: 45, left: 5, right: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#333"
                  />

                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    tick={{ fill: "#aaa", fontSize: 11 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#aaa" }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#111",
                      border: "1px solid #333",
                      color: "#fff",
                    }}
                  />

                  <Bar
                    dataKey="missing"
                    fill="#38bdf8"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: NUMERICAL ANALYSIS */}

      <section className="mb-10">

        <div className="flex items-center gap-3 mb-5">
          <TrendingUp className="text-sky-400" size={22} />

          <h2 className="text-xl font-semibold">
            Numerical Analysis
          </h2>
        </div>

        {report.numericColumns.length > 0 ? (
          <div className="bg-black/60 border border-white/10 rounded-2xl p-5">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

              <div>
                <h3 className="font-semibold">
                  Numerical Column Statistics
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Select a column to explore its statistical values
                </p>
              </div>

              <select
                value={selectedNumericColumn}
                onChange={(event) =>
                  setSelectedNumericColumn(event.target.value)
                }
                className="bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-400"
              >
                {report.numericColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>

            </div>

            {numericalAnalysis && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

                  {[
                    ["Count", numericalAnalysis.count],
                    ["Mean", numericalAnalysis.mean],
                    ["Median", numericalAnalysis.median],
                    ["Minimum", numericalAnalysis.min],
                    ["Maximum", numericalAnalysis.max],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="bg-white/5 rounded-xl p-4"
                    >
                      <p className="text-xs text-gray-400">
                        {label}
                      </p>

                      <p className="text-xl font-bold mt-2 text-sky-400">
                        {formatNumber(value)}
                      </p>
                    </div>
                  ))}

                </div>

                <h3 className="font-semibold mb-1">
                  Value Distribution
                </h3>

                <p className="text-sm text-gray-400 mb-5">
                  Histogram of {selectedNumericColumn}
                </p>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={numericalAnalysis.histogram}
                      margin={{ bottom: 45, left: 5, right: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#333"
                      />

                      <XAxis
                        dataKey="range"
                        angle={-25}
                        textAnchor="end"
                        interval={0}
                        tick={{ fill: "#aaa", fontSize: 10 }}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#aaa" }}
                      />

                      <Tooltip
                        contentStyle={{
                          background: "#111",
                          border: "1px solid #333",
                          color: "#fff",
                        }}
                      />

                      <Bar
                        dataKey="count"
                        fill="#818cf8"
                        radius={[5, 5, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-gray-400">
            No numerical columns were detected in this dataset.
          </div>
        )}
      </section>

      {/* SECTION 5: CATEGORICAL ANALYSIS */}

      <section className="mb-10">

        <div className="flex items-center gap-3 mb-5">
          <BarChart3 className="text-sky-400" size={22} />

          <h2 className="text-xl font-semibold">
            Categorical Analysis
          </h2>
        </div>

        {report.categoricalColumns.length > 0 ? (
          <div className="bg-black/60 border border-white/10 rounded-2xl p-5">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

              <div>
                <h3 className="font-semibold">
                  Category Frequency
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Top 10 most frequent values
                </p>
              </div>

              <select
                value={selectedCategoryColumn}
                onChange={(event) =>
                  setSelectedCategoryColumn(event.target.value)
                }
                className="bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-400"
              >
                {report.categoricalColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>

            </div>

            {categoricalAnalysis.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div>
                  <h4 className="text-sm text-gray-300 mb-4">
                    Top Categories
                  </h4>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoricalAnalysis}
                        layout="vertical"
                        margin={{ left: 15, right: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#333"
                        />

                        <XAxis
                          type="number"
                          allowDecimals={false}
                          tick={{ fill: "#aaa" }}
                        />

                        <YAxis
                          type="category"
                          dataKey="name"
                          width={100}
                          tick={{ fill: "#aaa", fontSize: 11 }}
                        />

                        <Tooltip
                          contentStyle={{
                            background: "#111",
                            border: "1px solid #333",
                            color: "#fff",
                          }}
                        />

                        <Bar
                          dataKey="count"
                          fill="#34d399"
                          radius={[0, 5, 5, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-300 mb-4">
                    Category Proportion
                  </h4>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoricalAnalysis}
                          dataKey="count"
                          nameKey="name"
                          outerRadius={110}
                          label
                        >
                          {categoricalAnalysis.map((item, index) => (
                            <Cell
                              key={item.name}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          contentStyle={{
                            background: "#111",
                            border: "1px solid #333",
                            color: "#fff",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-gray-400 py-8">
                No category values are available for this column.
              </p>
            )}

          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-gray-400">
            No categorical columns were detected in this dataset.
          </div>
        )}
      </section>

      {/* FOOTER */}

      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="text-sm text-gray-500">
          Analyxer X — Dataset Analysis Report
        </div>

        <button
          onClick={() => navigate("/CleaningPage")}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-semibold transition"
        >
          <ArrowLeft size={18} />
          Back to Cleaning
        </button>

      </div>

    </div>
  );
};

export default ReportPage;
