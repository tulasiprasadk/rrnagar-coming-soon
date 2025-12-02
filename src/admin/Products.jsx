import React, { useEffect, useState } from "react";
import { fetchProducts, createProduct, deleteProduct } from "./api";

export default function Products() {
  const [products, setProducts] = useState(null);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ title: "", price: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then((p) => mounted && setProducts(p))
      .catch((e) => mounted && setErr(e.message || "Failed to load products"));
    return () => (mounted = false);
  }, []);

  async function addProduct(e) {
    e.preventDefault();
    setErr("");
    if (!form.title.trim()) return setErr("Enter title");
    setBusy(true);
    try {
      const res = await createProduct({ title: form.title, price: form.price || "₹0" });
      // Update list in UI - support multiple shapes from API/mock
      const newItem = res.item || res.data || res;
      setProducts((prev = []) => (Array.isArray(prev) ? [newItem, ...prev] : [newItem]));
      setForm({ title: "", price: "" });
    } catch (ex) {
      setErr(ex.message || "Failed to add");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      // In mock mode deleteProduct will remove if client handles, otherwise just filter locally:
      setProducts((prev = []) => (Array.isArray(prev) ? prev.filter((p) => p.id !== id) : []));
    } catch (ex) {
      alert(ex.message || "Delete failed");
    }
  }

  return (
    <section>
      <h1>Products</h1>
      {err && <div style={{ color: "#ffb4b4" }}>{err}</div>}

      <form onSubmit={addProduct} style={{ marginBottom: 12 }}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ padding: 8, marginRight: 8 }} />
        <input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={{ padding: 8, marginRight: 8 }} />
        <button type="submit" disabled={busy} style={{ padding: "8px 12px", background: "#ffd600", border: "none", borderRadius: 6 }}>
          {busy ? "Adding…" : "Add Product"}
        </button>
      </form>

      {!products ? (
        <p>Loading products…</p>
      ) : (
        <ul className="admin-list">
          {products.map((p) => (
            <li key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{p.title}</strong> — {p.price || p.price}
                <div style={{ fontSize: 12, color: "#999" }}>{p.created_at ? new Date(p.created_at).toLocaleString() : null}</div>
              </div>
              <div>
                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: 8, padding: "6px 10px", background: "#c8102e", color: "#fff", border: "none", borderRadius: 6 }}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}