// core/auth/session.ts

import { cookies } from "next/headers";
import { verifyToken, type JwtPayload } from "./jwt";

const COOKIE_NAME = "sikades_token";

/* =========================
   SET SESSION
========================= */
export async function setSession(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 Hari
    path: "/",
  });
}

/* =========================
   GET SESSION TOKEN
========================= */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();

  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

/* =========================
   GET CURRENT USER
========================= */
export async function getCurrentUser(): Promise<JwtPayload | null> {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/* =========================
   CLEAR SESSION
========================= */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}