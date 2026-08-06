// components/literature/HeaderLiterature.tsx

"use client";

import { ArrowUpRight, BookMarked, BookOpen, Library, Sparkles, Star, TrendingUp, Users, Zap } from "lucide-react";
import React from "react";

export default function HeaderLiterature() {
  return (
    <section className="group relative overflow-hidden rounded-b-3xl border border-green-100 bg-gradient-to-br from-white via-green-50/80 to-emerald-100/70 min-h-[520px] sm:min-h-[430px] lg:h-[370px]">
      {/* IMAGE */}
      <img
        src="/img/literasi.png"
        alt="Ruang Literasi"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.05] transition-transform duration-[12000ms] ease-out group-hover:scale-110"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-green-50/40" />

      {/* AURORA */}
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-green-200/40 blur-3xl animate-[auroraOne_12s_ease-in-out_infinite] sm:h-[500px] sm:w-[500px]" />
      <div className="absolute -right-32 top-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl animate-[auroraTwo_14s_ease-in-out_infinite] sm:h-[480px] sm:w-[480px]" />

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.035] animate-[gridMove_24s_linear_infinite]"
        style={{
          backgroundImage: "linear-gradient(#16a34a 1px, transparent 1px), linear-gradient(90deg, #16a34a 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-[520px] items-center sm:min-h-[430px] lg:h-full">
        <div className="w-full px-5 sm:px-8 lg:px-12">
          <div className="max-w-xl">
            {/* BADGE */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-4 py-2 text-xs font-bold text-emerald-600 shadow-sm backdrop-blur animate-[fadeDown_700ms_ease-out_both]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white">
                <Sparkles className="h-3 w-3" />
              </span>
              Ruang Literasi Desa
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              <span className="flex items-center gap-1 text-gray-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Aktif
              </span>
            </div>

            {/* TITLE */}
            <h1 className="animate-[fadeUp_800ms_ease-out_both] text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Jelajahi, <br />
              <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                Baca & Berkembang.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-[15px]">
              Temukan artikel dan buku pilihan untuk memperluas wawasan, mendapatkan inspirasi, dan menemukan bacaan sesuai kebutuhanmu.
            </p>

            {/* STATS */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
              <Stat icon={<BookOpen />} title="Koleksi" value="Buku & Artikel" />
              <Stat icon={<TrendingUp />} title="Aktivitas" value="Terus Bertumbuh" />
              <Stat icon={<Zap />} title="Akses" value="Mudah & Gratis" />
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP LIBRARY CARD */}
      <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 xl:block">
        <div className="absolute inset-[-40px] rounded-full bg-emerald-300/20 blur-3xl animate-[glowPulse_5s_ease-in-out_infinite]" />

        <div className="relative h-[220px] w-[270px] rounded-[2rem] border border-white/80 bg-white/70 p-4 shadow-[0_30px_80px_rgba(22,163,74,.15)] backdrop-blur-xl animate-[cardFloat_7s_ease-in-out_infinite]">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg">
                <Library className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] font-bold tracking-widest text-gray-400">DIGITAL LIBRARY</p>
                <p className="text-xs font-bold text-gray-800">Koleksi Literasi</p>
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          {/* BOOK PREVIEW */}
          <div className="mt-5 flex gap-3">
            <div className="relative h-24 w-16 overflow-hidden rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 shadow-lg">
              <div className="absolute left-3 right-3 top-5 h-2 rounded-full bg-green-500/30" />
              <div className="absolute bottom-3 left-3 flex h-7 w-7 items-center justify-center rounded-lg bg-white/60">
                <BookMarked className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <div className="h-2.5 w-32 rounded-full bg-gray-200" />
              <div className="mt-3 h-2 w-24 rounded-full bg-gray-100" />
              <div className="mt-4 flex items-center gap-1">
                {[1, 2, 3, 4].map((item) => (
                  <Star key={item} className="h-3 w-3 fill-green-400 text-green-400" />
                ))}
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="mt-5 rounded-xl border border-green-100 bg-green-50/60 p-3">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-500">Reading progress</span>
              <span className="font-bold text-green-600">72%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-green-100">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-green-400 to-emerald-600 animate-[progressGrow_2s_ease-out]" />
            </div>
          </div>
        </div>

        {/* FLOAT CARD */}
        <div className="absolute -bottom-6 -left-10 flex items-center gap-2 rounded-2xl border border-white bg-white/90 px-3 py-2 shadow-xl backdrop-blur animate-[miniFloat_5s_ease-in-out_infinite]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
            <Users className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-[9px] text-gray-400">PEMBACA</p>
            <p className="text-[10px] font-bold text-gray-700">Aktif membaca</p>
          </div>
        </div>
      </div>

      {/* BOTTOM LINE */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-300 via-green-500 to-emerald-400" />

      {/* ANIMATION STYLES */}
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0) rotate(1deg); }
          50% { transform: translateY(-12px) rotate(-1deg); }
        }
        @keyframes miniFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes auroraOne {
          50% { transform: translate(40px, 30px) scale(1.1); }
        }
        @keyframes auroraTwo {
          50% { transform: translate(-40px, 20px) scale(1.1); }
        }
        @keyframes glowPulse {
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 36px 36px; }
        }
        @keyframes progressGrow {
          from { width: 0; }
          to { width: 72%; }
        }
      `}</style>
    </section>
  );
}

interface StatProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function Stat({ icon, title, value }: StatProps) {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-white bg-white/80 px-3 py-2 shadow-sm backdrop-blur sm:w-auto">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50 text-green-600">
        {icon}
      </div>
      <div>
        <p className="text-[9px] uppercase tracking-widest text-gray-400">{title}</p>
        <p className="text-xs font-bold text-gray-700">{value}</p>
      </div>
    </div>
  );
}