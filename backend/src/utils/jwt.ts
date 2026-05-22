import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type TokenUser = {
  id: number;
  email: string;
  name: string;
};

export function createAccessToken(user: TokenUser) {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    subject: String(user.id)
  };

  return jwt.sign(user, env.JWT_SECRET, options);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as TokenUser;
}

