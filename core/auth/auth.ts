// core/auth/auth.ts

import { getCurrentUser } from "./session";

// Mengambil tipe return asli dari getCurrentUser secara otomatis
type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

export interface CheckAuthResult {
  isAuthenticated: boolean;
  user: CurrentUser;
  id: string | null;
  role: string | null;
}

/* =========================
   CHECK AUTH SERVER
========================= */
export async function checkAuth(): Promise<CheckAuthResult> {
  const user = await getCurrentUser();

  return {
    isAuthenticated: !!user,
    user,
    id: user?.id ?? null,
    role: user?.role ?? null,
  };
}