import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

interface JwtPayload {
  userId: string;
  role: "employer" | "candidate";
}

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

// Protect routes by validating the JWT and attaching auth info to the request.
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.auth = payload;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}
