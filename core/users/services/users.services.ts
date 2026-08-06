// core/users/services/users.services.ts

import type { AuthUser } from "@/core/auth/types/user.types";

export interface DashboardUser extends AuthUser {
  fullname?: string;
  isActive?: boolean;
}

export async function fetchUsersApi(): Promise<DashboardUser[]> {
  const response = await fetch("/api/users", { method: "GET", cache: "no-store" });
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Gagal mengambil data pengguna");
  }

  return result.data;
}