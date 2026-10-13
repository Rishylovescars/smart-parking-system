import React from 'react';

function StatCard({ title, value, icon, color = '#22c55e' }) {
  return (
    <div
      className="stat-card"
      style={{
        borderLeft: `4px solid ${color}`,
        background: `linear-gradient(145deg, #111d35 0%, rgba(17, 29, 53, 0.7) 100%)`,
      }}
    >
      <div
        className="stat-icon"
        style={{ color: color, backgroundColor: `${color}15` }}
      >
        {icon}
      </div>
      <div className="stat-info">
        <span className="stat-value">{value ?? 0}</span>
        <span className="stat-label">{title}</span>
      </div>
    </div>
  );
}

export default StatCard;
