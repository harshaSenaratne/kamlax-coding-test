export type AssetType = "STOCK" | "ETF" | "BOND" | "FUND" | "CRYPTO" | "CASH";

export type User = {
  id: number;
  email: string;
  name: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type InvestmentInput = {
  assetType: AssetType;
  name: string;
  symbol?: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
};

export type Investment = InvestmentInput & {
  id: number;
  symbol: string | null;
  totalCost: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioTransaction = {
  id: number;
  investmentId: number | null;
  investmentName: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  totalAmount: number;
  transactedAt: string;
};

