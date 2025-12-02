import React from "react";
import { Link, Outlet } from "react-router-dom";

/**
 * Simple Admin Layout with left navigation.
 * Save as: src/admin/AdminLayout.jsx
 *
 * This will render a left nav with links for admin pages and an Outlet for nested routes.
 * Adjust styles or links to match your existing admin UI.
 */
export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav style={{ width: 220, background: "#0b0b0b", color: "#ddd", padding: 16 }}>
        <h3 style={{ color: "#ffd600", marginTop: 0 }}>Admin</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ margin: "8px 0" }}>
            <Link to="/admin/products" style={{ color: "#ddd", textDecoration: "none" }}>Products</Link>
          </li>
          <li style={{ margin: "8px 0" }}>
            <Link to="/admin/bulk" style={{ color: "#ddd", textDecoration: "none" }}>Bulk upload</Link>
          </li>
          <li style={{ margin: "8px 0" }}>
            <Link to="/admin/orders" style={{ color: "#ddd", textDecoration: "none" }}>Orders</Link>
          </li>
        </ul>
      </nav>

      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}