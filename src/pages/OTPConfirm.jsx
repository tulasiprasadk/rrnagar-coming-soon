import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

/**
 * OTP confirmation page.
 * - Expects ?phone=<phone> in query string
 */
export default function OTPConfirm() {
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);
  const [msg, setMsg] = useState("");
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!phone) navigate("/login");
  }, [phone, navigate]);

  async function handleVerify(e) {
    e.preventDefault();
    setMsg("");
    try {
      await verifyOtp(phone, code, remember);
      setMsg("Verified!");
      setTimeout(() => navigate("/"), 600);
    } catch (err) {
      setMsg(err?.message || "Verification failed");
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Enter OTP</h2>
      <p>We sent a one-time code to <strong>{phone}</strong>.</p>
      <form onSubmit={handleVerify} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <label>
          OTP
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember me on this device
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" style={{ padding: "8px 12px" }}>Verify & Sign in</button>
          <button type="button" onClick={() => navigate(-1)} style={{ padding: "8px 12px" }}>Cancel</button>
        </div>
        {msg && <div style={{ color: "#333" }}>{msg}</div>}
      </form>
    </main>
  );
}
