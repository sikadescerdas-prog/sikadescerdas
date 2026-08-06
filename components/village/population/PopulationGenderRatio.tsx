// components/village/PopulationGenderRatio.tsx

"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Sparkles, TrendingUp, TrendingDown, Users, UserCheck, UserPlus } from "lucide-react";
import CountUp from "react-countup";

function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(1));
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0];
    const itemData = data.payload;

    return (
      <div className="rounded-2xl bg-slate-900/90 backdrop-blur-2xl px-4 py-3 text-white shadow-2xl border border-white/15 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-200">
        <p className="font-bold flex items-center gap-2 mb-1">
          <span className={`w-2.5 h-2.5 rounded-full ${itemData.name === "Laki-laki" ? "bg-blue-400 shadow-blue-500/50" : "bg-pink-400 shadow-pink-500/50"} shadow-md animate-pulse`} />
          <span className="text-slate-200">{itemData.name}</span>
        </p>
        <p className="font-extrabold text-sm tracking-wide">
          <CountUp end={data.value} separator="." /> <span className="font-normal text-slate-400 text-xs">Jiwa</span>
          {itemData.percentage !== undefined && <span className="ml-1.5 text-emerald-400">({itemData.percentage}%)</span>}
        </p>
      </div>
    );
  }
  return null;
}

export default function PopulationGenderRatio({
  population,
  previousPopulation,
}: {
  population: any;
  previousPopulation: any;
}) {
  const total = population.total_population || (population.total_male + population.total_female);
  const male = population.total_male;
  const female = population.total_female;
  const malePercentage = calculatePercentage(male, total);
  const femalePercentage = calculatePercentage(female, total);

  const prevTotal = previousPopulation 
    ? previousPopulation.total_population || (previousPopulation.total_male + previousPopulation.total_female) 
    : null;

  const prevMale = previousPopulation?.total_male;
  const prevFemale = previousPopulation?.total_female;

  const totalDiff = prevTotal !== null ? total - prevTotal : 0;
  const totalPctDiff = prevTotal && prevTotal > 0 ? Number(((totalDiff / prevTotal) * 100).toFixed(1)) : 0;

  const maleDiff = prevMale !== undefined ? male - prevMale : 0;
  const femaleDiff = prevFemale !== undefined ? female - prevFemale : 0;
  const malePctDiff = prevMale && prevMale > 0 ? Number(((maleDiff / prevMale) * 100).toFixed(1)) : 0;
  const femalePctDiff = prevFemale && prevFemale > 0 ? Number(((femaleDiff / prevFemale) * 100).toFixed(1)) : 0;

  const chartData = [
    { name: "Laki-laki", value: male, percentage: malePercentage },
    { name: "Perempuan", value: female, percentage: femalePercentage },
  ];

  const COLORS = ["#3b82f6", "#ec4899"];

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 sm:p-10 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
      {/* Background Decorative Gradients & Glows */}
      <div className="absolute -right-24 -top-24 w-80 h-80 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-pink-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-50/20 to-transparent pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Kolom Grafik Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative h-[270px] w-full flex items-center justify-center">
            
            {/* Center Info Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">
                Total Penduduk
              </span>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                <CountUp end={total} separator="." />
              </h4>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100/85 backdrop-blur-md text-slate-700 text-[11px] font-bold mt-1.5 border border-slate-200/60 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                {malePercentage}% : {femalePercentage}%
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={82}
                  outerRadius={108}
                  paddingAngle={8}
                  cornerRadius={8}
                  stroke="#ffffff"
                  strokeWidth={4}
                  label={false}
                  labelLine={false}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                      className="transition-all duration-300 hover:opacity-80 hover:scale-105 cursor-pointer origin-center"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Mini Legend Statistics Bar */}
          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/60 border border-blue-100/60 transition-all duration-300 hover:bg-blue-50 hover:scale-[1.02]">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/30 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-500 truncate">Laki-laki</p>
                <p className="text-xs font-black text-blue-700"><CountUp end={male} separator="." /> Jiwa</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-pink-50/60 border border-pink-100/60 transition-all duration-300 hover:bg-pink-50 hover:scale-[1.02]">
              <div className="w-3.5 h-3.5 rounded-full bg-pink-500 shadow-md shadow-pink-500/30 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-500 truncate">Perempuan</p>
                <p className="text-xs font-black text-pink-700"><CountUp end={female} separator="." /> Jiwa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Informasi & Komparasi */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100/80 mb-2.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin" /> Analisis Demografi Desa
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Komposisi Rasio Penduduk & Tren
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mt-1.5">
              Visualisasi proporsi gender secara komprehensif. Data diperbarui secara berkala untuk mendukung transparansi serta perencanaan pembangunan infrastruktur sosial desa.
            </p>
          </div>

          {previousPopulation && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Komparasi Total Penduduk */}
              <div className="group relative overflow-hidden p-4 rounded-3xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-200/70 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-2xl bg-emerald-100/80 text-emerald-600">
                    <UserPlus className="w-4 h-4" />
                  </span>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    totalDiff >= 0 ? "bg-emerald-100/80 text-emerald-700" : "bg-rose-100/80 text-rose-700"
                  }`}>
                    {totalDiff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{Math.abs(totalPctDiff)}%</span>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total (Th. Lalu)</p>
                <p className="text-base font-black text-slate-900 mt-0.5">
                  {prevTotal?.toLocaleString("id-ID")} <span className="text-[11px] font-semibold text-slate-500">Jiwa</span>
                </p>
              </div>

              {/* Komparasi Laki-laki */}
              <div className="group relative overflow-hidden p-4 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/70 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-2xl bg-blue-100/80 text-blue-600">
                    <Users className="w-4 h-4" />
                  </span>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    maleDiff >= 0 ? "bg-emerald-100/80 text-emerald-700" : "bg-rose-100/80 text-rose-700"
                  }`}>
                    {maleDiff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{Math.abs(malePctDiff)}%</span>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Laki-laki (Th. Lalu)</p>
                <p className="text-base font-black text-slate-900 mt-0.5">
                  {prevMale?.toLocaleString("id-ID")} <span className="text-[11px] font-semibold text-slate-500">Jiwa</span>
                </p>
              </div>

              {/* Komparasi Perempuan */}
              <div className="group relative overflow-hidden p-4 rounded-3xl bg-gradient-to-br from-slate-50 to-pink-50/40 border border-slate-200/70 shadow-sm transition-all duration-300 hover:border-pink-200 hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-2xl bg-pink-100/80 text-pink-600">
                    <UserCheck className="w-4 h-4" />
                  </span>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    femaleDiff >= 0 ? "bg-emerald-100/80 text-emerald-700" : "bg-rose-100/80 text-rose-700"
                  }`}>
                    {femaleDiff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{Math.abs(femalePctDiff)}%</span>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perempuan (Th. Lalu)</p>
                <p className="text-base font-black text-slate-900 mt-0.5">
                  {prevFemale?.toLocaleString("id-ID")} <span className="text-[11px] font-semibold text-slate-500">Jiwa</span>
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}