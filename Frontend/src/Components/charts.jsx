
import React, { useState } from 'react';

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
    LineChart,
    Line
} from 'recharts';


import {
    ChartNoAxesColumn,
    Database,
    Activity,
    ChartPie,
    AlertCircle
} from 'lucide-react';


// Chart colors
const COLORS = [
    '#6366f1',
    '#8b5cf6',
    '#06b6d4',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#14b8a6'
];


const Charts = () => {

    // =====================================
    // 1. GET STORED DATASET
    // =====================================

   const data = (() => {
    try {
        const storedData = sessionStorage.getItem("uploadeddata");

        return storedData ? JSON.parse(storedData) : null;

    } catch (error) {
        console.error("Dataset retrieval error:", error);
        return null;
    }
})();

    const overview = data?.overview;


    // =====================================
    // 2. EXTRACT DATASET INFORMATION
    // =====================================

    const datasetSize = overview?.dataset_size || {};

    const missingValues =
        overview?.missing_values || {};

    const duplicates =
        overview?.duplicates || {};

    const columns =
        overview?.column_information || [];

    const describe =
        overview?.describe || {};


    // =====================================
    // 3. IDENTIFY NUMERICAL COLUMNS
    // =====================================

    const numericColumns = Object.keys(describe).filter(
        (column) => {

            const stats = describe[column];

            return (
                stats &&
                stats.mean !== null &&
                stats.mean !== undefined &&
                Number.isFinite(Number(stats.mean))
            );
        }
    );


    // =====================================
    // 4. STATE MANAGEMENT
    // =====================================

    const [selectedColumn, setSelectedColumn] = useState(
        numericColumns[0] || ''
    );


    // =====================================
    // 5. MISSING VALUES CHART DATA
    // =====================================

    const missingChartData = Object.entries(
        missingValues.column_wise || {}
    ).map(([column, count]) => ({

        column: column,

        missing: Number(count)

    })).filter(
        (item) => Number.isFinite(item.missing)
    );


    // =====================================
    // 6. DATA TYPE DISTRIBUTION
    // =====================================

    const dataTypeCounts = columns.reduce(
        (result, column) => {

            const type = column.datatype || 'Unknown';

            result[type] = (result[type] || 0) + 1;

            return result;

        },
        {}
    );


    const dataTypeChartData = Object.entries(
        dataTypeCounts
    ).map(([name, value]) => ({

        name,

        value

    }));


    // =====================================
    // 7. NUMERICAL STATISTICS
    // =====================================

    const selectedStats = describe[selectedColumn] || {};


    const statisticalChartData = [

        {
            statistic: 'Minimum',
            value: selectedStats.min
        },

        {
            statistic: '25%',
            value: selectedStats['25%']
        },

        {
            statistic: 'Median',
            value: selectedStats['50%']
        },

        {
            statistic: '75%',
            value: selectedStats['75%']
        },

        {
            statistic: 'Maximum',
            value: selectedStats.max
        }

    ].filter(
        (item) =>
            item.value !== null &&
            item.value !== undefined &&
            Number.isFinite(Number(item.value))
    ).map((item) => ({

        ...item,

        value: Number(item.value)

    }));


    // =====================================
    // 8. NO DATASET HANDLING
    // =====================================

    if (!overview) {

        return (

            <div className="min-h-full flex justify-center
                items-center bg-slate-950 text-white">

                <div className="text-center bg-white/10
                    p-10 rounded-xl">

                    <AlertCircle
                        size={45}
                        className="mx-auto mb-4 text-red-400"
                    />

                    <h1 className="text-2xl font-bold">
                        No Dataset Found
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Please upload a CSV file first.
                    </p>

                </div>

            </div>

        );
    }


    // =====================================
    // 9. MAIN CHART DASHBOARD
    // =====================================

    return (

        <div className="min-h-full w-full bg-slate-950
            text-white p-6 md:p-8 space-y-8">


            {/* =====================================
                HEADER
            ===================================== */}

            <div>

                <h1 className="text-3xl font-bold">
                    Data Visualization
                </h1>

                <p className="text-gray-400 mt-2">
                    Visual analysis of your uploaded dataset.
                </p>

                <p className="text-sm text-violet-400 mt-2">
                    File: {data.filename || 'Uploaded Dataset'}
                </p>

            </div>


            {/* =====================================
                DATASET SUMMARY CARDS
            ===================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2
                lg:grid-cols-4 gap-5">


                {/* Total Rows */}

                <div className="bg-white rounded-xl p-5 text-gray-900">

                    <div className="flex justify-between">

                        <p className="text-gray-500">
                            Total Rows
                        </p>

                        <Database className="text-blue-600" />

                    </div>

                    <h2 className="text-3xl font-bold mt-3 text-blue-600">

                        {datasetSize.total_rows ?? 0}

                    </h2>

                </div>


                {/* Total Columns */}

                <div className="bg-white rounded-xl p-5 text-gray-900">

                    <div className="flex justify-between">

                        <p className="text-gray-500">
                            Total Columns
                        </p>

                        <ChartNoAxesColumn className="text-green-600" />

                    </div>

                    <h2 className="text-3xl font-bold mt-3 text-green-600">

                        {datasetSize.total_columns ?? 0}

                    </h2>

                </div>


                {/* Missing Values */}

                <div className="bg-white rounded-xl p-5 text-gray-900">

                    <div className="flex justify-between">

                        <p className="text-gray-500">
                            Missing Values
                        </p>

                        <Activity className="text-red-500" />

                    </div>

                    <h2 className="text-3xl font-bold mt-3 text-red-500">

                        {missingValues.total ?? 0}

                    </h2>

                </div>


                {/* Duplicate Rows */}

                <div className="bg-white rounded-xl p-5 text-gray-900">

                    <div className="flex justify-between">

                        <p className="text-gray-500">
                            Duplicate Rows
                        </p>

                        <ChartPie className="text-orange-500" />

                    </div>

                    <h2 className="text-3xl font-bold mt-3 text-orange-500">

                        {duplicates.count ?? 0}

                    </h2>

                </div>

            </div>


            {/* =====================================
                CHART GRID - ROW 1
            ===================================== */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


                {/* =====================================
                    CHART 1 - MISSING VALUES
                ===================================== */}

                <div className="bg-white rounded-xl p-6
                    text-gray-900 shadow-xl">

                    <h2 className="text-xl font-semibold">

                        Missing Values Analysis

                    </h2>

                    <p className="text-sm text-gray-500 mt-2 mb-6">

                        Missing values across dataset columns.

                    </p>


                    {missingChartData.some(
                        (item) => item.missing > 0
                    ) ? (

                        <ResponsiveContainer width="100%" height={320}>

                            <BarChart data={missingChartData}>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="column"
                                    angle={-25}
                                    textAnchor="end"
                                    interval={0}
                                    height={85}
                                />

                                <YAxis
                                    allowDecimals={false}
                                />

                                <Tooltip />

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

                        <div className="h-80 flex justify-center
                            items-center text-green-600">

                            No missing values found.

                        </div>

                    )}

                </div>


                {/* =====================================
                    CHART 2 - DATA TYPE DISTRIBUTION
                ===================================== */}

                <div className="bg-white rounded-xl p-6
                    text-gray-900 shadow-xl">

                    <h2 className="text-xl font-semibold">

                        Column Data Type Distribution

                    </h2>

                    <p className="text-sm text-gray-500 mt-2 mb-6">

                        Distribution of numerical and categorical columns.

                    </p>


                    {dataTypeChartData.length > 0 ? (

                        <ResponsiveContainer width="100%" height={320}>

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
                                                fill={COLORS[index % COLORS.length]}
                                            />

                                        )
                                    )}

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    ) : (

                        <div className="h-80 flex justify-center
                            items-center text-gray-500">

                            No column information available.

                        </div>

                    )}

                </div>

            </div>


            {/* =====================================
                CHART 3 - NUMERICAL STATISTICS
            ===================================== */}

            <div className="bg-white rounded-xl p-6
                text-gray-900 shadow-xl">


                <h2 className="text-xl font-semibold">

                    Numerical Statistical Analysis

                </h2>


                <p className="text-sm text-gray-500 mt-2 mb-5">

                    Compare minimum, quartiles, median and maximum
                    for numerical columns.

                </p>


                {/* COLUMN SELECTOR */}

                <div className="mb-6">

                    <label className="block text-sm font-medium mb-2">

                        Select Numerical Column

                    </label>


                    <select

                        value={selectedColumn}

                        onChange={(event) =>
                            setSelectedColumn(event.target.value)
                        }

                        className="border border-gray-300
                            rounded-lg p-3 w-full md:w-80
                            bg-white text-gray-900"

                    >

                        {numericColumns.map((column) => (

                            <option key={column} value={column}>

                                {column}

                            </option>

                        ))}

                    </select>

                </div>


                {/* STATISTICS CHART */}

                {statisticalChartData.length > 0 ? (

                    <ResponsiveContainer width="100%" height={350}>

                        <BarChart data={statisticalChartData}>

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis dataKey="statistic" />

                            <YAxis />

                            <Tooltip />

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

                    <div className="h-80 flex justify-center
                        items-center text-gray-500">

                        No numerical statistical data available.

                    </div>

                )}

            </div>


            {/* =====================================
                DATASET QUALITY INFORMATION
            ===================================== */}

            <div className="bg-white rounded-xl p-6
                text-gray-900 shadow-xl">

                <h2 className="text-xl font-semibold mb-5">

                    Dataset Quality Information

                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    {/* Missing Percentage */}

                    <div className="border rounded-lg p-5">

                        <p className="text-gray-500">

                            Missing Values Percentage

                        </p>

                        <h2 className="text-3xl font-bold
                            text-red-500 mt-3">

                            {missingValues.percentage ?? 0}%

                        </h2>

                    </div>


                    {/* Duplicate Percentage */}

                    <div className="border rounded-lg p-5">

                        <p className="text-gray-500">

                            Duplicate Rows Percentage

                        </p>

                        <h2 className="text-3xl font-bold
                            text-orange-500 mt-3">

                            {duplicates.percentage ?? 0}%

                        </h2>

                    </div>


                </div>

            </div>


        </div>

    );

};

export default Charts;
