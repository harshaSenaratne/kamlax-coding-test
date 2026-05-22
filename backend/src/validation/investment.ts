import { z } from "zod";

export const investmentInputSchema = z
  .object({
    assetType: z.enum(["STOCK", "ETF", "BOND", "FUND", "CRYPTO", "CASH"]),
    name: z.string().trim().min(2).max(120),
    symbol: z.string().trim().max(16).optional().or(z.literal("")),
    quantity: z.coerce.number().positive().max(1_000_000_000),
    purchasePrice: z.coerce.number().positive().max(1_000_000_000),
    currentPrice: z.coerce.number().min(0).max(1_000_000_000)
  })
  .strict();

export type InvestmentInput = z.infer<typeof investmentInputSchema>;

