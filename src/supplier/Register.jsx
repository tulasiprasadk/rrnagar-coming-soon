import React, { useState } from "react";
import { post } from "../api/client";

/**
 * Supplier registration — triggers OTP verification on register.
 * Backend should send OTP to mobile/email and return a temporary token or redirect flow.
 */
export default function SupplierRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setBusy(true);
    try {
      // POST to register; backend should send OTP and return a response
      const res = await post("/supplier/register", { name, email, phone, password }, "public");
      // Expect backend to send message: "otp_sent" or similar
      alert("Registration successful. An OTP has been sent to your phone/email. Please verify to complete registration.");
      // Optionally redirect to a /supplier/verify-otp page (not implemented here)
      window.location.href = "/supplier/verify"; // implement verify page if you want
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 560 }}>
      <h1>Supplier registration</h1>
      <form onSubmit={handleRegister}>
        <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} required />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} required />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} required />
        <div>
          <button type="submit" disabled={busy} style={{ padding: "8px 14px", background: "#ffd600", border: "none" }}>
            {busy ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </main>
  );
}