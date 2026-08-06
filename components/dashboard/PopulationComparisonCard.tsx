// components/dashboard/PopulationComparisonCard.tsx

"use client";

import React, { useState } from "react";
import { Users, TrendingUp, TrendingDown, FileText, Activity, Globe, PieChart, UserCheck } from "lucide-react";

interface PopulationData {
  total_population?: number;
  total_family_cards?: number;
  total_male?: number;
  total_female?: number;
}

interface PopulationComparisonProps {
  currentYear: number;
  previousYear: number;
  currentData?: PopulationData | null;
  previousData?: PopulationData | null;
  growth: {
    percentage: string;
    difference: number;
    is_increase: boolean;
  };
}

export function PopulationComparisonCard({
  currentYear,
  previousYear,
  currentData,
  previousData,
  growth,
}: PopulationComparisonProps) {
  const [hoveredGender, setHoveredGender] = useState<"male" | "female" | null>(null);

  const currPop = currentData?.total_population || 0;
  const currMale = currentData?.total_male || 0;
  const currFemale = currentData?.total_female || 0;
  const currKK = currentData?.total_family_cards || 0;
  const prevPop = previousData?.total_population || 0;

  const totalActive = currPop > 0 ? currPop : 1;
  const malePercent = Math.round((currMale / totalActive) * 100);
  const femalePercent = 100 - malePercent;

  const radius = 55;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 p-8 rounded-[2.5rem] border border-emerald-100 shadow-xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/30">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase">Total Populasi Aktif</span>
                  <p className="text-xs font-bold text-gray-400">Tahun Anggaran {currentYear}</p>
                </div>
              </div>

              <div className={`px-3.5 py-1.5 rounded-full border text-xs font-black tracking-wider flex items-center gap-1.5 shadow-2xs ${growth?.is_increase ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}`}>
                {growth?.is_increase ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>+{growth?.percentage} Naik</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-rose-600" />
                    <span>{growth?.percentage} Turun</span>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-2">
              <div className="sm:col-span-7 space-y-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tighter">
                    {currPop.toLocaleString("id-ID")}
                  </h3>
                  <span className="text-xl font-extrabold text-emerald-600 tracking-wide">Jiwa</span>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Akumulasi total seluruh warga desa tercatat aktif dalam sistem database kependudukan terintegrasi.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <button 
                    type="button"
                    onMouseEnter={() => setHoveredGender("male")}
                    onMouseLeave={() => setHoveredGender(null)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all flex items-center gap-1.5 ${hoveredGender === 'male' ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100'}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> L: {currMale.toLocaleString("id-ID")}
                  </button>
                  <button 
                    type="button"
                    onMouseEnter={() => setHoveredGender("female")}
                    onMouseLeave={() => setHoveredGender(null)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all flex items-center gap-1.5 ${hoveredGender === 'female' ? 'bg-rose-600 text-white shadow-md scale-105' : 'bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100'}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> P: {currFemale.toLocaleString("id-ID")}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 140 140">
                    <circle
                      cx="70" cy="70" r={radius} fill="transparent" stroke="#f43f5e" strokeWidth="14" strokeLinecap="round"
                      className={`transition-all duration-300 cursor-pointer ${hoveredGender === 'female' ? 'opacity-100 stroke-[18]' : hoveredGender === 'male' ? 'opacity-25' : 'opacity-90'}`}
                      onMouseEnter={() => setHoveredGender("female")}
                      onMouseLeave={() => setHoveredGender(null)}
                    />
                    <circle
                      cx="70" cy="70" r={radius} fill="transparent" stroke="#2563eb" strokeWidth="14"
                      strokeDasharray={circumference} strokeDashoffset={circumference - (malePercent / 100) * circumference} strokeLinecap="round"
                      className={`transition-all duration-700 ease-out cursor-pointer ${hoveredGender === 'male' ? 'opacity-100 stroke-[18]' : hoveredGender === 'female' ? 'opacity-25' : 'opacity-100'}`}
                      onMouseEnter={() => setHoveredGender("male")}
                      onMouseLeave={() => setHoveredGender(null)}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-1">
                    {hoveredGender === 'male' ? (
                      <div className="animate-in fade-in zoom-in duration-200">
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block">Laki-Laki</span>
                        <span className="text-xs font-black text-blue-700 block my-0.5">{malePercent}%</span>
                      </div>
                    ) : hoveredGender === 'female' ? (
                      <div className="animate-in fade-in zoom-in duration-200">
                        <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest block">Perempuan</span>
                        <span className="text-xs font-black text-rose-700 block my-0.5">{femalePercent}%</span>
                      </div>
                    ) : (
                      <div className="animate-in fade-in zoom-in duration-200">
                        <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block">Rasio Gender</span>
                        <span className="text-xs font-black text-gray-900 block my-0.5">{malePercent}% : {femalePercent}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-2">Sorot Grafik untuk Detail</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-emerald-100/80 space-y-4 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl text-white font-bold ${growth?.is_increase ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                  {growth?.is_increase ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500">Pertumbuhan dari {previousYear}</p>
                  <p className={`text-base font-black ${growth?.is_increase ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {growth?.percentage} ({growth?.is_increase ? '+' : ''}{growth?.difference.toLocaleString("id-ID")} Jiwa)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-gray-400 block">Data Pembanding</span>
                <span className="text-sm font-black text-gray-800">{prevPop.toLocaleString("id-ID")} Jiwa</span>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5 shadow-sm">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-xs text-gray-900 tracking-wide">
                  Analisis Pertumbuhan Kependudukan Desa {currentYear}
                </p>
                <p className="text-gray-500 text-xs font-medium leading-relaxed">
                  Statistik stabil dan tercatat valid berdasarkan rekapitulasi data penduduk terkini.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 grid grid-cols-1 gap-6">
          <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 p-7 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute right-0 bottom-0 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-blue-300 border border-white/10">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                Dukcapil Data
              </span>
            </div>

            <div className="my-4 relative z-10">
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-300">Total Kartu Keluarga (KK)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-4xl sm:text-5xl font-black tracking-tight">{currKK.toLocaleString("id-ID")}</h4>
                <span className="text-lg font-bold text-blue-300">Dokumen</span>
              </div>
            </div>

            <div className="text-xs font-medium text-blue-200/80 flex items-center gap-1.5 relative z-10">
              <Globe className="w-4 h-4 text-blue-400" /> Tersebar di seluruh wilayah administratif desa
            </div>
          </div>

          <div className="bg-white p-7 rounded-[2.5rem] border border-emerald-100 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-black uppercase tracking-wider text-gray-800">Komposisi Penduduk</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                Validasi Dukcapil
              </span>
            </div>

            <div className="space-y-3">
              <div 
                onMouseEnter={() => setHoveredGender("male")}
                onMouseLeave={() => setHoveredGender(null)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${hoveredGender === 'male' ? 'bg-blue-50 border-blue-200 shadow-md scale-[1.02]' : 'bg-gray-50/80 border-gray-100 hover:bg-gray-100/80'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 block">Laki-Laki</span>
                    <span className="text-xs font-bold text-gray-500">{malePercent}% dari total populasi</span>
                  </div>
                </div>
                <span className="text-base font-black text-gray-900">{currMale.toLocaleString("id-ID")} <span className="text-xs font-normal text-gray-500">Jiwa</span></span>
              </div>

              <div 
                onMouseEnter={() => setHoveredGender("female")}
                onMouseLeave={() => setHoveredGender(null)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${hoveredGender === 'female' ? 'bg-rose-50 border-rose-200 shadow-md scale-[1.02]' : 'bg-gray-50/80 border-gray-100 hover:bg-gray-100/80'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500 text-white rounded-xl shadow-sm">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 block">Perempuan</span>
                    <span className="text-xs font-bold text-gray-500">{femalePercent}% dari total populasi</span>
                  </div>
                </div>
                <span className="text-base font-black text-gray-900">{currFemale.toLocaleString("id-ID")} <span className="text-xs font-normal text-gray-500">Jiwa</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}