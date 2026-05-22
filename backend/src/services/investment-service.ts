import { pool } from "../db/pool";
import { ApiError } from "../utils/api-error";
import { InvestmentInput } from "../validation/investment";

type InvestmentRow = {
  id: number;
  asset_type: string;
  name: string;
  symbol: string | null;
  quantity: string;
  purchase_price: string;
  current_price: string;
  created_at: Date;
  updated_at: Date;
};

const investmentFields = `
  id,
  asset_type,
  name,
  symbol,
  quantity,
  purchase_price,
  current_price,
  created_at,
  updated_at
`;

function toInvestment(row: InvestmentRow) {
  const quantity = Number(row.quantity);
  const purchasePrice = Number(row.purchase_price);
  const currentPrice = Number(row.current_price);
  const totalCost = quantity * purchasePrice;
  const currentValue = quantity * currentPrice;
  const gainLoss = currentValue - totalCost;

  return {
    id: row.id,
    assetType: row.asset_type,
    name: row.name,
    symbol: row.symbol,
    quantity,
    purchasePrice,
    currentPrice,
    totalCost,
    currentValue,
    gainLoss,
    gainLossPercent: totalCost === 0 ? 0 : (gainLoss / totalCost) * 100,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function listInvestments(userId: number) {
  const result = await pool.query<InvestmentRow>(
    `SELECT ${investmentFields}
     FROM investments
     WHERE user_id = $1
     ORDER BY updated_at DESC, id DESC`,
    [userId]
  );

  return result.rows.map(toInvestment);
}

export async function getInvestment(userId: number, investmentId: number) {
  const result = await pool.query<InvestmentRow>(
    `SELECT ${investmentFields}
     FROM investments
     WHERE user_id = $1 AND id = $2`,
    [userId, investmentId]
  );

  if (!result.rows[0]) {
    throw new ApiError(404, "Investment not found.");
  }

  return toInvestment(result.rows[0]);
}

export async function createInvestment(userId: number, input: InvestmentInput) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query<InvestmentRow>(
      `INSERT INTO investments
        (user_id, asset_type, name, symbol, quantity, purchase_price, current_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${investmentFields}`,
      [
        userId,
        input.assetType,
        input.name,
        input.symbol || null,
        input.quantity,
        input.purchasePrice,
        input.currentPrice
      ]
    );
    const investment = result.rows[0];

    await client.query(
      `INSERT INTO transactions
        (user_id, investment_id, investment_name, type, quantity, price, total_amount)
       VALUES ($1, $2, $3, 'BUY', $4, $5, $6)`,
      [userId, investment.id, investment.name, input.quantity, input.purchasePrice, input.quantity * input.purchasePrice]
    );
    await client.query("COMMIT");

    return toInvestment(investment);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateInvestment(userId: number, investmentId: number, input: InvestmentInput) {
  const result = await pool.query<InvestmentRow>(
    `UPDATE investments
     SET asset_type = $3,
         name = $4,
         symbol = $5,
         quantity = $6,
         purchase_price = $7,
         current_price = $8,
         updated_at = NOW()
     WHERE user_id = $1 AND id = $2
     RETURNING ${investmentFields}`,
    [
      userId,
      investmentId,
      input.assetType,
      input.name,
      input.symbol || null,
      input.quantity,
      input.purchasePrice,
      input.currentPrice
    ]
  );

  if (!result.rows[0]) {
    throw new ApiError(404, "Investment not found.");
  }

  return toInvestment(result.rows[0]);
}

