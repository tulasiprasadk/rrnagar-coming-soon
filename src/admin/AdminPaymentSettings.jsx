import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../api/adminSettings";

/**
 * Admin UI to edit UPI and PI payment settings:
 */
export default function AdminPaymentSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    getSettings()
      .then(s => setSettings(s))
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const saved = await updateSettings(settings);
      setSettings(saved);
      setMsg("Saved");
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      setMsg("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return <main style={{ padding: 20 }}>Loading settings…</main>;
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Payment Settings</h2>
      <form onSubmit={handleSave} style={{ display: "grid", gap: 8, maxWidth: 700 }}>
        <label>
          UPI VPA (pa)
          <input value={settings.upiVpa || ""} onChange={(e) => setSettings({ ...settings, upiVpa: e.target.value })} />
        </label>
        <label>
          Recipient name (UPI)
          <input value={settings.upiName || ""} onChange={(e) => setSettings({ ...settings, upiName: e.target.value })} />
        </label>
        <label>
          Phone (admin contact)
          <input value={settings.upiPhone || ""} onChange={(e) => setSettings({ ...settings, upiPhone: e.target.value })} />
        </label>
        <label>
          UPI QR image URL (optional, overrides generated QR)
          <input value={settings.upiQrUrl || ""} onChange={(e) => setSettings({ ...settings, upiQrUrl: e.target.value })} />
        </label>

        <hr />

        <label>
          PI conversion rate (INR per PI)
          <input type="number" step="0.0001" value={settings.piRateINRPerPi || 0} onChange={(e) => setSettings({ ...settings, piRateINRPerPi: e.target.value })} />
        </label>
        <label>
          PI receiver address (default address for invoices)
          <input value={settings.piReceiverAddress || ""} onChange={(e) => setSettings({ ...settings, piReceiverAddress: e.target.value })} />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={saving} style={{ padding: "8px 12px" }}>{saving ? "Saving..." : "Save"}</button>
          <div style={{ alignSelf: "center", color: "#333" }}>{msg}</div>
        </div>
      </form>
    </main>
  );
}
