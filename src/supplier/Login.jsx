import React, { useState } from "react";
import { post } from "../api/client";
import { setSupplierToken } from "./auth";

/**
 * Supplier login — NO OTP here. Simple email+password (or token) login.
 * Only registration triggers OTP flow.
 */
export default function SupplierLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      // Backend should authenticate and return a supplier token and profile
      const res = await post("/supplier/login", { email, password }, "public");
      // expected response: { token: "...", supplier: { id, kycCompleted: true/false, ... } }
      const token = res?.token || (res.data && res.data.token);
      if (!token) throw new Error("Login failed: missing token");
      setSupplierToken(token); // persists into localStorage via your auth helper
      if (onLogin) onLogin();
      // redirect handled by parent/router after login
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 560 }}>
      <h1>Supplier login</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} required />
        <div>
          <button type="submit" disabled={busy} style={{ padding: "8px 14px", background: "#ffd600", border: "none" }}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
      <p style={{ marginTop: 12 }}>
        Don't have an account? <a href="/supplier/register">Register</a>
      </p>
      <small>OTP will only be required at registration for verification.</small>
    </main>
  );
}