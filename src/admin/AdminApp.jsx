import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import Products from "./Products";
import Orders from "./Orders";
import AdminBulkUpload from "./AdminBulkUpload";
import RequireAdminAuth from "./RequireAdminAuth";
import AdminLayout from "./AdminLayout";

/**
 * Admin router updated to use AdminLayout for authenticated routes.
 * Save as: src/admin/AdminApp.jsx (overwrite existing)
 *
 * This ensures the left nav (including Bulk upload link) appears when admin is logged in.
 */
export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      {/* Protected admin routes, wrapped by layout */}
      <Route
        element={
          <RequireAdminAuth>
            <AdminLayout />
          </RequireAdminAuth>
        }
      >
        <Route path="/" element={<Products />} />
        <Route path="products" element={<Products />} />
        <Route path="bulk" element={<AdminBulkUpload />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}