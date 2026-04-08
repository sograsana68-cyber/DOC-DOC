import { useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const { login, isAuthenticated, ready } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Login failed. Check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <div className={styles.wrap}>
        <p className={styles.sub}>Loading…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>DOC-DOC</h1>
        <p className={styles.sub}>Sign in to manage family documents</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          {error ? <p className={styles.error}>{error}</p> : null}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className={styles.hint}>Demo: demo@example.com / password123</p>
      </div>
    </div>
  );
}
