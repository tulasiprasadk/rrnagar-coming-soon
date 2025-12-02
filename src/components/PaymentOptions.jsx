import React, { useEffect, useState } from "react";
import { createOrder, createPiInvoice } from "../api/payments";
import { getSettings as fetchSettings } from "../api/adminSettings";
import { useNavigate } from "react-router-dom";

/**
 * PaymentOptions (UPI + PI)
 *
 * Props:
 *  - items: array
 *  - total: number
 */
export default function PaymentOptions({ items = [], total = 0 }) {
  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  const totalRounded = Math.round((total + Number.EPSILON) * 100) / 100;

  function buildUpiUri() {
    const vpa = (settings && settings.upiVpa) || "";
    const name = (settings && settings.upiName) || "";
    const phone = (settings && settings.upiPhone) || "";
    const pa = vpa || "";
    const am = totalRounded.toFixed(2);
    const tn = encodeURIComponent("Order payment");
    const pn = encodeURIComponent(name);
    const upiUri = `upi://pay?pa=${encodeURIComponent(pa)}&pn=${pn}&am=${encodeURIComponent(am)}&cu=INR&tn=${tn}`;
    return { upiUri, pa, pn, phone };
  }

  async function handleUpiStart() {
    setLoading(true);
    setError("");
    try {
      const { upiUri, pa } = buildUpiUri();
      // Create a pending order (admin will verify UTR/screenshots)
      const orderPayload = {
        items,
        total: totalRounded,
        paymentMethod: "upi",
        paid: false,
        status: "pending",
        upiUri,
        createdAt: new Date().toISOString(),
      };
      const order = await createOrder(orderPayload);
      // Navigate to the UPI confirmation page for the created order
      navigate(`/confirm/upi/${order.id}`);
    } catch (err) {
      setError(err?.message || "UPI start failed");
    } finally {
      setLoading(false);
    }
  }

  async function handlePiStart() {
    setLoading(true);
    setError("");
    try {
      const rate = (settings && Number(settings.piRateINRPerPi)) || 0;
      const piAmount = rate > 0 ? +(totalRounded / rate).toFixed(6) : 0;
      const piAddress = (settings && settings.piReceiverAddress) || `pi:${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
      const invoice = await createPiInvoice({
        items,
        total: totalRounded,
        piAmount,
        piAddress,
        paymentMethod: "pi",
      });
      navigate(`/confirm/pi/${invoice.id}`);
    } catch (err) {
      setError(err?.message || "PI invoice failed");
    } finally {
      setLoading(false);
    }
  }

  const { upiUri, pa, pn, phone } = buildUpiUri();
  const qrData = settings && settings.upiQrUrl ? settings.upiQrUrl : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
      <h3>Payment</h3>

      <div style={{ marginBottom: 8 }}>
        <label>
          <input type="radio" name="method" value="upi" checked={method === "upi"} onChange={() => setMethod("upi")} />
          UPI
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          <input type="radio" name="method" value="pi" checked={method === "pi"} onChange={() => setMethod("pi")} />
          PI Network (manual)
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Total: </strong> ₹{totalRounded}
      </div>

      {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}

      {method === "upi" && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8 }}>
            {settings ? (
              <>
                <div><strong>UPI VPA:</strong> {pa || "Not configured"}</div>
                <div><strong>Recipient name:</strong> {pn || "Not configured"}</div>
                <div><strong>Phone (admin):</strong> {phone || "Not configured"}</div>
              </>
            ) : (
              <div>Loading UPI settings…</div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <img src={qrData} alt="UPI QR" style={{ width: 200, height: 200 }} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <button disabled={loading} onClick={handleUpiStart} style={{ padding: "8px 12px" }}>
              {loading ? "Processing..." : "Proceed to UPI confirmation"}
            </button>
            <button
              onClick={() => {
                try {
                  navigator.clipboard.writeText(upiUri);
                  alert("UPI URI copied");
                } catch {
                  alert("Unable to copy UPI URI");
                }
              }}
              style={{ marginLeft: 8, padding: "8px 12px" }}
            >
              Copy UPI URI
            </button>
          </div>
        </div>
      )}

      {method === "pi" && (
        <>
          <div>
            <div style={{ marginBottom: 8 }}>
              <strong>PI conversion rate (INR per PI):</strong> {settings ? settings.piRateINRPerPi : "loading"}
            </div>
            <div style={{ marginBottom: 8 }}>
              <button disabled={loading} onClick={handlePiStart} style={{ padding: "8px 12px" }}>
                {loading ? "Processing..." : "Create PI invoice"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
