import React from "react";
import { useLocation } from "react-router-dom";

const DatasetOverview = () => {
  const location = useLocation();

  // Get backend response from React Router state
  const data = location.state?.data;

  // Handle direct access to /Dashboard
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            No Dataset Found
          </h1>

          <p className="text-gray-500 mt-2">
            Please upload a CSV file first.
          </p>
        </div>
      </div>
    );
  }

  const overview = data.overview;

  // ================================
  // DATASET INFORMATION
  // ================================

  const totalRows = overview.dataset_size.total_rows;

  const totalColumns = overview.dataset_size.total_columns;

  const totalCells = overview.dataset_size.total_cells;

  // ================================
  // MISSING VALUES
  // ================================

  const totalNullValues = overview.missing_values.total;

  const nullPercentage = overview.missing_values.percentage;

  const columnWiseMissing = overview.missing_values.column_wise;

  // ================================
  // DUPLICATES
  // ================================

  const duplicateCount = overview.duplicates.count;

  const duplicatePercentage = overview.duplicates.percentage;

  // ================================
  // COLUMN INFORMATION
  // ================================

  const columns = overview.column_information || [];

  return (
    <div className="space-y-6 w-screen px-6">

      {/* ================================
          DATASET HEADER
      ================================ */}

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Dataset Overview
        </h2>

        <p className="text-gray-500">
          Initial analysis of the uploaded CSV file
        </p>
      </div>

      {/* ================================
          FILE INFORMATION
      ================================ */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="text-xl font-semibold mb-5">
          File Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Filename */}

          <div>
            <p className="text-sm text-gray-500">
              Filename
            </p>

            <p className="font-medium text-gray-800 break-all">
              {data.filename}
            </p>
          </div>

          {/* Dataset Size */}

          <div>
            <p className="text-sm text-gray-500">
              Dataset Size
            </p>

            <p className="font-medium text-gray-800">
              {totalRows} rows × {totalColumns} columns
            </p>
          </div>

          {/* Shape */}

          <div>
            <p className="text-sm text-gray-500">
              Dataset Shape
            </p>

            <p className="font-medium text-gray-800">
              [{totalRows}, {totalColumns}]
            </p>
          </div>

        </div>
      </div>

      {/* ================================
          SUMMARY CARDS
      ================================ */}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">

        {/* Total Rows */}

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Total Rows
          </p>

          <h3 className="text-3xl font-bold text-blue-600 mt-2">
            {totalRows}
          </h3>
        </div>

        {/* Total Columns */}

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Total Columns
          </p>

          <h3 className="text-3xl font-bold text-green-600 mt-2">
            {totalColumns}
          </h3>
        </div>

        {/* Total Null Values */}

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Total Null Values
          </p>

          <h3 className="text-3xl font-bold text-red-500 mt-2">
            {totalNullValues}
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            {nullPercentage}%
          </p>
        </div>

        {/* Duplicate Count */}

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Duplicate Rows
          </p>

          <h3 className="text-3xl font-bold text-orange-500 mt-2">
            {duplicateCount}
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            {duplicatePercentage}%
          </p>
        </div>

        {/* Columns With Missing Values */}

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Columns With Nulls
          </p>

          <h3 className="text-3xl font-bold text-purple-600 mt-2">
            {Object.values(columnWiseMissing)
              .filter((value) => value > 0)
              .length}
          </h3>
        </div>

        {/* Total Cells */}

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Total Cells
          </p>

          <h3 className="text-3xl font-bold text-indigo-600 mt-2">
            {totalCells}
          </h3>
        </div>

      </div>

      {/* ================================
          DATA QUALITY SUMMARY
      ================================ */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="text-xl font-semibold mb-5">
          Data Quality Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Missing Values */}

          <div className="border rounded-lg p-5">

            <div className="flex justify-between">

              <span className="text-gray-600">
                Missing Values
              </span>

              <span className="font-semibold text-red-500">
                {nullPercentage}%
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">

              <div
                className="bg-red-500 h-3 rounded-full"
                style={{
                  width: `${Math.min(nullPercentage, 100)}%`,
                }}
              />

            </div>

            <p className="text-sm text-gray-500 mt-2">
              {totalNullValues} missing values
            </p>

          </div>

          {/* Duplicates */}

          <div className="border rounded-lg p-5">

            <div className="flex justify-between">

              <span className="text-gray-600">
                Duplicate Rows
              </span>

              <span className="font-semibold text-orange-500">
                {duplicatePercentage}%
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">

              <div
                className="bg-orange-500 h-3 rounded-full"
                style={{
                  width: `${Math.min(duplicatePercentage, 100)}%`,
                }}
              />

            </div>

            <p className="text-sm text-gray-500 mt-2">
              {duplicateCount} duplicate rows
            </p>

          </div>

        </div>
      </div>

      {/* ================================
          COLUMN INFORMATION
      ================================ */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="text-xl font-semibold mb-5">
          Column Information
        </h3>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>

              <tr className="border-b bg-gray-50">

                <th className="p-3">
                  #
                </th>

                <th className="p-3">
                  Original Column
                </th>

                <th className="p-3">
                  Normalized Column
                </th>

                <th className="p-3">
                  Data Type
                </th>

                <th className="p-3">
                  Missing Values
                </th>

              </tr>

            </thead>

            <tbody>

              {columns.map((column, index) => (

                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3 text-gray-500">
                    {index + 1}
                  </td>

                  <td className="p-3 font-medium">
                    {column.column_name}
                  </td>

                  <td className="p-3">

                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {column.normalized_column_name}
                    </span>

                  </td>

                  <td className="p-3">

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {column.datatype}
                    </span>

                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        column.missing_value > 0
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
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

      {/* ================================
          STATISTICAL DESCRIPTION
      ================================ */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="text-xl font-semibold mb-5">
          Statistical Description
        </h3>

        <div className="overflow-x-auto">

          <table className="w-full text-left scale-95">

            <thead>

              <tr className="border-b bg-gray-50">

                <th className="p-3">
                  Statistic
                </th>

                {Object.keys(overview.describe || {}).map(
                  (column) => (

                    <th
                      key={column}
                      className="p-3 whitespace-nowrap"
                    >
                      {column}
                    </th>

                  )
                )}

              </tr>

            </thead>

            <tbody>

              {overview.describe &&
                Object.keys(overview.describe).length > 0 &&
                Object.keys(
                  overview.describe[
                    Object.keys(overview.describe)[0]
                  ] || {}
                ).map((statistic) => (

                  <tr
                    key={statistic}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3 font-medium">
                      {statistic}
                    </td>

                    {Object.keys(overview.describe).map(
                      (column) => (

                        <td
                          key={column}
                          className="p-3 whitespace-nowrap"
                        >
                          {overview.describe[column][statistic] ??
                            "-"}
                        </td>

                      )
                    )}

                  </tr>

                ))}

            </tbody>

          </table>

        </div>
      </div>

      {/* ================================
          DATA PREVIEW
      ================================ */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="text-xl font-semibold mb-5">
          Dataset Preview
        </h3>

        <div className="overflow-x-auto py-5">

          <table className="w-full text-left">

            <thead>

              <tr className="border-b bg-gray-50">

                {overview.Preview?.length > 0 &&
                  Object.keys(overview.Preview[0]).map(
                    (column) => (

                      <th
                        key={column}
                        className="p-3 whitespace-nowrap"
                      >
                        {column}
                      </th>

                    )
                  )}

              </tr>

            </thead>

            <tbody>

              {overview.Preview?.map((row, index) => (

                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  {Object.values(row).map(
                    (value, cellIndex) => (

                      <td
                        key={cellIndex}
                        className="p-3 whitespace-nowrap"
                      >
                        {value === null ||
                        value === undefined ||
                        value === ""
                          ? "-"
                          : String(value)}
                      </td>

                    )
                  )}

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
};

export default DatasetOverview;