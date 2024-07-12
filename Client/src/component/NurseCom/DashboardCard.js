// DashboardCard.js
import React from 'react';


const DashboardCard = ({ title, amount, icon: Icon }) => (
  <div className="dashboard-card">
    <div className="card-content">
      <div className="icon-container">
        <div className="icon-bg">
          <Icon size={32} />
        </div>
      </div>
      <div className="text-content">
        <h5 className="title">{title}</h5>
        <h3 className="amount">
          {amount}{" "}
          <span className="exchange-icon">
            <i className="fas fa-exchange-alt"></i>
          </span>
        </h3>
      </div>
    </div>
  </div>
);

export default DashboardCard;
