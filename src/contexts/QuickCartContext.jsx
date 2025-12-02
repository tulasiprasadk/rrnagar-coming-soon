import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * QuickCartContext
 * - Stores selected items in memory + localStorage
 * - item shape: { id, name, price, quantity, meta? }
 */
const KEY = "quickCart:v1";
const QuickCartContext = createContext(null);

export function QuickCartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity = Math.max(1, copy[idx].quantity + qty);
        return copy;
      }
      return [...prev, { id: product.id, name: product.name || product.title || product.label || "Item", price: Number(product.price || 0), quantity: Math.max(1, qty), meta: product.meta || {} }];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const updateQuantity = (id, quantity) =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p)));
  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.quantity, 0), [items]);
  const itemCount = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);

  // Example checkout function (POST to /orders). Adapt body as needed.
  const checkout = async (extra = {}) => {
    const payload = {
      items,
      subtotal,
      total: subtotal,
      createdAt: new Date().toISOString(),
      ...extra,
    };
    // If you have json-server /orders resource:
    // const res = await fetch("/orders", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) });
    // return res.json();
    // For now just return payload (no server).
    return payload;
  };

  return (
    <QuickCartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, subtotal, itemCount, checkout }}>
      {children}
    </QuickCartContext.Provider>
  );
}

export function useQuickCart() {
  const ctx = useContext(QuickCartContext);
  if (!ctx) throw new Error("useQuickCart must be used inside QuickCartProvider");
  return ctx;
}