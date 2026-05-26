import React, { useEffect, useRef } from 'react';
import './ConsoleLog.css';

function ConsoleLog({ logs }) {
    const consoleRef = useRef(null);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [logs]);

    const getDecisionIcon = (decision) => {
        if (decision?.includes('Up')) return '🚀';
        if (decision?.includes('Down')) return '🔻';
        return '✅';
    };

    const getDecisionClass = (decision) => {
        if (decision?.includes('Up')) return 'scale-up';
        if (decision?.includes('Down')) return 'scale-down';
        return 'no-action';
    };

    return (
        <div className="console-container">
            <div className="console-header">
                <h2>📟 System Console</h2>
                <span className="console-badge">{logs.length} events</span>
            </div>
            <div className="console-log" ref={consoleRef}>
                {logs.length === 0 ? (
                    <div className="console-empty">
                        <p>Waiting for system events...</p>
                    </div>
                ) : (
                    logs.map((log, index) => (
                        <div key={index} className={`log-entry ${getDecisionClass(log.decision)}`}>
                            <div className="log-time">[{log.time}]</div>
                            <div className="log-content">
                                <div className="log-line">
                                    <span className="log-label">Current Load:</span>
                                    <span className="log-value">{log.currentLoad.toFixed(2)}%</span>
                                </div>
                                <div className="log-line">
                                    <span className="log-label">Predicted Load:</span>
                                    <span className="log-value">{log.predictedLoad.toFixed(2)}%</span>
                                </div>
                                <div className="log-line decision">
                                    <span className="log-label">Decision:</span>
                                    <span className="log-value">
                                        {getDecisionIcon(log.decision)} {log.decision}
                                    </span>
                                </div>
                            </div>
                            <div className="log-separator">----------------------------------------</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ConsoleLog;
