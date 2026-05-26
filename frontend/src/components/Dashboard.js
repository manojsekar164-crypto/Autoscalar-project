import React from 'react';
import MetricCard from './MetricCard';
import LoadChart from './LoadChart';
import ConsoleLog from './ConsoleLog';
import './Dashboard.css';

function Dashboard({ scalingData, metrics, logs, error, isRunning, onToggleSimulation }) {
    // Get decision color
    const getDecisionColor = (decision) => {
        if (decision?.includes('Up')) return '#ef4444';
        if (decision?.includes('Down')) return '#22c55e';
        return '#64748b';
    };

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>
                        <span className="icon">⚡</span>
                        <span>AI Auto-Scaler</span>
                    </h1>
                    <p>Predictive Cloud Resource Management System</p>
                </div>

                <div className="header-controls">
                    <div className={`status-badge ${isRunning ? 'running' : 'stopped'}`}>
                        <span>{isRunning ? '●' : '○'}</span>
                        <span>{isRunning ? 'Active' : 'Inactive'}</span>
                    </div>

                    <button
                        className={`control-btn ${isRunning ? 'stop' : 'start'}`}
                        onClick={onToggleSimulation}
                    >
                        <span>{isRunning ? '⏸' : '▶'}</span>
                        <span>{isRunning ? 'Stop' : 'Start'}</span>
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                {/* Error Message */}
                {error && (
                    <div className="error-banner">
                        <span>⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Metric Cards */}
                <div className="metrics-grid">
                    <MetricCard
                        title="Current CPU Load"
                        value={scalingData?.current_load?.toFixed(2) || '0'}
                        unit="%"
                        color="#6366f1"
                        icon="📊"
                    />
                    <MetricCard
                        title="Predicted Load"
                        value={scalingData?.predicted_load?.toFixed(2) || '0'}
                        unit="%"
                        color="#8b5cf6"
                        icon="🔮"
                    />
                    <MetricCard
                        title="Scaling Decision"
                        value={scalingData?.decision || 'No Data'}
                        unit=""
                        color={getDecisionColor(scalingData?.decision)}
                        icon="⚡"
                        large
                    />
                </div>

                {/* Chart */}
                <div className="chart-container">
                    <h2>
                        <span>📈</span>
                        <span>Performance Metrics & Prediction</span>
                    </h2>
                    <LoadChart
                        metrics={metrics}
                        predictedLoad={scalingData?.predicted_load}
                    />
                </div>

                {/* Console Log */}
                <ConsoleLog logs={logs} />
            </div>

            {/* Footer */}
            <footer className="dashboard-footer">
                <p>
                    Last Updated: {scalingData?.timestamp ? new Date(scalingData.timestamp).toLocaleTimeString() : 'N/A'}
                    {' • '}
                    Auto-refresh: 5s interval
                </p>
            </footer>
        </div>
    );
}

export default Dashboard;
