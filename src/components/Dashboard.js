import React from 'react';
import '../components/Dashboard.css';

const Dashboard = ({ username, handleLogout }) => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome, {username}!</h2>
      <button className="dashboard-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
