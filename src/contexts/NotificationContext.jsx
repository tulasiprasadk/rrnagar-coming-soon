import React, { createContext, useContext, useState, useCallback } from "react";

/**
 * NotificationContext provides:
 * - notices: array of { id, type, message, createdAt }
 * - push(notice) to add a notice
 * - remove(id) to remove a notice
 *
 * Exports:
 * - named: NotificationContext, NotificationProvider, useNotifications
 * - default: NotificationContext
 */

export const NotificationContext = createContext({
  notices: [],
  push: () => {},
  remove: () => {},
});

export function NotificationProvider({ children }) {
  const [notices, setNotices] = useState([]);

  const push = useCallback((notice) => {
    const id = notice?.id ?? `n-${Date.now().toString(36)}-${Math.floor(Math.random() * 10000)}`;
    const n = {
      id,
      type: notice?.type ?? "info",
      message: notice?.message ?? String(notice),
      createdAt: new Date().toISOString(),
      ...notice,
    };
    setNotices((prev) => [n, ...prev]);
    return id;
  }, []);

  const remove = useCallback((id) => {
    setNotices((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const value = {
    notices,
    push,
    remove,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

/**
 * Hook: useNotifications
 * - returns the context value (notices, push, remove)
 * Usage: const { notices, push, remove } = useNotifications();
 */
export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    // Defensive: if used outside provider, return no-op safe interface
    return {
      notices: [],
      push: () => undefined,
      remove: () => undefined,
    };
  }
  return ctx;
}

export default NotificationContext;
