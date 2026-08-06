// app/dashboard/layout.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSlim, setIsSlim] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("sidebar-slim");
    if (saved === "true") {
      setIsSlim(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSlim(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = () => {
    const value = !isSlim;
    setIsSlim(value);
    localStorage.setItem("sidebar-slim", String(value));
  };

  if (!isMounted) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="hidden w-60 border-r border-gray-200 bg-white lg:block" />
        <div className="flex-1 bg-gray-50" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden lg:block">
        <Sidebar
          isSlim={isSlim}
          onToggle={handleToggle}
          variant="desktop"
        />
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="h-full w-60 bg-white shadow-xl">
            <Sidebar
              isSlim={false}
              variant="mobile"
              onToggle={() => setIsMobileOpen(false)}
            />
          </div>

          <div
            className="flex-1 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Tutup menu overlay"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onOpenMobileSidebar={() => setIsMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}