import { useState } from "react";
import { API } from "../api";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form,    setForm]    = useState({ username: "", email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const body     = isLogin
        ? { username: form.username, password: form.password }
        : form;
      const res  = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      // Pass role from backend — "ADMIN" or "USER"
      onLogin({
        token:    data.token,
        username: data.username,
        id:       data.userId,
        role:     data.role || "USER",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">C</div>
          <h1 className="auth-title">CodeStreak</h1>
          <p className="auth-subtitle">Track your coding consistency every day</p>
        </div>
        <div className="auth-tabs">
          <button className={`auth-tab${isLogin ? " active" : ""}`}
            onClick={() => { setIsLogin(true); setError(""); }}>
            Login
          </button>
          <button className={`auth-tab${!isLogin ? " active" : ""}`}
            onClick={() => { setIsLogin(false); setError(""); }}>
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label>Username</label>
            <input placeholder="Enter your username" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          </div>
          {!isLogin && (
            <div>
              <label>Email</label>
              <input type="email" placeholder="Enter your email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          )}
          <div>
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && (
            <p style={{ color: "var(--danger)", fontSize: "0.85rem", fontWeight: 500 }}>{error}</p>
          )}
          <button type="submit" className="btn-primary" disabled={loading}
            style={{ marginTop: "0.25rem" }}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}