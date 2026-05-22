import cors from "cors";
import express from "express";
import helmet from "helmet";
import { corsOrigins } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth-routes";
import { investmentRouter } from "./routes/investment-routes";
import { transactionRouter } from "./routes/transaction-routes";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: corsOrigins
  })
);
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});
app.use("/api/auth", authRouter);
app.use("/api/investments", investmentRouter);
app.use("/api/transactions", transactionRouter);

app.use(notFoundHandler);
app.use(errorHandler);

