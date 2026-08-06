// components/auth/AuthGuard.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    // Memeriksa status sesi autentikasi pengguna
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });

        // Jika sudah login, alihkan ke halaman utama
        if (res.ok) {
          router.replace("/");
        }
      } catch {
        // Abaikan error jika belum login atau fetch gagal
      }
    }

    checkSession();
  }, [router]);

  return <>{children}</>;
}