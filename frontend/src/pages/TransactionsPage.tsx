import { useEffect, useState } from "react";
import { api, ApiClientError } from "../api/client";
import { LoadingState } from "../components/LoadingState";
import { PortfolioTransaction } from "../types";
import { formatCurrency, formatDate, formatQuantity } from "../utils/format";

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTransactions() {
      try {
        const response = await api.listTransactions();
        if (active) {
          setTransactions(response.transactions);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof ApiClientError
              ? requestError.message
              : "Transaction history could not be loaded."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadTransactions();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="content-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">History</span>
          <h1>Transactions</h1>
        </div>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2>Buy and sell activity</h2>
          <span>{transactions.length} records</span>
        </div>

        {loading ? <LoadingState label="Loading transactions" /> : null}
        {error ? <div className="alert">{error}</div> : null}
        {!loading && !error && transactions.length === 0 ? (
          <div className="state">
            <strong>No transactions yet.</strong>
            <span>New investments add a buy record here.</span>
          </div>
        ) : null}
        {!loading && !error && transactions.length > 0 ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Investment</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.transactedAt)}</td>
                    <td>{transaction.investmentName}</td>
                    <td>
                      <span className={`trade-type ${transaction.type.toLowerCase()}`}>{transaction.type}</span>
                    </td>
                    <td>{formatQuantity(transaction.quantity)}</td>
                    <td>{formatCurrency(transaction.price)}</td>
                    <td>{formatCurrency(transaction.totalAmount)}</td>
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

