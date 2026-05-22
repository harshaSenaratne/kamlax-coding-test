import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { createAccessToken } from "../utils/jwt";

type UserRow = {
  id: number;
  email: string;
  name: string;
  password_hash: string;
};

const loginSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().min(1)
  })
  .strict();

export const authRouter = Router();

authRouter.post(
  "/login",
  asyncHandler(async (request, response) => {
    const input = loginSchema.parse(request.body);
    const result = await pool.query<UserRow>(
      "SELECT id, email, name, password_hash FROM users WHERE email = $1",
      [input.email.toLowerCase()]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(input.password, user.password_hash))) {
      throw new ApiError(401, "Email or password is incorrect.");
    }

    const sessionUser = { id: user.id, email: user.email, name: user.name };
    response.json({
      token: createAccessToken(sessionUser),
      user: sessionUser
    });
  })
);

authRouter.get("/me", requireAuth, (request, response) => {
  response.json({ user: request.user });
});

