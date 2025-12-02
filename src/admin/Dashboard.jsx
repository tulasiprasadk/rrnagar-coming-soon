// Save as src/admin/Dashboard.jsx

import React from "react";

export default function Dashboard() {
  return (
    <section className="admin-panel">
      <h1>Dashboard</h1>
      <p>Welcome to the admin dashboard. Add widgets, charts and stats here.</p>

      <div className="admin-grid">
        <div className="card">Total Users: <strong>123</strong></div>
        <div className="card">Orders Today: <strong>8</strong></div>
        <div className="card">Active Suppliers: <strong>12</strong></div>
        <div className="card">Pending Partner Requests: <strong>2</strong></div>
      </div>
    </section>
  );
}