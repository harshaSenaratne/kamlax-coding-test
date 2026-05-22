import { Pencil, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, ApiClientError } from "../api/client";
import { LoadingState } from "../components/LoadingState";
import { Investment } from "../types";
import { formatCurrency, formatPercent, formatQuantity } from "../utils/format";

export function DashboardPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInvestments() {
      try {
        const response = await api.listInvestments();
        if (active) {
          setInvestments(response.investments);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof ApiClientError
              ? requestError.message
              : "Portfolio positions could not be loaded."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInvestments();
    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    const totalCost = investments.reduce((total, investment) => total + investment.totalCost, 0);
    const totalValue = investments.reduce((total, investment) => total + investment.currentValue, 0);
    const gainLoss = totalValue - totalCost;

    return {
      totalCost,
      totalValue,
      gainLoss,
      performance: totalCost === 0 ? 0 : (gainLoss / totalCost) * 100
    };
  }, [investments]);

  return (
    <section className="content-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Portfolio Dashboard</h1>
        </div>
        <Link className="button button-accent" to="/investments/new">
          <Plus aria-hidden="true" size={18} />
          New investment
        </Link>
      </header>

      <div className="summary-grid">
        <SummaryCard label="Portfolio Value" value={formatCurrency(summary.totalValue)} />
        <SummaryCard label="Total Cost" value={formatCurrency(summary.totalCost)} />
        <SummaryCard label="Gain / Loss" tone={summary.gainLoss} value={formatCurrency(summary.gainLoss)} />
        <SummaryCard label="Performance" tone={summary.performance} value={formatPercent(summary.performance)} />
      </div>

      <section className="panel">
        <div className="panel-header">
          <h2>Investments</h2>
          <span>{investments.length} positions</span>
        </div>

        {loading ? <LoadingState label="Loading investments" /> : null}
        {error ? <div className="alert">{error}</div> : null}
        {!loading && !error && investments.length === 0 ? (
          <div className="state">
            <strong>No investments yet.</strong>
            <span>Add a position to start the portfolio view.</span>
          </div>
        ) : null}
        {!loading && !error && investments.length > 0 ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Quantity</th>
                  <th>Purchase Price</th>
                  <th>Current Value</th>
                  <th>Gain / Loss</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => (
                  <tr key={investment.id}>
                    <td>
                      <div className="asset-cell">
                        <strong>{investment.name}</strong>
                        <span>
                          {investment.assetType}
                          {investment.symbol ? ` | ${investment.symbol}` : ""}
                        </span>
                      </div>
                    </td>
                    <td>{formatQuantity(investment.quantity)}</td>
                    <td>{formatCurrency(investment.purchasePrice)}</td>
                    <td>{formatCurrency(investment.currentValue)}</td>
                    <td className={investment.gainLoss >= 0 ? "positive" : "negative"}>
                      {formatCurrency(investment.gainLoss)}
                      <small>{formatPercent(investment.gainLossPercent)}</small>
                    </td>
                    <td>
                      <Link
                        aria-label={`Edit ${investment.name}`}
                        className="icon-button"
                        title={`Edit ${investment.name}`}
                        to={`/investments/${investment.id}/edit`}
                      >
                        <Pencil aria-hidden="true" size={17} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone?: number;
}) {
  const toneClass = tone === undefined ? "" : tone >= 0 ? "positive" : "negative";
  return (
    <article className="summary-card">
      <span>{label}</span>
      <strong className={toneClass}>{value}</strong>
    </article>
  );
}

