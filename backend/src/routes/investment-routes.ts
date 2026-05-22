import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  createInvestment,
  getInvestment,
  listInvestments,
  updateInvestment
} from "../services/investment-service";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { investmentInputSchema } from "../validation/investment";

function parseInvestmentId(rawId: string | string[]) {
  if (Array.isArray(rawId)) {
    throw new ApiError(400, "Investment id must be a positive integer.");
  }

  const investmentId = Number(rawId);
  if (!Number.isInteger(investmentId) || investmentId <= 0) {
    throw new ApiError(400, "Investment id must be a positive integer.");
  }

  return investmentId;
}

export const investmentRouter = Router();
investmentRouter.use(requireAuth);

investmentRouter.get(
  "/",
  asyncHandler(async (request, response) => {
    response.json({ investments: await listInvestments(request.user!.id) });
  })
);

investmentRouter.get(
  "/:investmentId",
  asyncHandler(async (request, response) => {
    response.json({
      investment: await getInvestment(request.user!.id, parseInvestmentId(request.params.investmentId))
    });
  })
);

investmentRouter.post(
  "/",
  asyncHandler(async (request, response) => {
    const input = investmentInputSchema.parse(request.body);
    response.status(201).json({ investment: await createInvestment(request.user!.id, input) });
  })
);

investmentRouter.put(
  "/:investmentId",
  asyncHandler(async (request, response) => {
    const input = investmentInputSchema.parse(request.body);
    response.json({
      investment: await updateInvestment(
        request.user!.id,
        parseInvestmentId(request.params.investmentId),
        input
      )
    });
  })
);
