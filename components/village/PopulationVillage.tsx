// components/village/PopulationVillage.tsx

"use client";

import React, { useId } from "react";
import { Users, Mars, Venus, Sparkles } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import CountUp from "react-countup";

interface PopulationVillageProps {
  male: number;
  female: number;
  year?: string;
}

interface LegendProps {
  color: string;
  text: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      percentage: number;
    };
  }>;
}

function calculateTotal(male: number, female: number): number {
  return male + female;
}

function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(1));
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl bg-slate-900/90 backdrop-blur-md px-4 py-3 text-white shadow-2xl border border-slate-700/80 text-xs animate-in fade-in zoom-in-95 duration-200">
        <p className="font-bold flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
          {data.name}
        </p>
        <p className="text-slate-200 font-semibold text-sm">
          <CountUp end={data.value} separator="." /> Jiwa ({data.payload.percentage}%)
        </p>
      </div>
    );
  }
  return null;
}

function Legend({ color, text }: LegendProps) {
  return (
    <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105 cursor-pointer">
      <div className={`w-3 h-3 rounded-full ${color} shadow-sm transition-all duration-300 hover:ring-4 hover:ring-emerald-200`} />
      <span className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
        {text}
      </span>
    </div>
  );
}

export default function PopulationVillage({ male, female }: PopulationVillageProps) {
  const total = calculateTotal(male, female);
  const malePercentage = calculatePercentage(male, total);
  const femalePercentage = calculatePercentage(female, total);

  const maleProgressId = useId();
  const femaleProgressId = useId();

  const chartData = [
    { name: "Laki-laki", value: male, percentage: malePercentage },
    { name: "Perempuan", value: female, percentage: femalePercentage },
  ];

  const COLORS = ["#2563eb", "#ec4899"];

  return (
    <div className="w-full mx-auto group/card">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-2xl shadow-green-950/5 transition-all duration-700 hover:shadow-green-950/20 hover:-translate-y-1">
        <style jsx>{`
          @keyframes morphBlob {
            0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
            33% { transform: translate(-20px, 15px) scale(1.15) rotate(120deg); }
            66% { transform: translate(15px, -15px) scale(0.9) rotate(240deg); }
          }
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(3deg); }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.08); }
          }
          @keyframes shimmerSlide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .blob-anim { animation: morphBlob 8s ease-in-out infinite; }
          .float-anim { animation: floatSlow 5s ease-in-out infinite; }
          .pulse-glow { animation: pulseGlow 4s ease-in-out infinite; }
          .shimmer-bg::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shimmerSlide 3s infinite;
          }
        `}</style>

        <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 px-8 py-7 overflow-hidden">
          <div className="absolute -right-12 -top-12 w-52 h-52 bg-white/25 rounded-full blur-3xl blob-anim pointer-events-none" />
          <div className="absolute left-1/4 -bottom-12 w-40 h-40 bg-teal-300/30 rounded-full blur-2xl blob-anim pointer-events-none" style={{ animationDelay: '3s' }} />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/20 backdrop-blur-md p-3.5 border border-white/40 shadow-xl float-anim transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-6">
                <Users className="h-6 w-6 text-white drop-shadow" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 drop-shadow-sm">
                  Data Penduduk
                  <Sparkles className="h-4 w-4 text-green-100 animate-pulse" />
                </h2>
                <p className="text-sm font-medium text-green-50 mt-0.5 tracking-wide">
                  Statistik demografi
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10 p-8 sm:p-10 relative">
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none pulse-glow" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-5 flex flex-col items-center justify-center transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative h-[240px] sm:h-[260px] w-full flex items-center justify-center">
                <div className="absolute inset-0 m-auto w-32 h-32 bg-emerald-100/60 rounded-full blur-2xl pointer-events-none pulse-glow" />

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5 transition-colors group-hover/card:text-slate-500">
                    Total Jiwa
                  </p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight transition-transform duration-300 group-hover/card:scale-105">
                    <CountUp end={total} separator="." duration={2.5} />
                  </p>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={8}
                      stroke="#ffffff"
                      strokeWidth={3}
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index]}
                          className="transition-all duration-500 hover:opacity-80 hover:scale-105 cursor-pointer origin-center"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center items-center gap-6 mt-3">
                <Legend color="bg-blue-600" text="Laki-laki" />
                <Legend color="bg-pink-500" text="Perempuan" />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-emerald-50/30 p-4 sm:p-5 flex items-center justify-between shadow-sm transition-all duration-500 hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-inner transition-transform duration-300 group-hover/card:rotate-6">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Total Penduduk Tercatat
                    </p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                      <CountUp end={total} separator="." duration={2.5} />
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold tracking-wider uppercase border border-emerald-100 shadow-inner">
                    Jiwa
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group/male relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 flex flex-col justify-between shadow-sm transition-all duration-500 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100/60 text-blue-600 shadow-inner transition-transform duration-300 group-hover/male:scale-110 group-hover/male:rotate-6">
                      <Mars className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 transition-colors group-hover/male:bg-blue-600 group-hover/male:text-white">
                      {malePercentage}%
                    </span>
                  </div>

                  <div>
                    <p className="text-xl font-black text-slate-900 tracking-tight">
                      <CountUp end={male} separator="." duration={2.5} />
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Laki-laki
                    </p>
                  </div>

                  <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      id={maleProgressId}
                      style={{ width: `${malePercentage}%` }}
                      className="h-full rounded-full transition-all duration-1000 bg-blue-600 group-hover/male:brightness-115"
                    />
                  </div>
                </div>

                <div className="group/female relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 flex flex-col justify-between shadow-sm transition-all duration-500 hover:shadow-lg hover:border-pink-200 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-100/60 text-pink-500 shadow-inner transition-transform duration-300 group-hover/female:scale-110 group-hover/female:rotate-6">
                      <Venus className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-500 transition-colors group-hover/female:bg-pink-500 group-hover/female:text-white">
                      {femalePercentage}%
                    </span>
                  </div>

                  <div>
                    <p className="text-xl font-black text-slate-900 tracking-tight">
                      <CountUp end={female} separator="." duration={2.5} />
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Perempuan
                    </p>
                  </div>

                  <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      id={femaleProgressId}
                      style={{ width: `${femalePercentage}%` }}
                      className="h-full rounded-full transition-all duration-1000 bg-pink-500 group-hover/female:brightness-115"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}