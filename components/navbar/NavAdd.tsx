// components/navbar/NavbarAdd.tsx

"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavbarAddProps {
  user?: {
    role?: string;
    hasStore?: boolean;
  };
}

export default function NavbarAdd({ user }: NavbarAddProps) {
  const pathname = usePathname();

  if (!user) return null;

  const isAdmin = user.role === "admin" || user.role === "superadmin";
  const isSeller = user.role === "seller" || user.hasStore;
  const isUser = user.role === "user" || user.role === "warga" || !isAdmin;

  let href = "";
  let title = "";

  if ((pathname.startsWith("/literature") || pathname.startsWith("/literasi")) && isUser) {
    href = "/literature/form";
    title = "Tambah Literasi";
  }

  if (pathname.startsWith("/store") && isSeller) {
    href = "/product/form";
    title = "Tambah Produk";
  }

  if (pathname.startsWith("/news") && isAdmin) {
    href = "/dashboard/news";
    title = "Tambah Berita";
  }

  if (!href) return null;

  return (
    <Link
      href={href}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-50 active:scale-95 md:h-9 md:w-9"
    >
      <Plus className="h-4 w-4 text-[#25C95F] md:h-5 md:w-5" />
    </Link>
  );
}