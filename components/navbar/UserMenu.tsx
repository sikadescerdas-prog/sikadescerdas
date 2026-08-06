// components/navbar/UserMenu.tsx

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { UserRound, Settings, LogOut, Store, LayoutDashboard, Loader2 } from "lucide-react";
import AvatarNavbar from "./AvatarNavbar";

interface UserMenuProps {
  user?: {
    fullname?: string;
    username?: string;
    email?: string;
    avatar?: string;
    role?: string;
    slug?: string;
    profileSlug?: string;
  };
  loading?: boolean;
  onLogout?: () => void;
}

export default function UserMenu({ user, loading = false, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin";
  const isSeller = user?.role?.toLowerCase() === "seller";
  const storeSlug = user?.slug || user?.username;
  const storeHref = storeSlug ? `/store/${storeSlug}` : "/store";

  return (
    <div ref={menuRef} className="relative">
      <button type="button" onClick={() => !loading && setOpen((value) => !value)} disabled={loading ? true : undefined} className="rounded-full transition hover:ring-4 hover:ring-green-100 disabled:cursor-wait" aria-label="Menu pengguna">
        {loading ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
            <Loader2 className="h-5 w-5 animate-spin text-[#25C95F]" />
          </div>
        ) : (
          <AvatarNavbar fullname={user?.fullname} avatar={user?.avatar} />
        )}
      </button>

      {open && !loading && (
        <div className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
            <AvatarNavbar fullname={user?.fullname} avatar={user?.avatar} size="lg" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800">{user?.fullname || "User"}</p>
              <p className="truncate text-sm text-slate-500">@{user?.username || "username"}</p>
              <p className="truncate text-sm text-slate-500">{user?.email || "email"}</p>
            </div>
          </div>

          <div className="p-2">
            <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-green-50 hover:text-[#25C95F]">
              <UserRound size={18} className="text-[#25C95F]" />
              Profil Saya
            </Link>

            {isSeller && (
              <Link href={storeHref} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-green-50 hover:text-[#25C95F]">
                <Store size={18} className="text-[#25C95F]" />
                Toko Saya
              </Link>
            )}

            {isAdmin && (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-green-50 hover:text-[#25C95F]">
                <LayoutDashboard size={18} className="text-[#25C95F]" />
                Dashboard
              </Link>
            )}

            <div className="my-2 border-t border-slate-100" />

            <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-green-50 hover:text-[#25C95F]">
              <Settings size={18} className="text-[#25C95F]" />
              Pengaturan
            </Link>

            <div className="my-2 border-t border-slate-100" />

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}