import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * AuthContext - lightweight passwordless phone + OTP auth (mock)
 * For production replace sendOtp/verifyOtp with server + SMS provider.
 */
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("auth_token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem("auth_user", JSON.stringify(user)); else localStorage.removeItem("auth_user");
    if (token) localStorage.setItem("auth_token", token); else localStorage.removeItem("auth_token");
  }, [user, token]);

  // Mock send OTP
  function sendOtp(phone) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const otpStore = { phone, code, createdAt: Date.now() };
    localStorage.setItem("mock_last_otp", JSON.stringify(otpStore));
    return Promise.resolve({ ok: true, code });
  }

  // Mock verify OTP
  async function verifyOtp(phone, code, remember = false) {
    setLoading(true);
    try {
      const raw = localStorage.getItem("mock_last_otp");
      const otp = raw ? JSON.parse(raw) : null;
      if (!otp || otp.phone !== phone || otp.code !== String(code)) {
        throw new Error("Invalid OTP");
      }
      const fakeToken = "tok_" + Math.random().toString(36).slice(2, 12);
      const userObj = { id: "user-" + phone.replace(/\D/g, ""), phone, createdAt: new Date().toISOString() };
      setToken(fakeToken);
      setUser(userObj);
      localStorage.removeItem("mock_last_otp");
      return { ok: true, user: userObj, token: fakeToken };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, sendOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
