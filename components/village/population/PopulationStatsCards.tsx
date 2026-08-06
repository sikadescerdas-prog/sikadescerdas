// components/village/population/PopulationStatsCards.tsx

"use client";

import { useId, useEffect, useState } from "react";
import CountUp from "react-countup";
import { Users, UserRound, UserRoundCheck, Heart, TrendingUp, X, Calendar, Sparkles } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function calculatePercentage(value: number, total: number): number {
  if (!total || total === 0) return 0;
  return Number(((value / total) * 100).toFixed(1));
}

function StatCard({
  title, value, icon: Icon, badgeBg, badgeText, borderColorHover, glowBg,
  unit = "Jiwa", percentage, percentageBg, progressColor, progressId, delay = 0, onClick,
}: {
  title: string; value: number; icon: any; badgeBg: string; badgeText: string;
  borderColorHover: string; glowBg: string; unit?: string; percentage?: number;
  percentageBg?: string; progressColor?: string; progressId?: string; delay?: number; onClick?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (percentage !== undefined) setProgressWidth(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, percentage]);

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`group relative overflow-hidden rounded-[2.2rem] bg-white p-5 shadow-lg border border-slate-100/90 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2.5 hover:shadow-2xl ${borderColorHover} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} animate-card-entrance`}
    >
      <div className={`absolute -right-12 -bottom-12 w-36 h-36 ${glowBg} rounded-full blur-3xl transition-all duration-700 pointer-events-none group-hover:scale-150 group-hover:opacity-100 opacity-60 animate-pulse`} />
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform pointer-events-none" />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${badgeBg} ${badgeText} shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md`}>
          <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
        </div>
        {percentage !== undefined && (
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${percentageBg} shadow-sm transition-transform duration-300 group-hover:scale-105`}>
            {percentage}%
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
          {title}
        </p>
        <div className="flex items-baseline gap-1.5 mt-1.5">
          <p className="text-3xl font-extrabold text-slate-950 tracking-tight tabular-nums transition-transform duration-300 group-hover:translate-x-0.5">
            <CountUp end={value || 0} separator="." duration={2.5} />
          </p>
          <span className="text-xs text-slate-500 font-semibold">{unit}</span>
        </div>
      </div>

      {progressColor && progressId && (
        <div className="mt-3.5 w-full bg-slate-100/80 rounded-full h-2.5 overflow-hidden relative z-10 shadow-inner">
          <div id={progressId} style={{ width: `${progressWidth}%` }} className={`h-full rounded-full transition-all duration-1200 ease-out ${progressColor} shadow-sm`} />
        </div>
      )}

      <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-100 relative z-10">
        <span className="text-[11px] text-slate-400 group-hover:text-emerald-600 font-semibold transition-colors flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" /> Lihat tren 5 tahun
        </span>
        <span className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 text-xs font-bold">&rarr;</span>
      </div>
    </div>
  );
}

export default function PopulationStatsCards({
  population,
  populationHistory = [],
}: {
  population?: any;
  populationHistory?: Array<{
    year: number | string;
    total_population?: number;
    total_family_cards?: number;
    total_male?: number;
    total_female?: number;
  }>;
}) {
  const maleProgressId = useId();
  const femaleProgressId = useId();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeConfig, setActiveConfig] = useState({ title: "Total Penduduk", color: "#10b981" });

  const total = Number(population?.total_population || ((population?.total_male || 0) + (population?.total_female || 0)) || 0);
  const familyCards = Number(population?.total_family_cards || 0);
  const male = Number(population?.total_male || 0);
  const female = Number(population?.total_female || 0);

  const malePercentage = calculatePercentage(male, total);
  const femalePercentage = calculatePercentage(female, total);

  const activeYear = Number(population?.year) || new Date().getFullYear();
  let baseHistory = Array.isArray(populationHistory) ? [...populationHistory] : [];

  if (baseHistory.length === 0) {
    baseHistory = [{ year: activeYear, total_population: total, total_family_cards: familyCards, total_male: male, total_female: female }];
  }

  const chartData = baseHistory
    .sort((a, b) => Number(a.year) - Number(b.year))
    .slice(-5)
    .map((item) => ({
      year: String(item.year || ""),
      value: Number(item.total_population ?? 0),
      kk: Number(item.total_family_cards ?? 0),
      laki: Number(item.total_male ?? 0),
      perempuan: Number(item.total_female ?? 0),
    }));

  const handleCardClick = (title: string, color: string) => {
    setActiveConfig({ title, color });
    setIsModalOpen(true);
  };

  let dataKey = "value";
  if (activeConfig.title === "Kepala Keluarga") dataKey = "kk";
  if (activeConfig.title === "Penduduk Laki-laki") dataKey = "laki";
  if (activeConfig.title === "Penduduk Perempuan") dataKey = "perempuan";

  return (
    <>
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Penduduk" value={total} icon={Users} badgeBg="bg-emerald-100/80" badgeText="text-emerald-700" borderColorHover="hover:border-emerald-300" glowBg="bg-emerald-100/60" unit="Jiwa" delay={100} onClick={() => handleCardClick("Total Penduduk", "#10b981")} />
        <StatCard title="Kepala Keluarga" value={familyCards} icon={UserRoundCheck} badgeBg="bg-sky-100/80" badgeText="text-sky-700" borderColorHover="hover:border-sky-300" glowBg="bg-sky-100/60" unit="KK" delay={200} onClick={() => handleCardClick("Kepala Keluarga", "#0ea5e9")} />
        <StatCard title="Laki-laki" value={male} icon={UserRound} badgeBg="bg-blue-100/80" badgeText="text-blue-700" borderColorHover="hover:border-blue-300" glowBg="bg-blue-100/60" unit="Jiwa" percentage={malePercentage} percentageBg="bg-blue-50 text-blue-700 border border-blue-100" progressColor="bg-gradient-to-r from-blue-500 to-indigo-600" progressId={maleProgressId} delay={300} onClick={() => handleCardClick("Penduduk Laki-laki", "#3b82f6")} />
        <StatCard title="Perempuan" value={female} icon={Heart} badgeBg="bg-pink-100/80" badgeText="text-pink-600" borderColorHover="hover:border-pink-300" glowBg="bg-pink-100/60" unit="Jiwa" percentage={femalePercentage} percentageBg="bg-pink-50 text-pink-600 border border-pink-100" progressColor="bg-gradient-to-r from-pink-400 to-rose-500" progressId={femaleProgressId} delay={400} onClick={() => handleCardClick("Penduduk Perempuan", "#ec4899")} />
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-100 relative animate-modal-pop">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Tren 5 Tahun Terakhir ({activeYear - 4} - {activeYear})
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{activeConfig.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Grafik riwayat perkembangan penduduk
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all duration-300 hover:rotate-90">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} fontWeight={600} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis stroke="#94a3b8" fontSize={12} fontWeight={600} tickLine={false} axisLine={false} domain={['auto', 'auto']} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", padding: "12px 16px" }} formatter={(value: any) => [value !== undefined && value !== null ? `${Number(value).toLocaleString('id-ID')} Jiwa` : "0 Jiwa", activeConfig.title]} />
                  <Line type="monotone" dataKey={dataKey} name={activeConfig.title} stroke={activeConfig.color} strokeWidth={3} dot={{ r: 5, fill: activeConfig.color, strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 8, strokeWidth: 0 }} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full inline-block shadow-sm" style={{ backgroundColor: activeConfig.color }}></span>
                <span>Visualisasi tren historis 5 tahun</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Tutup Grafik
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-card-entrance {
          animation: cardEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-modal-pop {
          animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}