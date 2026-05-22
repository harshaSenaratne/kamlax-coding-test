import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { pool } from "./pool";

type SeedInvestment = {
  assetType: string;
  name: string;
  symbol: string | null;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
};

const seedInvestments: SeedInvestment[] = [
  {
    assetType: "STOCK",
    name: "Apple",
    symbol: "AAPL",
    quantity: 12,
    purchasePrice: 167.5,
    currentPrice: 198.42
  },
  {
    assetType: "ETF",
    name: "Vanguard Total Stock Market ETF",
    symbol: "VTI",
    quantity: 8,
    purchasePrice: 228.4,
    currentPrice: 276.1
  },
  {
    assetType: "BOND",
    name: "US Treasury Bond Ladder",
    symbol: null,
    quantity: 5,
    purchasePrice: 1000,
    currentPrice: 1012
  },
  {
    assetType: "CRYPTO",
    name: "Bitcoin",
    symbol: "BTC",
    quantity: 0.18,
    purchasePrice: 42000,
    currentPrice: 63000
  }
];

export async function seedDemoData() {
  const passwordHash = await bcrypt.hash(env.DEMO_USER_PASSWORD, 12);
  const userResult = await pool.query<{ id: number }>(
    `INSERT INTO users (email, name, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [env.DEMO_USER_EMAIL.toLowerCase(), "Demo Investor", passwordHash]
  );
  const userId = userResult.rows[0].id;

  const positionCount = await pool.query<{ count: string }>(
    "SELECT COUNT(*) FROM investments WHERE user_id = $1",
    [userId]
  );

  if (Number(positionCount.rows[0].count) > 0) {
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const investmentIds = new Map<string, number>();

    for (const investment of seedInvestments) {
      const result = await client.query<{ id: number }>(
        `INSERT INTO investments
          (user_id, asset_type, name, symbol, quantity, purchase_price, current_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          userId,
          investment.assetType,
          investment.name,
          investment.symbol,
          investment.quantity,
          investment.purchasePrice,
          investment.currentPrice
        ]
      );
      investmentIds.set(investment.name, result.rows[0].id);
    }

    const transactions = [
      ["Apple", "BUY", 15, 167.5, "2025-10-10T09:30:00.000Z"],
      ["Apple", "SELL", 3, 194.2, "2026-02-03T15:10:00.000Z"],
      ["Vanguard Total Stock Market ETF", "BUY", 8, 228.4, "2025-11-18T14:00:00.000Z"],
      ["US Treasury Bond Ladder", "BUY", 5, 1000, "2026-01-06T10:45:00.000Z"],
      ["Bitcoin", "BUY", 0.18, 42000, "2026-03-12T08:25:00.000Z"]
    ] as const;

    for (const [name, type, quantity, price, transactedAt] of transactions) {
      await client.query(
        `INSERT INTO transactions
          (user_id, investment_id, investment_name, type, quantity, price, total_amount, transacted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [userId, investmentIds.get(name), name, type, quantity, price, quantity * price, transactedAt]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

