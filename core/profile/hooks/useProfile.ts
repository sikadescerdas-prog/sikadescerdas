// core/profile/hooks/UseProfile.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import { authService, type AuthUser } from "@/core/auth/services/auth.service";
import { sweet } from "@/shared/utils/sweet";

export interface UseProfileReturn {
  user: AuthUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

/* =========================
   USE PROFILE HOOK
========================= */
export function useProfile(): UseProfileReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authService.me();
      
      setUser(data);
    } catch (error: unknown) {
      console.error("[PROFILE_ERROR]:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengambil profile";

      sweet.error({
        title: "Gagal",
        text: errorMessage,
      });

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    user,
    loading,
    refetch: loadProfile,
  };
}