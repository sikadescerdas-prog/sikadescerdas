// components/profile/ProfileCard.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LayoutDashboard, Store, User, Settings } from "lucide-react";

import { useProfile } from "@/core/profile/hooks/useProfile";
import { profileService } from "@/core/profile/services/profile.service";
import { storeService } from "@/modules/store/services/store.service";
import { sweet } from "@/shared/utils/sweet";

import { HeaderProfile } from "@/components/profile/HeaderProfile";
import { MenuProfile, type MenuItem } from "@/components/profile/MenuProfile";
import LogoutButton from "@/components/profile/LogoutButton";

export default function ProfileCard() {
  const router = useRouter();
  const { user, loading, refetch } = useProfile();
  const [openingStore, setOpeningStore] = useState(false);

  const role = user?.role ?? "user";
  const isAdmin = role === "admin" || role === "superadmin";
  const isSeller = role === "seller";

  const handleBukaToko = async () => {
    if (!user?.id || isAdmin || openingStore) return;

    setOpeningStore(true);

    try {
      const isCompleted = await profileService.getStatus();

      if (!isCompleted) {
        await sweet.error({
          title: "Profile Belum Lengkap",
          text: "Mohon lengkapi profile Anda terlebih dahulu sebelum membuka toko.",
        });

        router.push("/profile/settings");
        return;
      }

      const storeName = await sweet.input({
        title: "Buka Toko",
        text: "Masukkan nama toko Anda.",
        inputPlaceholder: "Contoh: Toko Saya",
        confirmButtonText: "Buka Toko",
        cancelText: "Batal",
        inputValidator: (value) => {
          const name = value?.trim() ?? "";

          if (!name) return "Nama toko wajib diisi.";
          if (name.length < 3) return "Nama toko minimal 3 karakter.";
          if (name.length > 150) return "Nama toko maksimal 150 karakter.";

          return null;
        },
      });

      if (!storeName) return;

      await storeService.createStore(storeName.trim());
      await refetch();

      await sweet.success({
        title: "Toko Berhasil Dibuat",
        text: "Silakan lengkapi informasi toko Anda.",
      });

      router.push("/store/settings");
    } catch (error: unknown) {
      console.error("[OPEN_STORE_ERROR]:", error);

      const errorCode =
        typeof error === "object" && error !== null && "code" in error
          ? String(error.code)
          : "";

      const errorMessage =
        error instanceof Error ? error.message : "Gagal membuka toko.";

      if (errorCode === "STORE_ALREADY_EXISTS") {
        await sweet.error({
          title: "Toko Sudah Ada",
          text: "Anda sudah memiliki toko.",
        });

        router.push("/store/settings");
        return;
      }

      if (errorCode === "ADMIN_CANNOT_CREATE_STORE") {
        await sweet.error({
          title: "Tidak Diizinkan",
          text: "Admin dan Superadmin tidak dapat membuka toko.",
        });

        return;
      }

      await sweet.error({
        title: "Gagal Membuka Toko",
        text: errorMessage,
      });
    } finally {
      setOpeningStore(false);
    }
  };

  const menuItems: MenuItem[] = [
    ...(isAdmin
      ? [
          {
            label: "Dashboard",
            icon: <LayoutDashboard size={18} />,
            variant: "blue" as const,
            onClick: () => router.push("/dashboard"),
          },
        ]
      : []),

    {
      label: "Ubah Profile",
      icon: <User size={18} />,
      variant: "default",
      onClick: () => router.push("/profile/settings"),
    },

    ...(!isAdmin
      ? [
          {
            label: isSeller ? "Kelola Toko" : "Buka Toko",
            icon: <Store size={18} />,
            variant: isSeller ? ("emerald" as const) : ("green" as const),
            onClick: isSeller
              ? () => router.push("/store/settings")
              : handleBukaToko,
          },
        ]
      : []),
  ];

  // Menu Pengaturan dengan ikon Gear di bawah
  const settingsMenuItems: MenuItem[] = [
    {
      label: "Pengaturan",
      icon: <Settings size={18} />,
      variant: "default",
      onClick: () => router.push("/profile/security"),
    },
  ];

  if (loading || openingStore) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-gray-500">
        <Loader2 size={32} className="animate-spin text-green-600" />
        <span className="font-medium">
          {openingStore ? "Membuka Toko..." : "Memuat Profile..."}
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Profile tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 via-white to-white px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-xl space-y-6">
        <HeaderProfile
          fullname={user.fullname}
          username={user.username}
          email={user.email}
          avatarUrl={user.avatar}
        />

        <div className="border-t border-gray-100" />

        <MenuProfile items={menuItems} />

        <div className="border-t border-gray-100" />

        {/* Menu Pengaturan dengan ikon Gear tepat di atas tombol Logout */}
        <MenuProfile items={settingsMenuItems} />

        <div className="border-t border-gray-100" />

        <LogoutButton />
      </div>
    </div>
  );
}