import { History, LineChart, LogOut, Plus } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AppShell() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            PM
          </span>
          <div>
            <strong>Portfolio Manager</strong>
            <span>{auth.user?.email}</span>
          </div>
        </div>

        <nav className="primary-nav" aria-label="Portfolio">
          <NavLink to="/dashboard">
            <LineChart aria-hidden="true" size={18} />
            Overview
          </NavLink>
          <NavLink to="/transactions">
            <History aria-hidden="true" size={18} />
            Transactions
          </NavLink>
        </nav>

        <div className="topbar-actions">
          <button className="button button-accent" onClick={() => navigate("/investments/new")} type="button">
            <Plus aria-hidden="true" size={18} />
            Add
          </button>
          <button
            aria-label="Log out"
            className="icon-button"
            onClick={auth.logout}
            title="Log out"
            type="button"
          >
            <LogOut aria-hidden="true" size={18} />
          </button>
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}

