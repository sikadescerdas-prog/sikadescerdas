// components/Sidebar.tsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard, Home, Building2, Users, Trees, Store, Newspaper, Settings, PanelLeft, PanelLeftClose, ChevronDown, LogOut, X, LucideIcon, Landmark, Network, FileText } from "lucide-react";

interface SidebarProps { isSlim: boolean; onToggle: () => void; variant?: "desktop" | "mobile"; }
interface UserData { id: string; username: string; fullname: string; email: string; avatar: string | null; role: "user" | "admin" | "superadmin"; }
interface SubMenuItem { title: string; href: string; icon: LucideIcon; }
interface MenuItem { title: string; icon: LucideIcon; href?: string; submenu?: SubMenuItem[]; }

export function Sidebar({ isSlim, onToggle, variant = "desktop" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = variant === "mobile";
  const slim = isMobile ? false : isSlim;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.user) setUserData(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const username = userData?.username ?? "";
  const fullname = userData?.fullname ?? "";
  const email = userData?.email ?? "";
  const avatar = userData?.avatar ?? "";
  const displayName = fullname || username || "Admin";

  const toggleDropdown = (index: number) => { setOpenDropdown(openDropdown === index ? null : index); };
  const isGroupActive = (items?: SubMenuItem[]) => items?.some((item) => pathname === item.href);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems: MenuItem[] = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { title: "Desa", icon: Building2, submenu: [
      { title: "Profil Desa", href: "/dashboard/village", icon: Landmark },
      { title: "Struktur Desa", href: "/dashboard/structure", icon: Network },
      { title: "Data Penduduk", href: "/dashboard/population", icon: FileText },
      { title: "Fasilitas Desa", href: "/dashboard/facility", icon: Building2 },
      { title: "Potensi Desa", href: "/dashboard/potential", icon: Trees }
    ] },
    { title: "UMKM Desa", icon: Store, href: "/dashboard/umkm" },
    { title: "Berita", icon: Newspaper, href: "/dashboard/news" },
    { title: "Settings", icon: Settings, submenu: [{ title: "Users", href: "/dashboard/users", icon: Users }] }
  ];

  useEffect(() => {
    if (slim) return;
    menuItems.forEach((item, index) => {
      if (item.submenu && isGroupActive(item.submenu)) {
        setOpenDropdown(index);
      }
    });
  }, [pathname, slim]);

  return (
    <aside className={clsx("relative flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300", slim ? "w-20" : "w-60")}>
      {isMobile && (
        <button onClick={onToggle} className="absolute right-3 top-3 z-50 rounded-lg p-2 hover:bg-gray-100">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      )}

      {!isMobile && (
        <button onClick={onToggle} className={clsx("absolute z-40 flex items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-gray-50", slim ? "-right-3 top-4 h-8 w-8" : "-right-4 top-4 h-8 w-8")}>
          {slim ? <PanelLeft className="h-4 w-4 text-gray-600" /> : <PanelLeftClose className="h-4 w-4 text-gray-600" />}
        </button>
      )}

      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
        <div className="flex items-center p-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <Image src="/logo-desa.png" alt="Logo Desa" width={40} height={40} className="object-contain" />
            </div>
            {!slim && (
              <div className="flex flex-col">
                <span className="text-lg font-bold">
                  <span className="text-slate-800">Desa</span> <span className="text-green-600">Danasari</span>
                </span>
                <span className="text-[10px] text-slate-400">SIKADES Cerdas</span>
              </div>
            )}
          </Link>
        </div>
      </div>

      {!slim && (
        <div className="flex flex-col items-center border-b p-4 text-center">
          {loading ? (
            <>
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
              <div className="mt-3 h-4 w-28 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-100" />
              <div className="mt-2 h-3 w-36 animate-pulse rounded bg-gray-100" />
            </>
          ) : (
            <>
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-green-100">
                {avatar ? (
                  <Image src={avatar} alt={displayName} fill className="object-cover" />
                ) : (
                  <span className="font-bold text-green-700">{displayName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-800">{displayName}</p>
              {username && <p className="text-xs text-gray-500">@{username}</p>}
              {email && <p className="max-w-[180px] truncate text-[11px] text-gray-400">{email}</p>}
            </>
          )}
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {menuItems.map((item, index) => (
          <div key={index}>
            {!item.submenu ? (
              <Link href={item.href!} title={slim ? item.title : undefined} className={clsx("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", pathname === item.href ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900", slim && "justify-center")}>
                <item.icon className="h-5 w-5 shrink-0" />
                {!slim && <span>{item.title}</span>}
              </Link>
            ) : (
              <>
                {!slim ? (
                  <>
                    <button onClick={() => toggleDropdown(index)} className={clsx("flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition", isGroupActive(item.submenu) ? "text-green-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}>
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown className={clsx("h-4 w-4 transition-transform", openDropdown === index && "rotate-180")} />
                    </button>
                    {openDropdown === index && (
                      <div className="ml-5 mt-1 space-y-1">
                        {item.submenu.map((sub) => (
                          <Link key={sub.href} href={sub.href} className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition", pathname === sub.href ? "bg-green-50 font-semibold text-green-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900")}>
                            <sub.icon className="h-4 w-4 shrink-0" />
                            <span>{sub.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-1">
                    {item.submenu.map((sub) => (
                      <Link key={sub.href} href={sub.href} title={sub.title} className={clsx("flex justify-center rounded-xl p-2.5 transition", pathname === sub.href ? "bg-green-50 text-green-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900")}>
                        <sub.icon className="h-5 w-5" />
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t p-3">
        <button onClick={handleLogout} className={clsx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50", slim && "justify-center")}>
          <LogOut className="h-5 w-5 shrink-0" />
          {!slim && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}