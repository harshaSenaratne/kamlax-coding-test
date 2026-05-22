import { pool } from "../db/pool";

type TransactionRow = {
  id: number;
  investment_id: number | null;
  investment_name: string;
  type: "BUY" | "SELL";
  quantity: string;
  price: string;
  total_amount: string;
  transacted_at: Date;
};

export async function listTransactions(userId: number) {
  const result = await pool.query<TransactionRow>(
    `SELECT
       id,
       investment_id,
       investment_name,
       type,
       quantity,
       price,
       total_amount,
       transacted_at
     FROM transactions
     WHERE user_id = $1
     ORDER BY transacted_at DESC, id DESC`,
    [userId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    investmentId: row.investment_id,
    investmentName: row.investment_name,
    type: row.type,
    quantity: Number(row.quantity),
    price: Number(row.price),
    totalAmount: Number(row.total_amount),
    transactedAt: row.transacted_at
  }));
}

