import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ApiClientError } from "../api/client";
import { useAuth } from "../auth/AuthContext";

type LoginRouteState = {
  from?: string;
};

export function LoginPage() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@portfolio.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (auth.user) {
    return <Navigate replace to="/dashboard" />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await auth.login({ email, password });
      const state = location.state as LoginRouteState | null;
      navigate(state?.from ?? "/dashboard", { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof ApiClientError
          ? requestError.message
          : "Login is unavailable right now."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-layout">
      <section className="login-copy">
        <span className="eyebrow">Portfolio Management</span>
        <h1>Track positions, costs, and trade history in one practical view.</h1>
        <p>Sign in to review seeded holdings or add a fresh investment position.</p>
      </section>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign in</h2>
        {error ? <div className="alert">{error}</div> : null}
        <label>
          Email
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        <button className="button button-accent button-wide" disabled={submitting} type="submit">
          {submitting ? "Signing in" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

