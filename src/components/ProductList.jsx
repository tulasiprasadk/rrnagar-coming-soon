import React, { useEffect, useState, useCallback } from 'react';
import ProductCard from './ProductCard'; // adjust path if your ProductCard is elsewhere
import { get } from '../api/client'; // adjust path if your API client is elsewhere

export default function ProductList() {
  const [products, setProducts] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      // If your `get` doesn't accept an options object, change the next line to:
      // const data = await get('/products');
      const data = await get('/products', { signal });
      const items = Array.isArray(data) ? data : data?.value ?? [];
      setProducts(items);
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setError(err?.message ?? String(err));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  if (loading) {
    // simple skeleton placeholders to reduce layout shift
    const skeletons = Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        style={{
          borderRadius: 8,
          background: '#f2f2f2',
          height: 160,
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        aria-hidden
      >
        <div style={{ width: '60%', height: 20, background: '#e6e6e6', borderRadius: 4 }} />
        <div style={{ width: '80%', height: 14, background: '#e6e6e6', borderRadius: 4 }} />
        <div style={{ width: '40%', height: 18, background: '#e6e6e6', borderRadius: 4, alignSelf: 'flex-start' }} />
      </div>
    ));

    return (
      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
        {skeletons}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'crimson' }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Error loading products</div>
        <div style={{ marginBottom: 12 }}>{error}</div>
        <div>
          <button onClick={() => fetchProducts()} style={{ padding: '8px 12px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>No products yet</div>
        <div style={{ color: '#666', marginBottom: 12 }}>There are currently no products to display.</div>
        <div>
          <button onClick={() => fetchProducts()} style={{ padding: '8px 12px' }}>
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16,
        padding: 16,
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id ?? p._id ?? p.name} product={p} />
      ))}
    </div>
  );
}
