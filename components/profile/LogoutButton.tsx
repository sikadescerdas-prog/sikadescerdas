// components/auth/LogoutButton.tsx

"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { authService } from "@/core/auth/services/auth.service";
import { sweet } from "@/shared/utils/sweet";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const confirm = await sweet.confirm({
      title: "Logout?",
      text: "Yakin ingin keluar?",
      confirmButtonText: "Ya",
      cancelText: "Tidak",
    });

    if (!confirm) return;

    try {
      await authService.logout();
      router.replace("/login");
    } catch {
      sweet.error({
        title: "Error",
        text: "Gagal logout",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-100 active:scale-[0.98]"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
}