// app/settings/page.tsx

"use client";

import { useEffect, useState } from "react";
import AccountSecurity from "@/components/auth/AccountSecurity";
import { authService, AuthUser } from "@/core/auth/services/auth.service";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await authService.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Gagal memuat data pengguna:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Silakan login terlebih dahulu untuk mengakses halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AccountSecurity userId={user.id} />
    </div>
  );
}