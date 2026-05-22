import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url().default("postgresql://portfolio:portfolio@localhost:5432/portfolio"),
  JWT_SECRET: z.string().min(16).default("development-only-secret-change-me"),
  JWT_EXPIRES_IN: z.string().default("8h"),
  DEMO_USER_EMAIL: z.string().email().default("demo@portfolio.local"),
  DEMO_USER_PASSWORD: z.string().min(8).default("DemoPass123!"),
  CORS_ORIGIN: z.string().default("http://localhost:5173,http://localhost:3000")
});

export const env = envSchema.parse(process.env);
export const corsOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

