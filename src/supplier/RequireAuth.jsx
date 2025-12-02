import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * DEBUG RequireAuth: logs token/kyc and path to console to trace redirect behavior.
 * Overwrites src/supplier/RequireAuth.jsx (backup created if present).
 */
export default function RequireAuth({ children }) {
  const location = useLocation();
  const token = typeof window !== "undefined" ? localStorage.getItem("rrnagar_supplier_token") : null;
  const kycDone = typeof window !== "undefined" ? localStorage.getItem("rrnagar_supplier_kyc_done") === "1" : false;

  // debug log
  try {
    // eslint-disable-next-line no-console
    console.info("[RequireAuth DEBUG] path=", location.pathname, " token=", token ? "present" : "null", " kycDone=", kycDone, " rawFlag=", typeof window !== 'undefined' ? localStorage.getItem('rrnagar_supplier_kyc_done') : null);
  } catch (e) {}

  const onKycPage = location.pathname === "/supplier/kyc" || location.pathname.startsWith("/supplier/kyc");
  const onLoginPage = location.pathname === "/supplier-login" || location.pathname.startsWith("/supplier-login");

  // If not authenticated, send to login
  if (!token) {
    return <Navigate to="/supplier-login" state={{ from: location }} replace />;
  }

  // If authenticated but KYC incomplete and not already on login/kyc, redirect to KYC
  if (!kycDone && !onKycPage && !onLoginPage) {
    // debug mark before redirect
    try {
      // eslint-disable-next-line no-console
      console.warn("[RequireAuth DEBUG] Redirecting to /supplier/kyc");
    } catch (e) {}
    return <Navigate to="/supplier/kyc" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
