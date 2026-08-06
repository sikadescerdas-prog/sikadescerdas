// components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "./navbar/Logo";
import NavList from "./navbar/NavList";
import MobileMenu from "./navbar/MobileMenu";
import UserMenu from "./navbar/UserMenu";
import NavbarAdd from "./navbar/NavAdd";
import NavLogin from "./navbar/NavLogin";
import NavSearch from "./navbar/NavSearch";

interface User {
  fullname?: string;
  username?: string;
  email?: string;
  avatar?: string;
  role?: string;
  hasStore?: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User>();
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isProductDetail = /^\/store\/[^/]+\/[^/]+$/.test(pathname);
  const searchAllowedRoutes = ["/store", "/news", "/literature", "/literasi"];
  const showSearch = searchAllowedRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        setUser({
          fullname: data.user?.fullname,
          username: data.user?.username,
          email: data.user?.email,
          avatar: data.user?.avatar,
          role: data.user?.role,
          hasStore: !!data.user?.store,
        });
      } catch (error) {
        console.error("Fetch user error:", error);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm" />
        <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 shrink-0">
            <button type="button" onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition" aria-label="Buka menu">
              <Menu className="w-6 h-6" />
            </button>
            <Logo />
          </div>
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <NavList />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {!isProductDetail && (
              <>
                <NavbarAdd user={user} />
                {showSearch && <NavSearch />}
              </>
            )}
            <div className="hidden md:flex">
              {loadingUser ? (
                <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-200" />
              ) : user ? (
                <UserMenu user={user} loading={loadingUser} onLogout={handleLogout} />
              ) : (
                <NavLogin />
              )}
            </div>
          </div>
        </nav>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}