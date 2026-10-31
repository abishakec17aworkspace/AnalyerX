
import React, { useMemo, useState } from "react";
import mariola from "../assets/CyberGirl.jpg";

const DataModule = () => {

    // Retrieve uploaded dataset
    const data = (() => {
        try {
            const storedData = sessionStorage.getItem("uploadeddata");
            return storedData ? JSON.parse(storedData) : null;
        } catch (error) {
            console.error("Dataset retrieval error:", error);
            return null;
        }
    })();

    // Get complete dataset
    const rows = Array.isArray(data?.overview?.complete_data)
        ? data.overview.complete_data
        : [];

    // States
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Get columns
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    // Search functionality
    const filteredRows = useMemo(() => {
        return rows.filter((row) =>
            Object.values(row).some((value) =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
        );
    }, [rows, search]);

    // Pagination
    const totalPages =
        rowsPerPage === "all"
            ? 1
            : Math.ceil(filteredRows.length / Number(rowsPerPage));

    const startIndex =
        rowsPerPage === "all"
            ? 0
            : (currentPage - 1) * Number(rowsPerPage);

    const currentRows =
        rowsPerPage === "all"
            ? filteredRows
            : filteredRows.slice(
                startIndex,
                startIndex + Number(rowsPerPage)
            );

    // Handle search
    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    // Handle rows per page
    const handleRowsPerPage = (value) => {
        setRowsPerPage(value === "all" ? "all" : Number(value));
        setCurrentPage(1);
    };

    // Empty dataset
    if (!data || rows.length === 0) {
        return (
            <div className="min-h-screen bg-black p-8 text-white">
                <h1 className="text-2xl font-bold">Dataset Explorer</h1>

                <p className="mt-4 text-gray-500">
                    No complete dataset found. Please upload a CSV file first.
                </p>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen w-full bg-black p-6 text-white bg-cover bg-center"
            style={{ backgroundImage: `url(${mariola})` }}
        >

            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-black">
                        Dataset Explorer
                    </h1>

                    <p className="mt-2 text-sm text-black">
                        Explore and analyze your complete dataset
                    </p>
                </div>

                <div className="rounded-lg border border-[#292929] bg-[#111111] px-4 py-3">
                    <p className="text-xs text-gray-500">CURRENT FILE</p>

                    <p className="mt-1 text-sm font-medium text-gray-200">
                        {data.filename}
                    </p>
                </div>

            </div>

            {/* Dataset Information */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-[#252525] bg-[#0b0b0b15] p-5 transition hover:border-gray-600">
                    <p className="text-sm text-black">Total Rows</p>

                    <h2 className="mt-3 text-3xl font-semibold text-white">
                        {rows.length.toLocaleString()}
                    </h2>
                </div>

                <div className="rounded-xl border border-[#252525] bg-[#0b0b0b17] p-5 transition hover:border-gray-600">
                    <p className="text-sm text-black">Total Columns</p>

                    <h2 className="mt-3 text-3xl font-semibold text-white">
                        {columns.length}
                    </h2>
                </div>

                <div className="rounded-xl border border-[#252525] bg-[#0b0b0b13] p-5 transition hover:border-gray-600">
                    <p className="text-sm text-black">Filtered Rows</p>

                    <h2 className="mt-3 text-3xl font-semibold text-white">
                        {filteredRows.length.toLocaleString()}
                    </h2>
                </div>

            </div>

            {/* Search and Pagination Controls */}
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row">

                <div className="w-full sm:max-w-sm">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search across all columns..."
                        className="w-full rounded-lg border border-[#292929] bg-[#0b0b0b] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-gray-500"
                    />
                </div>

                <select
                    value={rowsPerPage}
                    onChange={(e) => handleRowsPerPage(e.target.value)}
                    className="rounded-lg border border-[#292929] bg-[#0b0b0b] px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-500"
                >
                    <option value={10}>10 rows</option>
                    <option value={20}>20 rows</option>
                    <option value={50}>50 rows</option>
                    <option value="all">All</option>
                </select>

            </div>

            {/* Dataset Table */}
            <div className="overflow-hidden rounded-xl border border-[#252525] bg-[#08080879] backdrop-blur-lg">

                <div className="overflow-x-auto  ">

                    <table className="w-full min-w-max border-collapse text-left text-sm">

                        {/* Table Header */}
                        <thead className="bg-[#141414]">

                            <tr>

                                <th className="sticky left-0 z-10 border-b border-r border-[#292929] bg-[#141414] px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    #
                                </th>

                                {columns.map((column) => (
                                    <th
                                        key={column}
                                        className="whitespace-nowrap border-b border-[#292929] px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400"
                                    >
                                        {column}
                                    </th>
                                ))}

                            </tr>

                        </thead>

                        {/* Table Body */}
                        <tbody>

                            {currentRows.map((row, index) => (

                                <tr
                                    key={startIndex + index}
                                    className="border-b border-[#1e1e1e] transition-colors hover:bg-[#171717]"
                                >

                                    <td className="sticky left-0 border-r border-[#252525] bg-[#0d0d0d] px-5 py-4 text-gray-500">
                                        {startIndex + index + 1}
                                    </td>

                                    {columns.map((column) => (

                                        <td
                                            key={column}
                                            className="whitespace-nowrap px-5 py-4 text-gray-300"
                                        >

                                            {row[column] === null ||
                                            row[column] === undefined ||
                                            row[column] === "" ? (

                                                <span className="text-gray-200 bg-black/75
                                                p-2 rounded-xl italic">
                                                    Null
                                                </span>

                                            ) : (
                                                String(row[column])
                                            )}

                                        </td>

                                    ))}

                                </tr>

                            ))}

                            {currentRows.length === 0 && (

                                <tr>
                                    <td
                                        colSpan={columns.length + 1}
                                        className="px-5 py-12 text-center text-gray-500"
                                    >
                                        No matching records found.
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Pagination Footer */}
            <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">

                <p className="text-sm text-gray-500">
                    Showing{" "}

                    <span className="font-medium text-gray-300">
                        {filteredRows.length === 0 ? 0 : startIndex + 1}
                    </span>

                    {" - "}

                    <span className="font-medium text-gray-300">
                        {rowsPerPage === "all"
                            ? filteredRows.length
                            : Math.min(
                                startIndex + Number(rowsPerPage),
                                filteredRows.length
                            )}
                    </span>

                    {" of "}

                    <span className="font-medium text-gray-300">
                        {filteredRows.length}
                    </span>

                    {" records"}
                </p>

                {rowsPerPage !== "all" && (

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                setCurrentPage((page) => Math.max(page - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="rounded-lg border border-[#292929] bg-[#111111] px-4 py-2 text-sm text-gray-300 transition hover:bg-[#222222] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-400">
                            Page{" "}

                            <span className="font-semibold text-white">
                                {currentPage}
                            </span>

                            {" / "}
                            {Math.max(totalPages, 1)}
                        </span>

                        <button
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(page + 1, totalPages)
                                )
                            }
                            disabled={
                                currentPage >= totalPages || totalPages === 0
                            }
                            className="rounded-lg border border-[#292929] bg-[#111111] px-4 py-2 text-sm text-gray-300 transition hover:bg-[#222222] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            Next
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
};

export default DataModule;
