// components/dashboard/users/UsersHeader.tsx

"use client";

import React, { useState, useEffect } from "react";
import { FaUsers, FaUser, FaStore, FaSearch, FaTimes, FaRedo, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useUsers } from "@/core/users/hooks/useUsers";

interface User {
  role?: string;
}

interface UsersHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function UsersHeader({ searchTerm, setSearchTerm }: UsersHeaderProps) {
  const { users } = useUsers();
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Ambil data user dari /api/auth/me untuk pengecekan role
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        setUser({
          role: data.user?.role,
        });
      } catch (error) {
        console.error("Fetch user error:", error);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchTerm(localSearch);
  };

  const handleClear = () => {
    setLocalSearch("");
    setSearchTerm("");
  };

  const handleResetToDashboard = () => {
    window.location.href = "/dashboard/users";
  };

  const filtered = users.filter((u) => {
    const role = u.role || "user";
    return role === "user" || role === "seller";
  });

  const total = filtered.length;
  const usersOnly = filtered.filter((u) => !u.role || u.role === "user").length;
  const sellers = filtered.filter((u) => u.role === "seller").length;

  // Cek apakah role user yang sedang login adalah superadmin
  const isSuperAdmin = user?.role === "superadmin";

  return (
    <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-6 md:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-green-500/20 blur-3xl" />
        <div className="absolute top-10 right-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/15 backdrop-blur">
              <FaUsers className="text-xl text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white">Manajemen Users</h1>
                
                {/* Tombol Add HANYA MUNCUL jika superadmin dan tidak sedang loading */}
                {!loadingUser && isSuperAdmin && (
                  <Link
                    href="/dashboard/users/form"
                    className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-green-500"
                    title="Tambah User Baru"
                  >
                    <FaPlus className="text-xs" />
                  </Link>
                )}
              </div>
              <p className="text-sm text-white/60">Data user & seller sistem</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Stat icon={<FaUsers className="text-green-400" />} label="Total" value={total} />
            <Stat icon={<FaUser className="text-gray-300" />} label="User" value={usersOnly} />
            <Stat icon={<FaStore className="text-blue-400" />} label="Seller" value={sellers} />
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <form onSubmit={handleSearchSubmit} className="relative flex flex-1 items-center gap-2">
            <div className="group relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/80 pointer-events-none transition-colors group-focus-within:text-white">
                <FaSearch className="text-sm" />
              </span>
              <input
                type="text"
                placeholder="Cari nama, username, atau email..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/10 py-2.5 pl-10 pr-9 text-sm text-white shadow-sm backdrop-blur placeholder:text-white/40 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/50 hover:text-white transition"
                  title="Bersihkan input"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white shadow-sm backdrop-blur transition hover:bg-white/10"
            >
              <FaSearch className="text-xs text-green-400" />
              <span>Cari</span>
            </button>
          </form>

          <button
            type="button"
            onClick={handleResetToDashboard}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 shadow-sm backdrop-blur transition hover:bg-white/10 hover:text-white"
            title="Reset dan muat ulang halaman"
          >
            <FaRedo className="text-xs text-amber-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-white shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-sm">
        {icon}
        {label}: <span className="font-bold">{value}</span>
      </div>
    </div>
  );
}