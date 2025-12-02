// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = new URLSearchParams(useLocation().search);
  const searchTerm = query.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const resp = await fetch(`/api/products${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ""}`);
        if (!resp.ok) throw new Error("Network response was not ok");
        const data = await resp.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm]);

  if (loading) return <div className="products-loading">Loading products...</div>;
  if (error) return <div className="products-error">Error: {error}</div>;

  return (
    <main className="products-page">
      <h2>Products {searchTerm && `- "${searchTerm}"`}</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="product-img" />}
              <h3 className="product-name">{p.name}</h3>
              <p className="product-desc">{p.description}</p>
              <p className="product-price">₹{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}