
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mariola from "../assets/Whity.jpg";
import {BrushCleaning} from 'lucide-react'

const DatasetOverview = () => {
    const location = useLocation();

    const navi = useNavigate();

    // Get backend response
    const routerdata = location.state?.data;
    const storeddata = sessionStorage.getItem("uploadeddata");

    const data =
        routerdata ||
        (storeddata ? JSON.parse(storeddata) : null);

    // Handle missing dataset
    if (!data || !data.overview) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="rounded-xl border border-[#292929] bg-[#111111] p-8 text-center">
                    <h1 className="text-2xl font-semibold">
                        No Dataset Found
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Please upload a CSV file first.
                    </p>
                </div>
            </div>
        );
    }

    const overview = data.overview;

    // Dataset information
    const totalRows = overview.dataset_size.total_rows;
    const totalColumns = overview.dataset_size.total_columns;
    const totalCells = overview.dataset_size.total_cells;

    // Missing values
    const totalNullValues = overview.missing_values.total;
    const nullPercentage = overview.missing_values.percentage;
    const columnWiseMissing = overview.missing_values.column_wise;

    // Duplicates
    const duplicateCount = overview.duplicates.count;
    const duplicatePercentage = overview.duplicates.percentage;

    // Column information
    const columns = overview.column_information || [];

    // Statistical description columns
    const describeColumns = Object.keys(overview.describe || {});

    // Statistics
    const statistics =
        describeColumns.length > 0
            ? Object.keys(overview.describe[describeColumns[0]] || {})
            : [];

    // Table styling classes
    const tableContainer =
        "overflow-hidden rounded-xl border border-[#252525] bg-[#08080879] backdrop-blur-lg";

    const tableWrapper = "overflow-x-auto";

    const tableStyle =
        "w-full min-w-max border-collapse text-left text-sm";

    const headerStyle =
        "whitespace-nowrap border-b border-[#292929] px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400";

    const cellStyle =
        "whitespace-nowrap border-b border-[#1e1e1e] px-5 py-4 text-gray-300";

    return (
        <div
            className="relative min-h-screen w-full space-y-6 bg-black bg-cover bg-center p-6"
            style={{ backgroundImage: `url(${mariola})` }}
        >
            {/* Background overlay */}
            <div className="pointer-events-none absolute inset-0 bg-black/30" />

            {/* Main content */}
            <div className="relative z-10 space-y-6">

                {/* DATASET HEADER */}
                <div className="flex flex-row justify-between align-middle items-center">
                    <div>
                    <h2 className="pt-2 text-3xl font-bold tracking-tight text-white">
                        Dataset Overview
                    </h2>

                    <p className="mt-2 text-sm text-gray-400">
                        Initial analysis of the uploaded CSV file
                    </p>
                    </div>

                <div className="flex flex-row justify-between group align-middle items-center p-3 gap-4">                   
                    <h2 className=" text-lg font-light opacity-0 group-hover:opacity-70 group-hover:-translate-x-4 text-white duration-200 delay-150">
                        Let's clean this file
                    </h2>
                    <div onClick={()=>{navi('/CleaningPage')}}  className="p-3 rounded-xl backdrop-blur-md border-[1px] border-white  hover:bg-white cursor-pointer shadow-lg group animate-pulse hover:animate-none hover:scale-110 duration-200 delay-100">
                            <BrushCleaning className="text-white group-hover:text-black duration-200 delay-100" size={28}  />
                        </div>
                </div>
                </div>

                {/* FILE INFORMATION */}
                <div className="rounded-xl border border-[#252525] bg-[#08080879] p-6 backdrop-blur-lg">

                    <h3 className="mb-5 text-xl font-semibold text-white">
                        File Information
                    </h3>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                        <div>
                            <p className="text-sm text-gray-500">
                                Filename
                            </p>

                            <p className="mt-2 break-all font-medium text-gray-200">
                                {data.filename}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Dataset Size
                            </p>

                            <p className="mt-2 font-medium text-gray-200">
                                {totalRows} rows × {totalColumns} columns
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Dataset Shape
                            </p>

                            <p className="mt-2 font-medium text-gray-200">
                                [{totalRows}, {totalColumns}]
                            </p>
                        </div>

                    </div>
                </div>

                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

                    {/* Total Rows */}
                    <div className="rounded-xl border border-[#252525] bg-[#0b0b0b79] p-5 backdrop-blur-lg transition hover:border-gray-600">
                        <p className="text-sm text-gray-400">
                            Total Rows
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-blue-400">
                            {totalRows}
                        </h3>
                    </div>

                    {/* Total Columns */}
                    <div className="rounded-xl border border-[#252525] bg-[#0b0b0b79] p-5 backdrop-blur-lg transition hover:border-gray-600">
                        <p className="text-sm text-gray-400">
                            Total Columns
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-green-400">
                            {totalColumns}
                        </h3>
                    </div>

                    {/* Null Values */}
                    <div className="rounded-xl border border-[#252525] bg-[#0b0b0b79] p-5 backdrop-blur-lg transition hover:border-gray-600">
                        <p className="text-sm text-gray-400">
                            Total Null Values
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-red-400">
                            {totalNullValues}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            {nullPercentage}%
                        </p>
                    </div>

                    {/* Duplicate Rows */}
                    <div className="rounded-xl border border-[#252525] bg-[#0b0b0b79] p-5 backdrop-blur-lg transition hover:border-gray-600">
                        <p className="text-sm text-gray-400">
                            Duplicate Rows
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-orange-400">
                            {duplicateCount}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            {duplicatePercentage}%
                        </p>
                    </div>

                    {/* Columns With Nulls */}
                    <div className="rounded-xl border border-[#252525] bg-[#0b0b0b79] p-5 backdrop-blur-lg transition hover:border-gray-600">
                        <p className="text-sm text-gray-400">
                            Columns With Nulls
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-purple-400">
                            {Object.values(columnWiseMissing)
                                .filter((value) => value > 0).length}
                        </h3>
                    </div>

                    {/* Total Cells */}
                    <div className="rounded-xl border border-[#252525] bg-[#0b0b0b79] p-5 backdrop-blur-lg transition hover:border-gray-600">
                        <p className="text-sm text-gray-400">
                            Total Cells
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-indigo-400">
                            {totalCells}
                        </h3>
                    </div>

                </div>

                {/* DATA QUALITY SUMMARY */}
                <div className="rounded-xl border border-[#252525] bg-[#08080879] p-6 backdrop-blur-lg">

                    <h3 className="mb-5 text-xl font-semibold text-white">
                        Data Quality Summary
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        {/* Missing Values */}
                        <div className="rounded-lg border border-[#292929] bg-[#101010] p-5">

                            <div className="flex justify-between">
                                <span className="text-gray-400">
                                    Missing Values
                                </span>

                                <span className="font-semibold text-red-400">
                                    {nullPercentage}%
                                </span>
                            </div>

                            <div className="mt-3 h-3 w-full rounded-full bg-[#292929]">
                                <div
                                    className="h-3 rounded-full bg-red-500"
                                    style={{
                                        width: `${Math.min(nullPercentage, 100)}%`
                                    }}
                                />
                            </div>

                            <p className="mt-2 text-sm text-gray-500">
                                {totalNullValues} missing values
                            </p>

                        </div>

                        {/* Duplicate Values */}
                        <div className="rounded-lg border border-[#292929] bg-[#101010] p-5">

                            <div className="flex justify-between">
                                <span className="text-gray-400">
                                    Duplicate Rows
                                </span>

                                <span className="font-semibold text-orange-400">
                                    {duplicatePercentage}%
                                </span>
                            </div>

                            <div className="mt-3 h-3 w-full rounded-full bg-[#292929]">
                                <div
                                    className="h-3 rounded-full bg-orange-500"
                                    style={{
                                        width: `${Math.min(duplicatePercentage, 100)}%`
                                    }}
                                />
                            </div>

                            <p className="mt-2 text-sm text-gray-500">
                                {duplicateCount} duplicate rows
                            </p>

                        </div>

                    </div>
                </div>

                {/* COLUMN INFORMATION */}
                <div className={tableContainer}>

                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-white">
                            Column Information
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Overview of column names, data types and missing values
                        </p>
                    </div>

                    <div className={tableWrapper}>

                        <table className={tableStyle}>

                            <thead className="bg-[#141414]">
                                <tr>
                                    <th className={`${headerStyle} sticky left-0 z-10 bg-[#141414]`}>
                                        #
                                    </th>

                                    <th className={headerStyle}>
                                        Original Column
                                    </th>

                                    <th className={headerStyle}>
                                        Normalized Column
                                    </th>

                                    <th className={headerStyle}>
                                        Data Type
                                    </th>

                                    <th className={headerStyle}>
                                        Missing Values
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {columns.map((column, index) => (

                                    <tr
                                        key={index}
                                        className="transition-colors hover:bg-[#171717]"
                                    >

                                        <td className={`${cellStyle} sticky left-0 bg-[#0d0d0d]`}>
                                            {index + 1}
                                        </td>

                                        <td className={cellStyle}>
                                            {column.column_name}
                                        </td>

                                        <td className={cellStyle}>
                                            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-300">
                                                {column.normalized_column_name}
                                            </span>
                                        </td>

                                        <td className={cellStyle}>
                                            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
                                                {column.datatype}
                                            </span>
                                        </td>

                                        <td className={cellStyle}>
                                            <span
                                                className={`rounded-full px-3 py-1 text-sm ${
                                                    column.missing_value > 0
                                                        ? "bg-red-500/10 text-red-400"
                                                        : "bg-green-500/10 text-green-400"
                                                }`}
                                            >
                                                {column.missing_value}
                                            </span>
                                        </td>

                                    </tr>

                                ))}
                            </tbody>

                        </table>

                    </div>
                </div>

                {/* STATISTICAL DESCRIPTION */}
                <div className={tableContainer}>

                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-white">
                            Statistical Description
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Statistical summary of dataset columns
                        </p>
                    </div>

                    <div className={tableWrapper}>

                        <table className={tableStyle}>

                            <thead className="bg-[#141414]">
                                <tr>
                                    <th className={`${headerStyle} sticky left-0 z-10 bg-[#141414]`}>
                                        Statistic
                                    </th>

                                    {describeColumns.map((column) => (
                                        <th
                                            key={column}
                                            className={headerStyle}
                                        >
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>

                                {statistics.map((statistic) => (

                                    <tr
                                        key={statistic}
                                        className="transition-colors hover:bg-[#171717]"
                                    >

                                        <td className={`${cellStyle} sticky left-0 bg-[#0d0d0d] font-medium text-white`}>
                                            {statistic}
                                        </td>

                                        {describeColumns.map((column) => (

                                            <td
                                                key={column}
                                                className={cellStyle}
                                            >
                                                {overview.describe[column][statistic] ?? "-"}
                                            </td>

                                        ))}

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                </div>

                {/* DATASET PREVIEW */}
                <div className={tableContainer}>

                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-white">
                            Dataset Preview
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            First few records from the uploaded dataset
                        </p>
                    </div>

                    <div className={tableWrapper}>

                        <table className={tableStyle}>

                            <thead className="bg-[#141414]">
                                <tr>
                                    <th className={`${headerStyle} sticky left-0 z-10 bg-[#141414]`}>
                                        #
                                    </th>

                                    {overview.Preview?.length > 0 &&
                                        Object.keys(overview.Preview[0]).map((column) => (
                                            <th
                                                key={column}
                                                className={headerStyle}
                                            >
                                                {column}
                                            </th>
                                        ))}
                                </tr>
                            </thead>

                            <tbody>

                                {overview.Preview?.map((row, index) => (

                                    <tr
                                        key={index}
                                        className="transition-colors hover:bg-[#171717]"
                                    >

                                        <td className={`${cellStyle} sticky left-0 bg-[#0d0d0d]`}>
                                            {index + 1}
                                        </td>

                                        {Object.values(row).map((value, cellIndex) => (

                                            <td
                                                key={cellIndex}
                                                className={cellStyle}
                                            >
                                                {value === null ||
                                                value === undefined ||
                                                value === ""
                                                    ? (
                                                        <span className="text-gray-600 italic">
                                                            NULL
                                                        </span>
                                                    )
                                                    : String(value)}
                                            </td>

                                        ))}

                                    </tr>

                                ))}

                                {(!overview.Preview || overview.Preview.length === 0) && (
                                    <tr>
                                        <td
                                            colSpan={2}
                                            className="px-5 py-8 text-center text-gray-500"
                                        >
                                            No preview data available.
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default DatasetOverview;
