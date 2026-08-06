// components/Header.tsx

"use client";

import Image from "next/image";
import { Menu, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/navbar/DashboardMenu";

interface HeaderProps { onOpenMobileSidebar: () => void; }

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/profile": "Profile Desa",
  "/dashboard/structure": "Struktur Desa",
  "/dashboard/population": "Data Desa",
  "/dashboard/facility": "Fasilitas Desa",
  "/dashboard/potential": "Potensi Desa",
  "/dashboard/umkm": "UMKM Desa",
  "/dashboard/news": "Berita",
  "/dashboard/users": "Users",
  "/dashboard/profile/settings": "Pengaturan Profil"
};

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  const pathname = usePathname();
  const pageName = breadcrumbMap[pathname] ?? "Dashboard";
  const isRootDashboard = pathname === "/dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-16 bg-white border-b border-gray-200 items-center justify-between px-4 lg:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMobileSidebar} aria-label="Buka Menu Mobile" className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <Image src="/logo-desa.png" alt="SIKADES" width={28} height={28} className="object-contain" />
          <span className="font-bold text-lg">
            <span className="text-slate-800">Desa</span>{" "}
            <span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">Danasari</span>
          </span>
        </div>

        <nav aria-label="Breadcrumb" className="hidden lg:flex items-center text-sm">
          <span className="text-gray-400 font-medium">Dashboard</span>
          {!isRootDashboard && (
            <>
              <ChevronRight className="mx-2 h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-gray-900 font-semibold">{pageName}</span>
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center">
        <UserMenu />
      </div>
    </header>
  );
}