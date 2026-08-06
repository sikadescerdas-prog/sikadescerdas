// core/auth/hooks/useCurrentUser.ts

"use client";

import { useEffect, useState } from "react";

export type CurrentUser = {
  id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string | null;
  role: string;
};

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();

        if (data.user) {
          setUser({
            id: data.user.id ?? "",
            username: data.user.username ?? "",
            email: data.user.email ?? "",
            role: data.user.role ?? "user",
            fullname: data.profile?.fullname ?? data.user.fullname ?? "",
            avatar: data.profile?.avatar_url ?? data.user.avatar ?? null,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Gagal memuat data pengguna:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return {
    user,
    loading,
  };
}