// Minimal supplier auth helper. Save as: src/supplier/auth.js
// Exports used by the app:
// - setSupplierToken, getSupplierToken, logoutSupplier  (already used)
// - isAuthenticatedSupplier (used by RequireAuth)
// - requestOtp (used by SupplierLogin)
// This file provides small, safe mocks for local/dev use.

export function setSupplierToken(token) {
  try {
    localStorage.setItem("rrnagar_supplier_token", token);
    // keep a mirror for debugging
    localStorage.setItem("rrnagar_supplier_token_debug", `${token}|${Date.now()}`);
  } catch (err) {
    console.error("Failed to set supplier token:", err);
  }
}

export function getSupplierToken() {
  try {
    return localStorage.getItem("rrnagar_supplier_token");
  } catch (err) {
    console.error("Failed to get supplier token:", err);
    return null;
  }
}

export function logoutSupplier() {
  try {
    localStorage.removeItem("rrnagar_supplier_token");
    localStorage.removeItem("rrnagar_supplier_token_debug");
    localStorage.removeItem("rrnagar_supplier_pending");
  } catch (err) {
    console.error("Failed to remove supplier token:", err);
  }
}

// Returns whether a supplier is currently authenticated (based on token presence)
export function isAuthenticatedSupplier() {
  try {
    return !!localStorage.getItem("rrnagar_supplier_token");
  } catch (err) {
    console.error("isAuthenticatedSupplier error:", err);
    return false;
  }
}

/**
 * requestOtp mock for local/dev:
 * - Saves a pending object in localStorage under "rrnagar_supplier_pending"
 * - Logs the OTP to the console so developer can see it
 * - Returns { success: true, code } so SupplierLogin can proceed
 *
 * In production you should replace this with a call to your backend.
 */
export async function requestOtp({ email, phone } = {}) {
  try {
    const code = "123456"; // demo OTP
    const pending = { email: email || null, phone: phone || null, code, createdAt: Date.now() };
    localStorage.setItem("rrnagar_supplier_pending", JSON.stringify(pending));
    console.info(`[supplier/auth] mock OTP for ${email || phone}: ${code}`);
    // mimic async network call
    return Promise.resolve({ success: true, code });
  } catch (err) {
    console.error("requestOtp failed:", err);
    return Promise.reject(err);
  }
}