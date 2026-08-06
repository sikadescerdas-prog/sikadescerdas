// components/layout/PublicLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import NavBottom from "@/components/NavBottom";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  // 1. Navbar tidak muncul di halaman tertentu
  const hideNavbar = 
    pathname.startsWith("/login") || 
    pathname.startsWith("/register") || 
    pathname.startsWith("/profile") || 
    pathname.startsWith("/settings");

  // 2. Footer tidak muncul di halaman tertentu
  const hideFooter = 
    pathname.startsWith("/login") || 
    pathname.startsWith("/register") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings");

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}

      {/* Padding pt-16 hanya diberikan jika Navbar muncul */}
      <main className={`flex-1 ${!hideNavbar ? "pt-16" : "pt-0"}`}>
        {children}
      </main>

      {!hideFooter && <Footer />}
      <NavBottom />
    </div>
  );
}