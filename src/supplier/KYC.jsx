import React from "react";
import { useNavigate } from "react-router-dom";

export default function SupplierKyc() {
  const navigate = useNavigate();

  function complete() {
    // In real app, you would call backend. For dev, we set the local flag:
    localStorage.setItem("rrnagar_supplier_kyc_done", "1");
    alert("KYC marked as done (local). Redirecting to supplier portal...");
    navigate("/supplier", { replace: true });
  }

  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1>Complete KYC (dev)</h1>
      <p>This is a development stub. Press the button to mark KYC as done locally.</p>
      <div style={{ marginTop: 12 }}>
        <button onClick={complete} style={{ padding: "8px 14px", background: "#ffd600", border: "none" }}>Complete KYC</button>
      </div>
    </main>
  );
}