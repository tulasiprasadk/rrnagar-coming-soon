import React from "react";
import { useNotifications } from "../context/NotificationContext";

/**
 * Simple notification toast stack (top-right)
 * - consumes NotificationContext.toasts
 */
export default function NotificationsToast() {
  const { toasts, removeToast } = useNotifications();

  return (
    <div style={containerStyle}>
      {toasts.map((t) => (
        <div key={t.id} style={{ ...toastStyle, borderLeft: `4px solid ${colorForType(t.type)}` }}>
          <div style={headerStyle}>
            <strong style={{ fontSize: 13 }}>{t.title || "Notification"}</strong>
            <button onClick={() => removeToast(t.id)} style={closeBtnStyle}>
              ✕
            </button>
          </div>
          <div style={{ fontSize: 13, color: "#333" }}>{t.message}</div>
        </div>
      ))}
    </div>
  );
}

function colorForType(type) {
  if (type === "error") return "#c53030";
  if (type === "success") return "#16a34a";
  if (type === "warning") return "#f59e0b";
  return "#0b5fff";
}

const containerStyle = {
  position: "fixed",
  top: 18,
  right: 18,
  zIndex: 99999,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  maxWidth: 360,
};

const toastStyle = {
  background: "#fff",
  padding: "10px 12px",
  borderRadius: 8,
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  border: "1px solid #eee",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 6,
};

const closeBtnStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 14,
  color: "#666",
};