import { post, put, get } from "./client";

/**
 * createOrder(payload) - generic order creation
 */
export async function createOrder(payload) {
  const res = await post("/orders", payload);
  return res;
}

/**
 * updateOrder(id, patch)
 * - Performs PUT to /orders/:id (json-server)
 */
export async function updateOrder(id, patch) {
  // json-server requires full object for PUT; but many setups accept PATCH via PUT for partial updates.
  // To keep it simple we'll perform a GET then merge and PUT back the whole object.
  const existing = await get(`/orders/${id}`);
  const updated = { ...existing, ...patch };
  const res = await put(`/orders/${id}`, updated);
  return res;
}

/**
 * createPiInvoice(payload)
 * - make an order with paymentMethod 'pi', include piAmount and piAddress generated from admin settings (caller should pass piAddress/piAmount if available)
 */
export async function createPiInvoice(payload) {
  const invoicePayload = {
    ...payload,
    paymentMethod: "pi",
    paid: false,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const res = await post("/orders", invoicePayload);
  return res;
}

/**
 * markPiPaid(orderId, paymentDetails)
 */
export async function markPiPaid(orderId, paymentDetails = {}) {
  const update = {
    paid: true,
    status: "paid",
    paidAt: new Date().toISOString(),
    paymentDetails,
  };
  const res = await put(`/orders/${orderId}`, update);
  return res;
}

export async function fetchOrder(id) {
  return get(`/orders/${id}`);
}

/**
 * fetchOrdersForBuyer(buyerId)
 * - returns list of orders filtered by buyerId
 */
export async function fetchOrdersForBuyer(buyerId) {
  const res = await get(`/orders?buyerId=${encodeURIComponent(buyerId)}`);
  return res;
}