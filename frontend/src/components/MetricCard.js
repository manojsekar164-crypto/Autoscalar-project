import React from 'react';
import './MetricCard.css';

function MetricCard({ title, value, unit, color, icon, large }) {
    return (
        <div className={`metric-card ${large ? 'large' : ''}`} style={{ borderLeftColor: color }}>
            <div className="metric-icon">{icon}</div>
            <div className="metric-content">
                <h3>{title}</h3>
                <div className="metric-value">
                    <span className="value" style={{ color }}>{value}</span>
                    {unit && <span className="unit">{unit}</span>}
                </div>
            </div>
        </div>
    );
}

export default MetricCard;
