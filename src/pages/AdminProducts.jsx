import React, { useEffect, useState } from "react";
import { get, post, put, del } from "../api/client";
import AdminProductForm from "../components/AdminProductForm";
import ProductCard from "../components/ProductCard";

export default function AdminProducts() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // product being edited
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await get("/products");
      const items = Array.isArray(data) ? data : data?.value ?? [];
      setProducts(items);
    } catch (err) {
      setError(err.message || "Load failed");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload) {
    await post("/products", payload);
    setShowCreate(false);
    await load();
  }

  async function handleUpdate(payload) {
    await put(`/products/${editing.id}`, payload);
    setEditing(null);
    await load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await del(`/products/${id}`);
    await load();
  }

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Products</h2>
        <div>
          <button onClick={() => setShowCreate((s) => !s)}>New product</button>
        </div>
      </header>

      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {showCreate && (
        <section style={{ marginTop: 12, marginBottom: 12 }}>
          <h4>Create product</h4>
          <AdminProductForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
        </section>
      )}

      {editing && (
        <section style={{ marginTop: 12, marginBottom: 12 }}>
          <h4>Edit product</h4>
          <AdminProductForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
        </section>
      )}

      <section style={{ marginTop: 12 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
            gap: 12,
          }}
        >
          {products.map((p) => (
            <div key={p.id} style={{ position: "relative" }}>
              <ProductCard product={p} />
              <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6 }}>
                <button onClick={() => setEditing(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)} style={{ color: "crimson" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
