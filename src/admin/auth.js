import { post } from "../api/client";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const IS_LOCAL_PROXY = API_BASE === "/api" || API_BASE === "";

/**
 * Local token storage key used by demo AuthContext and quick token set.
 */
const TOKEN_KEY = "rrnagar_admin_token";

/**
 * Core admin login implementation. Kept named adminLogin for clarity,
 * but we also export `login` as a small compatibility alias.
 */
export async function adminLogin({ username, password } = {}) {
  if (IS_LOCAL_PROXY) {
    if (username === "admin" && password === "password") {
      const token = "admin-token-1";
      localStorage.setItem(TOKEN_KEY, token);
      return { token, ok: true };
    }
    const err = new Error("Invalid credentials — use admin / password for local dev");
    err.status = 401;
    throw err;
  }

  // Production: forward to real backend
  const res = await post("/admin/login", { username, password });
  return res;
}

// Compatibility export for components that import { login } from src/admin/auth.js
export const login = adminLogin;

/**
 * isAuthenticated()
 * - simple synchronous check for presence of demo token in localStorage.
 */
export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}

/**
 * setAuthToken(token)
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * logout() — compatibility name used by some components
 */
export async function logout() {
  setAuthToken(null);
  return true;
}

// also provide adminLogout for other callers if present
export { logout as adminLogout };
