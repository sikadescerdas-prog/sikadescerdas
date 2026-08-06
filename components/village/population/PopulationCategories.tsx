// components/village/PopulationCategories.tsx

"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Users, GraduationCap, Briefcase, ShieldCheck, Church, Baby, UserCheck, BarChart3, PieChart as PieChartIcon, TrendingUp, TrendingDown } from "lucide-react";
import CountUp from "react-countup";

interface CategoryData {
  name: string;
  total: number;
  prevTotal?: number;
  diff?: number;
  percentageDiff?: number;
  percentage?: number;
}

function getCategoryIcon(name: string) {
  const icons: Record<string, any> = {
    Pendidikan: GraduationCap,
    Pekerjaan: Briefcase,
    Agama: Church,
    Disabilitas: ShieldCheck,
    "Kelompok Umur": Baby,
    "Status Perkawinan": UserCheck,
  };
  return icons[name] ?? Users;
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0];
    const itemData = data.payload;

    return (
      <div className="rounded-2xl bg-slate-900/95 backdrop-blur-xl px-4 py-3 text-white shadow-2xl border border-white/15 text-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
        <p className="font-bold flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50 animate-pulse" />
          <span className="text-slate-200">{itemData.name || data.name}</span>
        </p>
        <p className="font-extrabold text-sm tracking-wide">
          <CountUp end={data.value} separator="." /> <span className="font-normal text-slate-400 text-xs">Jiwa</span>
          {itemData.percentage !== undefined && <span className="ml-1.5 text-emerald-400">({itemData.percentage}%)</span>}
        </p>
        {itemData.prevTotal !== undefined && (
          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Tahun Lalu:</span>
            <span className="font-semibold text-slate-200">{itemData.prevTotal.toLocaleString("id-ID")} Jiwa</span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function PopulationCategories({
  categories,
  selectedCategory,
  setSelectedCategory,
  chartMode,
  toggleChartMode,
}: {
  categories: Record<string, CategoryData[]>;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  chartMode: Record<string, "bar" | "pie">;
  toggleChartMode: (name: string) => void;
}) {
  const categoryList = ["Semua", ...Object.keys(categories)];
  const filteredCategories = Object.entries(categories).filter(([name]) => selectedCategory === "Semua" || name === selectedCategory);
  const CATEGORY_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4", "#14b8a6", "#6366f1"];

  return (
    <section className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5 group">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kategori & Grafik Penduduk</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Eksplorasi data demografi dan perbandingan tren komprehensif</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs Interaktif dengan Efek Smooth Sliding */}
      <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {categoryList.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-2xl px-5 py-2.5 text-xs font-bold transition-all duration-300 shadow-sm active:scale-95 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105 ring-2 ring-emerald-600/20"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:bg-emerald-50/60 hover:border-emerald-200 hover:text-emerald-700"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Daftar Kategori Section */}
      <div className="grid grid-cols-1 gap-8">
        {filteredCategories.map(([name, items], index) => {
          const Icon = getCategoryIcon(name);
          const isPie = chartMode[name] === "pie";

          return (
            <div
              key={name}
              style={{ animationDelay: `${index * 100}ms` }}
              className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col justify-between group/card"
            >
              {/* Animated Background Glow */}
              <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover/card:scale-125" />

              <div className="relative z-10">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="rounded-2xl bg-emerald-50 p-3.5 text-emerald-600 border border-emerald-100 shadow-inner transition-transform duration-300 group-hover/card:-translate-y-1">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{name}</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">{(items as CategoryData[]).length} Sub-kategori terdaftar</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleChartMode(name)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold transition-all duration-300 border border-slate-200/80 shadow-sm active:scale-95 group/btn"
                  >
                    {isPie ? (
                      <BarChart3 className="w-4 h-4 text-emerald-600 transition-transform group-hover/btn:scale-110" />
                    ) : (
                      <PieChartIcon className="w-4 h-4 text-emerald-600 transition-transform group-hover/btn:rotate-45" />
                    )}
                    <span>{isPie ? "Tampilkan Bar Chart" : "Tampilkan Pie Chart"}</span>
                  </button>
                </div>

                {/* Container Chart */}
                <div className="h-[280px] sm:h-[320px] w-full bg-slate-50/60 rounded-3xl p-6 border border-slate-100/80 mb-6 flex items-center justify-center shadow-inner transition-colors duration-300 hover:bg-slate-50">
                  <ResponsiveContainer width="100%" height="100%">
                    {isPie ? (
                      <PieChart>
                        <Pie
                          data={items}
                          dataKey="total"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={95}
                          innerRadius={45}
                          paddingAngle={6}
                          cornerRadius={6}
                          stroke="#ffffff"
                          strokeWidth={3}
                          label={(entry: any) => `${entry.name} (${entry.percentage ?? 0}%)`}
                          labelLine={true}
                        >
                          {(items as CategoryData[]).map((_, cellIndex) => (
                            <Cell
                              key={`cat-cell-${cellIndex}`}
                              fill={CATEGORY_COLORS[cellIndex % CATEGORY_COLORS.length]}
                              className="transition-all duration-300 hover:opacity-80 hover:scale-105 cursor-pointer origin-center"
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    ) : (
                      <BarChart data={items} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                          stroke="#cbd5e1"
                          interval={0}
                          angle={-20}
                          textAnchor="end"
                          height={45}
                        />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="total" fill="#10b981" radius={[8, 8, 0, 0]} animationDuration={1200} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Sub-kategori List Modern */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {(items as CategoryData[]).map((item) => {
                    const hasDiff = item.percentageDiff !== undefined && item.percentageDiff !== 0;
                    const diffVal = item.percentageDiff ?? 0;
                    const isPositive = diffVal > 0;
                    const isNegative = diffVal < 0;

                    return (
                      <div
                        key={item.name}
                        className="group flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-50/90 to-slate-100/40 p-4 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-3 pr-4 overflow-hidden">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-sm group-hover:scale-125 transition-transform" />
                          <div className="overflow-hidden">
                            <span className="text-sm font-bold text-slate-800 block truncate group-hover:text-emerald-900 transition-colors" title={item.name}>
                              {item.name}
                            </span>
                            <span className="text-xs text-slate-400 font-medium block">
                              Tahun lalu: <strong className="text-slate-600">{item.prevTotal !== undefined ? `${item.prevTotal.toLocaleString("id-ID")} jiwa` : "-"}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {hasDiff && (
                            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold transition-transform group-hover:scale-105 ${
                              isPositive ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200" : "bg-rose-100/80 text-rose-700 border border-rose-200"
                            }`}>
                              {isPositive && <TrendingUp className="w-3.5 h-3.5 mr-0.5" />}
                              {isNegative && <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                              <span>{Math.abs(diffVal)}%</span>
                            </div>
                          )}
                          <div className="text-right">
                            <span className="text-base font-black text-slate-900 tracking-tight block">
                              <CountUp end={item.total} separator="." duration={1.5} /> <span className="text-xs font-normal text-slate-500">Jiwa</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}