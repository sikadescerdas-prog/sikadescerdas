// components/NavBottom.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Building2, Store, FileText, Loader2, LogIn } from "lucide-react";
import { getInitials } from "@/core/profile/helpers/getInitials";

interface User { fullname?: string; username?: string; email?: string; avatar?: string; }

export default function NavBottom() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) { setUser(null); return; }
        const data = await res.json();
        setUser({ fullname: data.user?.fullname || "", username: data.user?.username || "", email: data.user?.email || "", avatar: data.user?.avatar || null });
      } catch (error) {
        console.error("Fetch bottom nav user error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const hidePaths = ["/login", "/register", "/dashboard", "/profile", "/settings"];
  const shouldHide = hidePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (shouldHide) return null;

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/village", label: "Desa", icon: Building2 },
    { href: "/store", label: "UMKM", icon: Store },
    { href: "/literature", label: "Literasi", icon: FileText }
  ];

  const fallbackName = user?.fullname?.trim() || user?.username?.trim() || user?.email?.trim() || "User";
  const initials = getInitials(fallbackName);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/70 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} className={`flex min-w-[60px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-normal transition-all duration-200 ${active ? "text-[#25C95F]" : "text-slate-500 hover:text-[#25C95F]"}`}>
              <Icon className="h-5 w-5" strokeWidth={active ? 2.3 : 1.8} />
              <span className="font-normal">{item.label}</span>
            </Link>
          );
        })}

        {loading ? (
          <div className="flex min-w-[60px] flex-col items-center justify-center gap-0.5">
            <Loader2 className="h-5 w-5 animate-spin text-[#25C95F]" />
          </div>
        ) : user ? (
          <Link href="/profile" className={`flex min-w-[60px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-normal transition-all duration-200 ${isActive("/profile") ? "text-[#25C95F]" : "text-slate-500 hover:text-[#25C95F]"}`}>
            {user.avatar ? (
              <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-r from-[#7AF3AE] to-[#25C95F]">
                <img src={user.avatar} alt={fallbackName} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] text-[11px] text-white">
                {initials}
              </div>
            )}
          </Link>
        ) : (
          <Link href="/login" className="flex min-w-[60px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-normal text-slate-500 transition-all hover:text-[#25C95F]">
            <LogIn className="h-5 w-5" strokeWidth={1.8} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}