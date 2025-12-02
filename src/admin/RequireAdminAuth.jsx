import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAdminAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("rrnagar_admin_token");
  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
