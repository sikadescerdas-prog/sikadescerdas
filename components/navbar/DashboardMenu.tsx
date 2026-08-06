// components/navbar/DashboardMenu.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Store, LayoutDashboard, LogOut, Loader2 } from "lucide-react";
import { useLogout } from "@/core/auth/hooks/useLogout";
import { getInitials } from "@/core/profile/helpers/getInitials";

interface UserData {
  username: string;
  fullname: string;
  email: string;
  avatar: string | null;
  role: string;
  storeSlug: string | null;
}

export default function UserMenu() {
  const { handleLogout, isLoading: isLoggingOut } = useLogout();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        const userData = data.user
          ? {
              ...data.user,
              fullname: data.profile?.fullname ?? data.user.fullname ?? "",
              avatar: data.profile?.avatar_url ?? data.user.avatar ?? null,
            }
          : null;

        setUser(userData);
      } catch (error) {
        console.error("Gagal memuat profil pengguna:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const role = user?.role ?? "";
  const isSeller = role === "seller";
  const isAdmin = role === "admin" || role === "superadmin";

  const username = user?.username ?? "";
  const fullname = user?.fullname ?? "";
  const email = user?.email ?? "";
  const avatar = user?.avatar ?? null;
  const storeSlug = user?.storeSlug ?? username;

  const displayName = fullname || username || "User";
  const initial = getInitials(displayName || email);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-full p-1.5 transition-all duration-300 hover:bg-slate-100 disabled:opacity-50"
      >
        <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#7AF3AE] to-[#25C95F] shadow-md shadow-green-500/20">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : avatar ? (
            <Image src={avatar} alt={displayName} width={32} height={32} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-medium text-white">{initial}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-100/80 bg-white shadow-xl shadow-black/[0.08]">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#7AF3AE] to-[#25C95F]">
              {avatar ? (
                <Image src={avatar} alt={displayName} width={40} height={40} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-white">{initial}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{displayName}</p>
              {username && <p className="truncate text-xs font-medium text-[#25C95F]">@{username}</p>}
              {email && <p className="truncate text-xs text-slate-400">{email}</p>}
            </div>
          </div>

          <div className="border-t border-slate-100" />

          <div className="py-1.5">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#25C95F]"
            >
              <User className="h-4 w-4 text-slate-400" />
              <span>Profile</span>
            </Link>

            {isSeller && (
              <Link
                href={storeSlug ? `/store/${storeSlug}` : "/store"}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#25C95F]"
              >
                <Store className="h-4 w-4 text-slate-400" />
                <span>Toko Saya</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#25C95F]"
              >
                <LayoutDashboard className="h-4 w-4 text-slate-400" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          <div className="border-t border-slate-100" />

          <div className="py-1.5">
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}