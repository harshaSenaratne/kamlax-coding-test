import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { listTransactions } from "../services/transaction-service";
import { asyncHandler } from "../utils/async-handler";

export const transactionRouter = Router();
transactionRouter.use(requireAuth);

transactionRouter.get(
  "/",
  asyncHandler(async (request, response) => {
    response.json({ transactions: await listTransactions(request.user!.id) });
  })
);

