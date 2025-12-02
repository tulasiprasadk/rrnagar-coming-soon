import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, isAuthenticated } from "./auth";
import "./admin.css";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();

  // Redirect if already authenticated (useEffect avoids doing it during render)
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // Attempt login via auth helper (calls API client or mock)
      await login(form);

      // After successful login navigate to saved destination or admin root
      const dest = (loc.state && loc.state.from && loc.state.from.pathname) || "/admin";
      navigate(dest, { replace: true });
    } catch (error) {
      // Show friendly error message
      setErr(error?.message || "Login failed. Check credentials or console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={submit}>
        <h2>Admin Sign In</h2>
        {err && <div className="admin-error" role="alert">{err}</div>}
        <label>
          Username
          <input
            value={form.username}
            onChange={update("username")}
            autoComplete="username"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={update("password")}
            autoComplete="current-password"
            required
          />
        </label>

        <div className="admin-login-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <p className="admin-note">Demo credentials: admin / password</p>
      </form>
    </div>
  );
}