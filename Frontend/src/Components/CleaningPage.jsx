
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    BrushCleaning,
    Database,
    Rows3,
    Columns3,
    AlertCircle,
    CheckCircle2,
    ChevronDown,
    Play,
    RotateCcw,
    Settings2,
    Download,
    LoaderCircle,
    BarChart3
} from "lucide-react";

import Whity from "../assets/Whity.jpg";

const API_URL = "http://127.0.0.1:8000";

const CLEANING_OPTIONS = [
    { value: "keep", label: "Keep Missing Values" },
    { value: "drop_rows", label: "Remove Rows" },
    { value: "fill_mean", label: "Fill with Mean" },
    { value: "fill_median", label: "Fill with Median" },
    { value: "fill_mode", label: "Fill with Mode" },
    { value: "fill_custom", label: "Fill with Custom Value" }
];

const CleaningPage = () => {

    const navigate = useNavigate();

    // ==========================================
    // 1. GET UPLOADED DATASET
    // ==========================================

    const uploadedData = useMemo(() => {
        try {
            const storedData = sessionStorage.getItem("uploadeddata");
            return storedData ? JSON.parse(storedData) : null;
        } catch (error) {
            console.error("Dataset retrieval error:", error);
            return null;
        }
    }, []);

    const overview = uploadedData?.overview;
    const columns = overview?.column_information || [];
    const datasetId = uploadedData?.dataset_id;

    // ==========================================
    // 2. STATES
    // ==========================================

    const [missingRules, setMissingRules] = useState({});
    const [removeDuplicates, setRemoveDuplicates] = useState(true);
    const [normalizeColumns, setNormalizeColumns] = useState(true);
    const [customValues, setCustomValues] = useState({});
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState("");
    const [cleanedOutput, setCleanedOutput] = useState(null);

    // ==========================================
    // 3. DATASET INFORMATION
    // ==========================================

    const totalRows = overview?.dataset_size?.total_rows || 0;
    const totalColumns = overview?.dataset_size?.total_columns || 0;
    const totalMissing = overview?.missing_values?.total || 0;
    const totalDuplicates = overview?.duplicates?.count || 0;

    // ==========================================
    // 4. COLUMN INFORMATION HELPERS
    // ==========================================

    const getColumnName = (column) => {
        return (
            column.normalized_column_name ||
            column.normalized_name ||
            column.column_name ||
            column.name
        );
    };

    const getOriginalColumnName = (column) => {
        return (
            column.column_name ||
            column.name ||
            getColumnName(column)
        );
    };

    const getMissingCount = (column) => {
        return Number(
            column.missing_value ??
            column.missing_values ??
            column.missing_count ??
            0
        );
    };

    // ==========================================
    // 5. UPDATE STRATEGY
    // ==========================================

    const handleStrategyChange = (column, strategy) => {
        setMissingRules((previous) => ({
            ...previous,
            [column]: strategy
        }));

        setCleanedOutput(null);
        setError("");
    };

    // ==========================================
    // 6. UPDATE CUSTOM VALUE
    // ==========================================

    const handleCustomValueChange = (column, value) => {
        setCustomValues((previous) => ({
            ...previous,
            [column]: value
        }));

        setCleanedOutput(null);
        setError("");
    };

    // ==========================================
    // 7. RESET CONFIGURATION
    // ==========================================

    const handleReset = () => {
        setMissingRules({});
        setCustomValues({});
        setRemoveDuplicates(true);
        setNormalizeColumns(true);
        setCleanedOutput(null);
        setError("");
    };

    // ==========================================
    // 8. APPLY CLEANING
    // ==========================================

    const handleApplyCleaning = async () => {

        if (loading) return;

        if (!datasetId) {
            setError(
                "Dataset ID is missing. Please upload your dataset again."
            );
            console.error("Uploaded dataset:", uploadedData);
            return;
        }

        // Validate custom values.
        for (const [column, strategy] of Object.entries(missingRules)) {

            if (
                strategy === "fill_custom" &&
                (
                    customValues[column] === undefined ||
                    String(customValues[column]).trim() === ""
                )
            ) {
                setError(
                    `Enter a custom replacement value for ${column}.`
                );
                return;
            }
        }

        setLoading(true);
        setError("");
        setCleanedOutput(null);

        try {

            const customValuesPayload = {};

            Object.entries(missingRules).forEach(
                ([column, strategy]) => {

                    if (strategy === "fill_custom") {
                        customValuesPayload[column] = customValues[column];
                    }
                }
            );

            const payload = {
                dataset_id: datasetId,
                missing_rules: missingRules,
                custom_values: customValuesPayload,
                remove_duplicates: removeDuplicates,
                normalize_columns: normalizeColumns
            };

            console.log("Cleaning request:", payload);

            const response = await axios.post(
                `${API_URL}/Processing/`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 120000
                }
            );

            console.log("Cleaning response:", response.data);

            const output =
                response.data?.cleaned_output ||
                response.data?.data ||
                response.data;

            if (
                !output ||
                !output.cleaning_summary
            ) {
                throw new Error(
                    "The backend response does not contain cleaning summary."
                );
            }

            if (!Array.isArray(output.complete_data)) {
                throw new Error(
                    "The backend did not return complete_data. Update cleaned_dataset_output.py first."
                );
            }

            setCleanedOutput(output);

        } catch (err) {

            console.error("Cleaning request failed:", err);

            setError(
                err.response?.data?.detail ||
                err.message ||
                "Unable to process the dataset. Please check your backend."
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 9. DOWNLOAD CLEANED DATASET
    // ==========================================

    const handleDownload = async () => {

        if (!datasetId || downloading) return;

        if (!cleanedOutput) {
            setError("Please clean the dataset before downloading.");
            return;
        }

        setDownloading(true);
        setError("");

        try {

            const response = await axios.get(
                `${API_URL}/Export/${datasetId}`,
                {
                    responseType: "blob",
                    timeout: 120000
                }
            );

            const blob = new Blob(
                [response.data],
                { type: "text/csv;charset=utf-8;" }
            );

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "cleaned_dataset.csv";

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error("Download error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to download the cleaned dataset."
            );

        } finally {
            setDownloading(false);
        }
    };

    // ==========================================
    // 10. NAVIGATE TO REPORT PAGE
    // ==========================================

    const handleViewReport = () => {

        if (!cleanedOutput?.complete_data) {
            setError("Cleaned dataset is not available for reporting.");
            return;
        }

        navigate("/Report", {
            state: {
                datasetId,
                cleanedOutput
            }
        });
    };

    // ==========================================
    // 11. EMPTY DATASET HANDLING
    // ==========================================

    if (!overview) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">

                <div className="rounded-xl border border-gray-800 bg-black/70 p-8 text-center">

                    <AlertCircle
                        size={40}
                        className="mx-auto mb-4 text-orange-400"
                    />

                    <h2 className="text-xl font-semibold">
                        No Dataset Found
                    </h2>

                    <p className="mt-2 text-sm text-gray-400">
                        Please upload a dataset before starting cleaning.
                    </p>

                    <button
                        onClick={() => navigate("/Dashboard")}
                        className="mt-5 rounded-lg bg-blue-600 px-5 py-2 hover:bg-blue-500"
                    >
                        Back to Dashboard
                    </button>

                </div>
            </div>
        );
    }

    // ==========================================
    // 12. STYLING
    // ==========================================

    const cardStyle = `
        rounded-xl
        border border-[#292929]
        bg-[#080808a8]
        backdrop-blur-xl
    `;

    const inputStyle = `
        w-full rounded-lg
        border border-gray-700
        bg-[#151515]
        px-3 py-2.5
        text-sm text-white
        outline-none
        focus:border-blue-500
    `;

    // ==========================================
    // 13. MAIN UI
    // ==========================================

    return (

        <div
            className="relative min-h-screen w-full bg-black bg-cover bg-center p-5 md:p-8"
            style={{ backgroundImage: `url(${Whity})` }}
        >

            <div className="fixed inset-0 pointer-events-none bg-black/35" />

            <div className="relative z-10 space-y-7">

                {/* HEADER */}

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                    <div className="flex items-center gap-3">

                        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3">
                            <BrushCleaning size={28} className="text-blue-400" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Data Cleaning
                            </h1>

                            <p className="mt-1 text-sm text-gray-400">
                                Configure how you want to clean your dataset.
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={handleReset}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-black/50 px-4 py-3 text-sm text-gray-300 transition hover:border-white hover:text-white"
                    >
                        <RotateCcw size={16} />
                        Reset Configuration
                    </button>

                </div>

                {/* DATASET SUMMARY */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {[
                        {
                            title: "Total Rows",
                            value: totalRows,
                            icon: Rows3,
                            color: "text-blue-400"
                        },
                        {
                            title: "Total Columns",
                            value: totalColumns,
                            icon: Columns3,
                            color: "text-purple-400"
                        },
                        {
                            title: "Missing Values",
                            value: totalMissing,
                            icon: AlertCircle,
                            color: "text-red-400"
                        },
                        {
                            title: "Duplicate Rows",
                            value: totalDuplicates,
                            icon: Database,
                            color: "text-orange-400"
                        }
                    ].map((item) => {

                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className={`${cardStyle} p-5 transition hover:border-gray-600`}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-400">
                                        {item.title}
                                    </p>

                                    <Icon size={20} className={item.color} />
                                </div>

                                <h2 className={`mt-3 text-3xl font-semibold ${item.color}`}>
                                    {Number(item.value).toLocaleString()}
                                </h2>
                            </div>
                        );
                    })}

                </div>

                {/* MISSING VALUE CONFIGURATION */}

                <div className={`${cardStyle} p-5 md:p-7`}>

                    <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">

                        <div>
                            <div className="flex items-center gap-2">
                                <Settings2 size={21} className="text-blue-400" />

                                <h2 className="text-xl font-semibold text-white">
                                    Missing Value Configuration
                                </h2>
                            </div>

                            <p className="mt-2 text-sm text-gray-400">
                                Choose an individual missing-value strategy for each column.
                            </p>
                        </div>

                        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2">
                            <p className="text-xs text-blue-300">
                                {Object.keys(missingRules).length} column rules configured
                            </p>
                        </div>

                    </div>

                    <div className="overflow-x-auto rounded-xl border border-gray-800">

                        <table className="w-full min-w-[850px] text-left">

                            <thead className="bg-[#151515]">
                                <tr>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Column Name
                                    </th>

                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Data Type
                                    </th>

                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Missing Values
                                    </th>

                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Cleaning Strategy
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {columns.map((column, index) => {

                                    const columnName = getColumnName(column);
                                    const missingCount = getMissingCount(column);
                                    const strategy = missingRules[columnName] || "keep";

                                    return (
                                        <tr
                                            key={`${columnName}-${index}`}
                                            className="border-t border-gray-800 transition hover:bg-white/[0.03]"
                                        >

                                            <td className="px-5 py-4">
                                                <p className="font-medium text-white">
                                                    {getOriginalColumnName(column)}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {columnName}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                                                    {column.datatype || column.dtype || "Unknown"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs ${
                                                        missingCount > 0
                                                            ? "bg-red-500/10 text-red-400"
                                                            : "bg-green-500/10 text-green-400"
                                                    }`}
                                                >
                                                    {missingCount}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">

                                                <div className="flex flex-col gap-2">

                                                    <div className="relative">

                                                        <select
                                                            value={strategy}
                                                            onChange={(event) =>
                                                                handleStrategyChange(
                                                                    columnName,
                                                                    event.target.value
                                                                )
                                                            }
                                                            className={inputStyle}
                                                        >

                                                            {CLEANING_OPTIONS.map((option) => (
                                                                <option
                                                                    key={option.value}
                                                                    value={option.value}
                                                                    disabled={
                                                                        missingCount === 0 &&
                                                                        option.value !== "keep"
                                                                    }
                                                                >
                                                                    {option.label}
                                                                </option>
                                                            ))}

                                                        </select>

                                                        <ChevronDown
                                                            size={16}
                                                            className="pointer-events-none absolute right-3 top-3 text-gray-500"
                                                        />

                                                    </div>

                                                    {strategy === "fill_custom" && (
                                                        <input
                                                            type="text"
                                                            placeholder="Enter replacement value"
                                                            value={customValues[columnName] ?? ""}
                                                            onChange={(event) =>
                                                                handleCustomValueChange(
                                                                    columnName,
                                                                    event.target.value
                                                                )
                                                            }
                                                            className={inputStyle}
                                                        />
                                                    )}

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>

                    <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">

                        <AlertCircle
                            size={16}
                            className="shrink-0 text-blue-400"
                        />

                        <p>
                            Selecting Remove Rows for a column removes records where that particular column is missing. Other columns configured to Keep Missing Values are not independently filled.
                        </p>

                    </div>

                </div>

                {/* GLOBAL CLEANING OPERATIONS */}

                <div className={`${cardStyle} p-5 md:p-7`}>

                    <h2 className="mb-2 text-xl font-semibold text-white">
                        Global Cleaning Operations
                    </h2>

                    <p className="mb-6 text-sm text-gray-400">
                        Configure operations that apply to the entire dataset.
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-gray-800 bg-black/30 p-5 transition hover:border-orange-500/50">

                            <input
                                type="checkbox"
                                checked={removeDuplicates}
                                onChange={(event) => {
                                    setRemoveDuplicates(event.target.checked);
                                    setCleanedOutput(null);
                                }}
                                className="mt-1 h-4 w-4 accent-orange-500"
                            />

                            <div className="flex-1">

                                <div className="flex items-center gap-2">
                                    <Database size={19} className="text-orange-400" />

                                    <h3 className="font-medium text-white">
                                        Remove Duplicate Rows
                                    </h3>
                                </div>

                                <p className="mt-2 text-sm text-gray-400">
                                    Remove repeated records from the complete dataset.
                                </p>

                                <p className="mt-2 text-xs text-orange-300">
                                    {totalDuplicates} duplicate rows detected
                                </p>

                            </div>

                        </label>

                        <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-gray-800 bg-black/30 p-5 transition hover:border-purple-500/50">

                            <input
                                type="checkbox"
                                checked={normalizeColumns}
                                onChange={(event) => {
                                    setNormalizeColumns(event.target.checked);
                                    setCleanedOutput(null);
                                }}
                                className="mt-1 h-4 w-4 accent-purple-500"
                            />

                            <div className="flex-1">

                                <div className="flex items-center gap-2">
                                    <Columns3 size={19} className="text-purple-400" />

                                    <h3 className="font-medium text-white">
                                        Normalize Column Names
                                    </h3>
                                </div>

                                <p className="mt-2 text-sm text-gray-400">
                                    Convert column names into lowercase, underscore-separated names.
                                </p>

                                <p className="mt-2 text-xs text-purple-300">
                                    Example: Customer Name → customer_name
                                </p>

                            </div>

                        </label>

                    </div>

                </div>

                {/* APPLY CLEANING */}

                <div className={`${cardStyle} p-6`}>

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Ready to Clean Your Dataset?
                            </h2>

                            <p className="mt-2 text-sm text-gray-400">
                                Your selected configurations will be applied together.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleApplyCleaning}
                            disabled={loading || !datasetId}
                            className="flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={19}
                                        className="animate-spin"
                                    />
                                    Processing Dataset...
                                </>
                            ) : (
                                <>
                                    <Play size={18} />
                                    Apply Cleaning
                                </>
                            )}

                        </button>

                    </div>

                    {error && (
                        <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">

                            <AlertCircle size={19} className="shrink-0" />

                            <span>{error}</span>

                        </div>
                    )}

                </div>

                {/* CLEANING COMPLETED - NO PREVIEW */}

                {cleanedOutput && (

                    <div className={`${cardStyle} space-y-6 p-6 md:p-8`}>

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3">
                                <CheckCircle2
                                    size={28}
                                    className="text-green-400"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-white">
                                    Dataset Cleaning Completed
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    Your dataset has been successfully processed.
                                </p>
                            </div>

                        </div>

                        {/* CLEANING SUMMARY */}

                        {cleanedOutput.cleaning_summary && (

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                                {[
                                    {
                                        label: "Original Rows",
                                        value: cleanedOutput.cleaning_summary.original_rows
                                    },
                                    {
                                        label: "Cleaned Rows",
                                        value: cleanedOutput.cleaning_summary.cleaned_rows
                                    },
                                    {
                                        label: "Duplicates Removed",
                                        value: cleanedOutput.cleaning_summary.duplicates_removed
                                    },
                                    {
                                        label: "Missing Values Handled",
                                        value: cleanedOutput.cleaning_summary.missing_values_handled
                                    }
                                ].map((item) => (

                                    <div
                                        key={item.label}
                                        className="rounded-xl border border-gray-800 bg-black/40 p-4"
                                    >

                                        <p className="text-xs text-gray-400">
                                            {item.label}
                                        </p>

                                        <h3 className="mt-2 text-2xl font-semibold text-green-400">
                                            {Number(item.value ?? 0).toLocaleString()}
                                        </h3>

                                    </div>

                                ))}

                            </div>

                        )}

                        {/* ACTION BUTTONS */}

                        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">

                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={downloading}
                                className="flex items-center justify-center gap-3 rounded-xl border border-green-500/30 bg-green-600/15 px-6 py-5 font-semibold text-green-300 transition hover:bg-green-600/25 disabled:opacity-50"
                            >

                                {downloading ? (
                                    <LoaderCircle
                                        size={22}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Download size={22} />
                                )}

                                {downloading
                                    ? "Downloading CSV..."
                                    : "Download Cleaned CSV"}

                            </button>

                            <button
                                type="button"
                                onClick={handleViewReport}
                                className="flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-5 font-semibold text-white transition hover:bg-blue-500"
                            >

                                <BarChart3 size={22} />

                                View Report & Charts

                            </button>

                        </div>

                        <p className="text-center text-xs text-gray-500">
                            Download your cleaned dataset or continue to the Report Page to explore updated charts and analytical insights.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default CleaningPage;
