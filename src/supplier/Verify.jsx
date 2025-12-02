import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { post } from "../api/client";
import { setSupplierToken, getSupplierToken } from "./auth";

/**
 * Debug-friendly Supplier OTP verification.
 * - Tries server verify; logs response.
 * - Fallback dummy OTP: 123456
 * - Persists token via setSupplierToken and localStorage.
 * - Displays step-by-step status in UI and console.
 *
 * Save as: src/supplier/Verify.jsx (overwrite existing)
 */
export default function SupplierVerify() {
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/supplier";

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus("Starting verification...");
    console.info("[Verify] start, otp:", otp);

    let verified = false;
    let token = null;

    // Try server verification (if endpoint exists)
    try {
      setStatus("Calling server /supplier/verify if available...");
      console.info("[Verify] POST /supplier/verify ->", { otp });
      const res = await post("/supplier/verify", { otp }, "public");
      console.info("[Verify] server response:", res);
      // support several shapes
      token = res && (res.token || (res.data && res.data.token) || res.data?.token);
      if (token || res?.success || res?.data?.success) verified = true;
    } catch (err) {
      console.warn("[Verify] server verify failed or endpoint missing:", err?.message || err);
    }

    // Fallback dummy OTP
    if (!verified) {
      if (otp === "123456") {
        verified = true;
        token = "demo-supplier-token";
        console.info("[Verify] dummy OTP accepted, issuing demo token");
      } else {
        console.info("[Verify] dummy OTP rejected");
      }
    }

    if (!verified) {
      setStatus("Verification failed. Use dummy OTP: 123456 (or check server).");
      alert("Invalid OTP. For demo use: 123456");
      setBusy(false);
      return;
    }

    setStatus("Verification successful, saving token...");
    try {
      // Persist via helper (if present) and also directly to localStorage for safety
      if (typeof setSupplierToken === "function") {
        setSupplierToken(token);
        console.info("[Verify] setSupplierToken() called with token:", token);
      } else {
        console.warn("[Verify] setSupplierToken not available, writing localStorage directly");
        localStorage.setItem("rrnagar_supplier_token", token);
      }
      // also write a debug key
      localStorage.setItem("rrnagar_supplier_token_debug", `${token}|${Date.now()}`);
    } catch (err) {
      console.error("[Verify] failed to persist token:", err);
      setStatus("Saved token failed: " + (err.message || err));
      setBusy(false);
      return;
    }

    // confirm persisted
    const stored = getSupplierToken ? getSupplierToken() : localStorage.getItem("rrnagar_supplier_token");
    console.info("[Verify] stored token check:", stored);
    setStatus("Token saved. Redirecting to supplier portal...");
    setBusy(false);
    // short delay so user can see status
    setTimeout(() => {
      navigate(next, { replace: true });
    }, 400);
  }

  return (
    <main style={{ padding: 24, maxWidth: 640 }}>
      <h1>Verify your account (debug)</h1>
      <p>Enter OTP. For demo use: <strong>123456</strong></p>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
          required
        />
        <div>
          <button type="submit" disabled={busy} style={{ padding: "8px 14px", background: "#ffd600", border: "none" }}>
            {busy ? "Verifying..." : "Verify"}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 12 }}>
        <div><strong>Status:</strong> {status}</div>
        <div style={{ marginTop: 8 }}>
          <small>Stored token (debug): <code>{getSupplierToken() || "none"}</code></small>
        </div>
      </div>
    </main>
  );
}