// components/store/HeaderStore.tsx

"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";

interface HeaderStoreProps { location?: string; }

export default function HeaderStore({ location = "Indonesia" }: HeaderStoreProps) {
  return (
    <section className="group relative h-[300px] overflow-hidden rounded-b-3xl border border-emerald-100 bg-emerald-50 sm:h-[440px]">
      {/* BACKGROUND IMAGE */}
      <Image src="/img/marketplace.jpeg" alt="Marketplace Desa" fill className="absolute inset-0 animate-[backgroundMove_18s_ease-in-out_infinite]" unoptimized />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-100/50 via-white/20 to-white/10" />

      {/* AURORA */}
      <div className="absolute -left-40 -top-40 h-[400px] w-[400px] animate-[auroraOne_12s_ease-in-out_infinite] rounded-full bg-green-300/30 blur-3xl" />
      <div className="absolute -right-40 -top-20 h-[420px] w-[420px] animate-[auroraTwo_14s_ease-in-out_infinite] rounded-full bg-emerald-300/30 blur-3xl" />

      {/* LIGHT */}
      <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/3 skew-x-[-20deg] animate-[shine_10s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      {/* CONTENT */}
      <div className="relative z-10 px-5 pt-8 sm:px-8 lg:px-12">
        <div className="inline-flex animate-[fadeDown_.8s_ease-out_both] items-center gap-2.5 rounded-full border border-emerald-200/80 bg-white/80 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-[0_10px_30px_rgba(16,185,129,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1">
          <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 bg-clip-text text-transparent">Marketplace Desa</span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        </div>
      </div>

      {/* BOTTOM ACCENT */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-300 via-emerald-500 to-green-400" />

      <style jsx>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes auroraOne {
          50% { transform: translate(40px, 30px) scale(1.1); }
        }
        @keyframes auroraTwo {
          50% { transform: translate(-40px, 20px) scale(1.1); }
        }
        @keyframes shine {
          0%, 55% { left: -50%; }
          75%, 100% { left: 130%; }
        }
      `}</style>
    </section>
  );
}