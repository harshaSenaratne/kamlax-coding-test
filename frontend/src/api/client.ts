import {
  Investment,
  InvestmentInput,
  LoginInput,
  PortfolioTransaction,
  User
} from "../types";

export const TOKEN_STORAGE_KEY = "portfolioDashboardToken";

type ApiErrorBody = {
  message?: string;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function request<T>(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(path, { ...init, headers });
  if (!response.ok) {
    let body: ApiErrorBody | undefined;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = undefined;
    }

    throw new ApiClientError(body?.message ?? "The server could not complete the request.", response.status);
  }

  return (await response.json()) as T;
}

export const api = {
  async login(input: LoginInput) {
    return request<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async getCurrentUser() {
    return request<{ user: User }>("/api/auth/me");
  },

  async listInvestments() {
    return request<{ investments: Investment[] }>("/api/investments");
  },

  async getInvestment(investmentId: number) {
    return request<{ investment: Investment }>(`/api/investments/${investmentId}`);
  },

  async createInvestment(input: InvestmentInput) {
    return request<{ investment: Investment }>("/api/investments", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async updateInvestment(investmentId: number, input: InvestmentInput) {
    return request<{ investment: Investment }>(`/api/investments/${investmentId}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  async listTransactions() {
    return request<{ transactions: PortfolioTransaction[] }>("/api/transactions");
  }
};

