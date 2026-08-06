// core/auth/hooks/useAuthRedirect.ts

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/* =========================
   USE AUTH REDIRECT HOOK
========================= */
export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (res.ok) {
          router.replace("/");
        }
      } catch {
        // User belum terautentikasi / fetch gagal, biarkan di halaman saat ini
      }
    }

    checkAuth();
  }, [router]);
}