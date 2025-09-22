import React from 'react';
import './DashboardPage.css';

const StatCard3D = ({ title, value, className = '' }) => {
  return (
    <div className="stat-card-scene">
      <div className={`stat-card-3d ${className}`}>
        <div className="card-face front">
          <h2>{title}</h2>
          <p>{value}</p>
        </div>
        <div className="card-face back">
          <h2>{title}</h2>
          <p>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard3D;