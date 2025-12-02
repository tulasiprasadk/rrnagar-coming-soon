import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Minimal admin auth guard.
 * Save as: src/admin/RequireAdminAuth.jsx
 *
 * Behavior:
 * - Checks for rrnagar_admin_token in localStorage.
 * - If present, renders children.
 * - If absent, redirects to /admin/login and preserves attempted URL in state.
 */
export default function RequireAdminAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("rrnagar_admin_token");

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}