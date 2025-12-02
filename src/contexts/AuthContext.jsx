import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Very small client-side auth: stores token in localStorage.
// Replace login() with real backend call when ready.
const KEY = 'rrnagar_admin_token';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(KEY));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) localStorage.setItem(KEY, token);
    else localStorage.removeItem(KEY);
  }, [token]);

  function logout() {
    setToken(null);
    navigate('/admin/login', { replace: true });
  }

  // Dummy login: accept username "admin" and password "password"
  async function login({ username, password }) {
    // Replace this block with real API call:
    if (username === 'admin' && password === 'password') {
      const fakeToken = 'admin-token-1';
      setToken(fakeToken);
      return { ok: true };
    }
    throw new Error('Invalid credentials — use admin / password for local dev');
  }

  const value = { token, login, logout, isAuthenticated: !!token };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
