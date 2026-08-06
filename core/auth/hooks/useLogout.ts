// core/auth/hooks/useLogout.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/core/auth/services/auth.service";

export function useLogout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      await authService.logout();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Gagal melakukan logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogout,
    isLoading,
  };
}