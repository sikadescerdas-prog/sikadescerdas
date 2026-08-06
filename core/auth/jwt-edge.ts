// core/auth/jwt-edge.ts

import { jwtVerify, type JWTPayload } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
const secret = new TextEncoder().encode(JWT_SECRET ?? "");

/* =========================
   VERIFY TOKEN (EDGE RUNTIME)
========================= */
export async function verifyTokenEdge(
  token: string
): Promise<JWTPayload | null> {
  if (!JWT_SECRET) {
    console.error("[JWT_EDGE_ERROR] JWT_SECRET belum dikonfigurasi di .env");
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}