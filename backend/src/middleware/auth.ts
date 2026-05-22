import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";
import { verifyAccessToken } from "../utils/jwt";

export function requireAuth(request: Request, _response: Response, next: NextFunction) {
  const authorization = request.header("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    next(new ApiError(401, "Authentication required."));
    return;
  }

  try {
    request.user = verifyAccessToken(token);
    next();
  } catch {
    next(new ApiError(401, "Your session is invalid or expired."));
  }
}

