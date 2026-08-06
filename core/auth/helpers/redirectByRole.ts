// core/auth/helpers/redirectByRole.ts

import type { UserRole } from "../types/user.types";

/* =========================
   REDIRECT BY ROLE
========================= */
export function redirectByRole(
  role: UserRole | null,
  storeSlug?: string | null
): string {
  if (!role) {
    return "/login";
  }

  switch (role) {
    case "seller":
      return storeSlug ? `/toko/${storeSlug}` : "/";

    case "admin":
    case "superadmin":
      return "/dashboard";

    case "user":
    default:
      return "/";
  }
}