import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { requestOtp } from "../supplier/auth";

/**
 * Supplier login now requests OTP for verification.
 * Save/overwrite as: src/pages/SupplierLogin.jsx
 *
 * Behavior:
 * - User enters email (or phone) and password (password is kept for backend/auth but not used in mock).
 * - The page will request an OTP and navigate to /supplier/verify where user enters the code.
 */
export default function SupplierLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    if (!form.email) {
      setErr("Please provide an email (or phone).");
      setLoading(false);
      return;
    }

    try {
      // Request OTP from auth helper
      const res = await requestOtp({ email: form.email, phone: form.email });
      // If res contains code (mock), we still navigate to verify. In dev you can see the code in console or in localStorage
      navigate("/supplier/verify", { state: { email: form.email } });
    } catch (error) {
      console.error("OTP request error:", error);
      setErr(error?.message || "Failed to request OTP. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Supplier Sign In</h1>

      {err && <div style={{ color: "#ffb4b4", marginBottom: 12 }}>{err}</div>}

      <form onSubmit={submit} style={{ maxWidth: 420 }}>
        <label>
          Email or Phone
          <br />
          <input type="text" value={form.email} onChange={update("email")} style={{ width: "100%", padding: 8, marginBottom: 12 }} required />
        </label>

        <label>
          Password
          <br />
          <input type="password" value={form.password} onChange={update("password")} style={{ width: "100%", padding: 8, marginBottom: 12 }} />
        </label>

        <div style={{ marginTop: 12 }}>
          <button type="submit" style={{ padding: "8px 14px", background: "#ffd600", border: "none", cursor: "pointer" }} disabled={loading}>
            {loading ? "Requesting OTP..." : "Request OTP"}
          </button>
        </div>
      </form>

      <p style={{ marginTop: 12, color: "#999" }}>Demo: an OTP is shown in the browser console (mock). Enter it on the verification screen.</p>
    </main>
  );
}