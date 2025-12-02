import { get, post, put, del } from "../api/client";

/**
 * Normalize responses that might be either:
 * - axios-style { data: ... } (older code), or
 * - direct response data (client helpers returning res.data)
 */
function normalize(res) {
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object" && "data" in res) return res.data;
  return res || null;
}

export async function fetchStats() {
  const res = await get("/admin/stats", "admin").catch(() => null);
  return normalize(res) || { users: 0, products: 0, orders: 0 };
}

export async function fetchUsers() {
  const res = await get("/admin/users", "admin").catch(() => []);
  return normalize(res) || [];
}

// IMPORTANT: use /products for local json-server (it serves /products).
// If you have a real backend that exposes /admin/products, set VITE_API_BASE accordingly.
export async function fetchProducts() {
  const res = await get("/products", "admin");
  return normalize(res) || [];
}

export async function createProduct(payload) {
  const res = await post("/products", payload, "admin");
  return normalize(res) || res;
}

export async function updateProduct(productId, payload) {
  const res = await put(`/products/${productId}`, payload, "admin");
  return normalize(res) || res;
}

export async function deleteProduct(productId) {
  const res = await del(`/products/${productId}`, "admin");
  return normalize(res) || res;
}

export async function fetchOrders() {
  const res = await get("/admin/orders", "admin").catch(() => []);
  return normalize(res) || [];
}

export async function fetchPartnerRequests() {
  const res = await get("/partner-requests", "admin").catch(() => []);
  return normalize(res) || [];
}

export async function markPartnerRequestReviewed(id) {
  const res = await post("/partner-requests/review", { id }, "admin").catch(() => null);
  return normalize(res) || res;
}
