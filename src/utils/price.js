// Small price helpers to normalize/compute platform margin.
// Save as: src/utils/price.js

/**
 * Parse a price input string into a numeric value (in rupees).
 * Examples:
 *  "₹400" -> 400
 *  "400.00" -> 400
 *  "400" -> 400
 */
export function parsePrice(input) {
  if (input == null) return NaN;
  if (typeof input === "number") return input;
  const s = String(input).replace(/[^\d.-]/g, "").trim();
  if (!s) return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Compute the platform price given supplier price and margin percent.
 * Returns number rounded to 2 decimals.
 */
export function applyMargin(supplierPrice, marginPercent = 15) {
  const n = Number(supplierPrice) || 0;
  const result = n * (1 + marginPercent / 100);
  return Math.round(result * 100) / 100;
}

export function formatPrice(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  // simple INR formatting
  return `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}