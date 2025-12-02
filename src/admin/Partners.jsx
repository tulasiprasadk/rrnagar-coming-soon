import React, { useEffect, useState } from "react";
import { fetchPartnerRequests, markPartnerRequestReviewed } from "./api";

export default function Partners() {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchPartnerRequests()
      .then((d) => mounted && setItems(d))
      .catch((e) => mounted && setErr(e.message || "Failed to load partner requests"));
    return () => (mounted = false);
  }, []);

  async function handleReview(id) {
    try {
      await markPartnerRequestReviewed(id);
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, reviewed: true } : it)));
    } catch (e) {
      alert(e.message || "Failed");
    }
  }

  return (
    <section>
      <h1>Partner Requests</h1>
      {err && <div style={{ color: "#ffb4b4" }}>{err}</div>}
      {!items ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p>No partner requests yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((it) => (
            <li key={it.id} style={{ marginBottom: 12, background: "#141414", padding: 12, borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <strong>{it.name}</strong> — <span style={{ color: "#ccc" }}>{it.email} / {it.phone}</span>
                  <p style={{ marginTop: 8 }}>{it.message}</p>
                  <div style={{ fontSize: 12, color: "#777" }}>Submitted: {it.created_at ? new Date(it.created_at).toLocaleString() : "—"}</div>
                </div>
                <div>
                  {it.reviewed ? (
                    <span style={{ color: "#88c28a", fontWeight: 700 }}>Reviewed</span>
                  ) : (
                    <button onClick={() => handleReview(it.id)} style={{ padding: "6px 10px", background: "#ffd600", border: "none", borderRadius: 6 }}>
                      Mark reviewed
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}