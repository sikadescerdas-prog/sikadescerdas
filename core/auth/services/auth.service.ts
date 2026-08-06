// core/auth/services/auth.service.ts

import type { RegisterState, UserRole } from "../types/user.types";

const API_BASE_URL = "/api/auth";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string | null;
  role: UserRole;
  storeSlug?: string | null;
};

/* =========================
   AUTH SERVICE
========================= */
export const authService = {
  /* =========================
     REGISTER
  ========================= */
  async registerWithEmail(data: RegisterState): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message ?? "Register gagal");
    }
  },

  /* =========================
     LOGIN
  ========================= */
  async loginWithIdentifier(
    identifier: string,
    password: string
  ): Promise<AuthUser> {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message ?? "Login gagal");
    }

    return json.user;
  },

  /* =========================
     LOGOUT
  ========================= */
  async logout(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Logout gagal");
    }
  },

  /* =========================
     CURRENT USER
  ========================= */
  async me(): Promise<AuthUser | null> {
    const res = await fetch(`${API_BASE_URL}/me`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();

    return json.user ?? null;
  },

  /* =========================
     GOOGLE LOGIN
  ========================= */
  async loginWithGoogle(): Promise<void> {
    throw new Error("Google Login belum diimplementasikan.");
  },
};