const RELAY_BASE = "http://localhost:5001";

export async function sendWhatsAppMessage(payload) {
  const res = await fetch(`${RELAY_BASE}/api/send-whatsapp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to send (status ${res.status})`);
  }
  return res.json();
}