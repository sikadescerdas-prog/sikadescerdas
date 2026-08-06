// components/village/PopulationHeader.tsx

"use client";

import { Users, Sparkles, CalendarDays, ChevronDown } from "lucide-react";

interface PopulationHeaderProps {
  population: any;
  previousPopulation: any;
  sortedPopulations: any[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

export default function PopulationHeader({
  population,
  previousPopulation,
  sortedPopulations,
  selectedYear,
  setSelectedYear,
}: PopulationHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-6 sm:p-10 shadow-2xl">
      <style jsx>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.12); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .float-anim { animation: floatSlow 5s ease-in-out infinite; }
        .pulse-glow { animation: pulseGlow 4s ease-in-out infinite; }
        .spin-slow { animation: spinSlow 30s linear infinite; }
      `}</style>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Orbs & Decorative Shapes */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/20 rounded-full blur-3xl pointer-events-none pulse-glow" />
      <div className="absolute left-1/3 -bottom-16 w-48 h-48 bg-emerald-300/25 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-32 h-32 border-2 border-dashed border-white/20 rounded-full spin-slow pointer-events-none hidden sm:block" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        
        {/* Left Side: Icon & Title */}
        <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="rounded-3xl bg-white/20 backdrop-blur-xl p-3.5 sm:p-4 border border-white/35 shadow-xl float-anim shrink-0 transition-transform duration-500 hover:scale-110 hover:rotate-6">
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow" />
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-2 drop-shadow-sm tracking-tight truncate">
              <span>Data Penduduk Desa</span>
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-200 animate-pulse shrink-0" />
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-emerald-100 text-xs sm:text-sm font-medium">
              <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/15">
                <CalendarDays className="w-3.5 h-3.5 text-white/90" />
                Tahun <strong className="text-white">{population.year}</strong>
              </span>

              {previousPopulation && (
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold shadow-sm">
                  vs Tahun {previousPopulation.year}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Year Selector Dropdown (Mobile Optimized) */}
        {sortedPopulations.length > 1 && (
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2.5 bg-white/15 backdrop-blur-xl p-2.5 sm:p-2 rounded-2xl border border-white/25 shadow-xl">
            <span className="text-xs font-bold text-white pl-2 uppercase tracking-wider">
              Pilih Tahun:
            </span>
            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                aria-label="Pilih Tahun Statistik Kependudukan"
                className="w-full sm:w-auto appearance-none rounded-xl bg-white px-4 py-2.5 sm:py-2 pr-10 font-bold text-emerald-800 text-sm outline-none shadow-lg cursor-pointer transition hover:bg-emerald-50 focus:ring-2 focus:ring-white"
              >
                {sortedPopulations.map((item) => (
                  <option key={item.id} value={item.year}>
                    Tahun {item.year}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-700">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}