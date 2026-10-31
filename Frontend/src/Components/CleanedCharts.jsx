
import React from "react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ScatterChart,
    Scatter
} from "recharts";


const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b"
];


const CleanedChart = ({ chartRecommendations = [] }) => {

    // Reusable chart container
    const ChartCard = ({ title, children }) => (
        <div className="
            rounded-xl
            border border-gray-800
            bg-black/40
            backdrop-blur-lg
            p-5
        ">
            <h2 className="text-lg font-semibold text-white mb-5">
                {title}
            </h2>

            {children}
        </div>
    );


    // Render chart based on backend recommendation
    const renderChart = (chart) => {

        switch (chart.chart_type) {

            case "histogram":

                return (
                    <BarChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="bin" />
                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="count"
                            fill={COLORS[0]}
                        />
                    </BarChart>
                );


            case "bar":

                return (
                    <BarChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="category" />
                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="value"
                            fill={COLORS[1]}
                        />
                    </BarChart>
                );


            case "scatter":

                return (
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            type="number"
                            dataKey="x"
                            name={chart.x_axis}
                        />

                        <YAxis
                            type="number"
                            dataKey="y"
                            name={chart.y_axis}
                        />

                        <Tooltip />

                        <Scatter
                            data={chart.data}
                            fill={COLORS[2]}
                        />
                    </ScatterChart>
                );


            default:

                return (
                    <p className="text-gray-400">
                        Unsupported chart type: {chart.chart_type}
                    </p>
                );
        }
    };


    // Main UI
    return (

        <div className="p-6 space-y-6">

            <h1 className="text-3xl font-bold text-white">
                Automated Data Visualization
            </h1>

            <p className="text-gray-400">
                Charts automatically recommended based on your dataset.
            </p>


            <div className="
                grid grid-cols-1
                lg:grid-cols-2
                gap-6
            ">

                {chartRecommendations.map((chart) => (

                    <ChartCard
                        key={chart.chart_id}
                        title={chart.title}
                    >

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >

                            {renderChart(chart)}

                        </ResponsiveContainer>

                    </ChartCard>

                ))}

            </div>

        </div>
    );
};


export default CleanedChart;
