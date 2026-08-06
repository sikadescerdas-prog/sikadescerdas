// core/auth/jwt.ts

import jwt from "jsonwebtoken";
import type { UserRole } from "@/core/auth/types/user.types";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET belum diatur di .env");
}

export interface JwtPayload {
  id: string;
  role: UserRole;
  [key: string]: unknown;
}

/* =========================
   CREATE TOKEN
========================= */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

/* =========================
   VERIFY TOKEN
========================= */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);

    if (typeof decoded === "string") {
      return null;
    }

    return decoded as JwtPayload;
  } catch {
    return null;
  }
}

/* =========================
   DECODE TOKEN
========================= */
export function decodeToken(token: string): JwtPayload | null {
  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded === "string") {
    return null;
  }

  return decoded as JwtPayload;
}