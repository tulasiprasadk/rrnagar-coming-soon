import React from 'react';
// ...existing imports
import React from "react";
import { useQuickCart } from "../context/QuickCartContext";

export default function ProductCard({ product }) {
  const { addItem } = useQuickCart();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
      <h3>{product.name}</h3>
      <div>₹{product.price}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => addItem(product, 1)}>Add</button>
        {/* optionally a message button per product */}
        {/* <MessageButton recipientId={product.sellerId} recipientName={product.sellerName} /> */}
      </div>
    </div>
  );
}

export default function ProductCard({ product = {} }) {
  const {
    name = 'Untitled product',
    description = '',
    price = null,
    imageUrl = '',
  } = product;

  const formattedPrice =
    typeof price === 'number'
      ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(price / 100 || price)
      : price || '';

  return (
    <article
      style={{
        border: '1px solid #e6e6e6',
        borderRadius: 8,
        padding: 12,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minHeight: 160,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
      aria-label={name}
    >
      <div
        style={{
          height: 110,
          borderRadius: 6,
          overflow: 'hidden',
          background: '#fafafa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {imageUrl ? (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            src={imageUrl}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div style={{ color: '#999', fontSize: 24 }}>📦</div>
        )}
      </div>

      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: '6px 0 4px', fontSize: 16 }}>{name}</h3>
          {description ? <p style={{ margin: 0, color: '#666', fontSize: 13 }}>{description}</p> : null}
        </div>

        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, color: '#111' }}>{formattedPrice}</div>
          <button
            style={{
              background: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '6px 10px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
            }}
            onClick={() => {
              // placeholder action — replace with real handler if needed
              alert(`Selected: ${name}`);
            }}
            type="button"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}
