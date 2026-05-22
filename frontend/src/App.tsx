import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { InvestmentEditorPage } from "./pages/InvestmentEditorPage";
import { LoginPage } from "./pages/LoginPage";
import { TransactionsPage } from "./pages/TransactionsPage";

export function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route element={<DashboardPage />} path="/dashboard" />
          <Route element={<TransactionsPage />} path="/transactions" />
          <Route element={<InvestmentEditorPage />} path="/investments/new" />
          <Route element={<InvestmentEditorPage />} path="/investments/:investmentId/edit" />
        </Route>
      </Route>
      <Route element={<Navigate replace to="/dashboard" />} path="*" />
    </Routes>
  );
}

