import { pool } from "./pool";

const schemaSql = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS investments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('STOCK', 'ETF', 'BOND', 'FUND', 'CRYPTO', 'CASH')),
    name TEXT NOT NULL,
    symbol TEXT,
    quantity NUMERIC(18, 6) NOT NULL CHECK (quantity > 0),
    purchase_price NUMERIC(14, 2) NOT NULL CHECK (purchase_price > 0),
    current_price NUMERIC(14, 2) NOT NULL CHECK (current_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    investment_id INTEGER REFERENCES investments(id) ON DELETE SET NULL,
    investment_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('BUY', 'SELL')),
    quantity NUMERIC(18, 6) NOT NULL CHECK (quantity > 0),
    price NUMERIC(14, 2) NOT NULL CHECK (price > 0),
    total_amount NUMERIC(16, 2) NOT NULL CHECK (total_amount > 0),
    transacted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS investments_user_id_idx ON investments(user_id);
  CREATE INDEX IF NOT EXISTS transactions_user_date_idx ON transactions(user_id, transacted_at DESC);
`;

export async function createSchema() {
  await pool.query(schemaSql);
}

