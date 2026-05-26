import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import './App.css';

const API_URL = 'http://localhost:4000/api';

function App() {
    const [scalingData, setScalingData] = useState(null);
    const [metrics, setMetrics] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRunning, setIsRunning] = useState(true);

    // Fetch scaling decision
    const fetchScalingData = async () => {
        if (!isRunning) return;

        try {
            const response = await axios.get(`${API_URL}/scale`);
            if (response.data.success) {
                setScalingData(response.data);

                // Add to logs
                const logEntry = {
                    time: new Date().toLocaleTimeString(),
                    currentLoad: response.data.current_load,
                    predictedLoad: response.data.predicted_load,
                    decision: response.data.decision
                };
                setLogs(prev => [...prev.slice(-19), logEntry]); // Keep last 20 logs

                setError(null);
            }
        } catch (err) {
            setError('Failed to fetch scaling data');
            console.error('Error:', err);
        }
    };

    // Fetch metrics history
    const fetchMetrics = async () => {
        try {
            const response = await axios.get(`${API_URL}/metrics?limit=20`);
            if (response.data.success) {
                setMetrics(response.data.data);
                setLoading(false);
            }
        } catch (err) {
            setError('Failed to fetch metrics');
            console.error('Error:', err);
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchScalingData();
        fetchMetrics();
    }, []);

    // Start/Stop simulation
    const toggleSimulation = async () => {
        try {
            const endpoint = isRunning ? '/stop' : '/start';
            await axios.post(`${API_URL}${endpoint}`);
            setIsRunning(!isRunning);
        } catch (err) {
            console.error('Error toggling simulation:', err);
        }
    };

    // Auto-refresh every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchScalingData();
            fetchMetrics();
        }, 5000);

        return () => clearInterval(interval);
    }, [isRunning]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="App">
            <Dashboard
                scalingData={scalingData}
                metrics={metrics}
                logs={logs}
                error={error}
                isRunning={isRunning}
                onToggleSimulation={toggleSimulation}
            />
        </div>
    );
}

export default App;
