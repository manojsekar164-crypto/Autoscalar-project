import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

function LoadChart({ metrics, predictedLoad }) {
    // Format data for chart
    const chartData = metrics.map((metric, index) => ({
        time: new Date(metric.timestamp).toLocaleTimeString(),
        load: metric.cpuLoad,
        index: index
    }));

    // Add predicted point
    if (predictedLoad && chartData.length > 0) {
        chartData.push({
            time: 'Predicted',
            predicted: predictedLoad,
            index: chartData.length
        });
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis
                    stroke="#64748b"
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    label={{ value: 'CPU Load (%)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <Legend />

                {/* Threshold lines */}
                <ReferenceLine
                    y={70}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    label={{ value: 'Scale Up (70%)', fill: '#ef4444', fontSize: 12 }}
                />
                <ReferenceLine
                    y={30}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    label={{ value: 'Scale Down (30%)', fill: '#22c55e', fontSize: 12 }}
                />

                {/* Actual load line */}
                <Line
                    type="monotone"
                    dataKey="load"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', r: 4 }}
                    name="Actual Load"
                    connectNulls
                />

                {/* Predicted load point */}
                <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 6 }}
                    name="Predicted Load"
                    connectNulls
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default LoadChart;
