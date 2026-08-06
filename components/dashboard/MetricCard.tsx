// components/dashboard/MetricCard.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  gradientBg: string;
  hoverBgColor: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  href,
  gradientBg,
  hoverBgColor,
}: MetricCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden bg-gradient-to-b from-white/95 via-white/90 to-gray-50/40 backdrop-blur-2xl p-6 rounded-[2.2rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-gray-100/80 hover:border-blue-400/50 flex flex-col justify-between active:scale-[0.97]"
    >
      <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${gradientBg} rounded-full blur-3xl pointer-events-none group-hover:scale-175 group-hover:rotate-45 transition-all duration-700 opacity-40 group-hover:opacity-90`}></div>

      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className={`p-3.5 rounded-2xl bg-gray-50/90 text-gray-700 transition-all duration-500 border border-gray-100/90 ${hoverBgColor} group-hover:text-white group-hover:border-transparent shadow-xs group-hover:rotate-6 group-hover:scale-110`}>
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
            className: "w-5 h-5 transition-colors text-inherit group-hover:text-white",
          })}
        </div>

        <div className="w-9 h-9 rounded-full bg-white/80 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs border border-gray-100/90 group-hover:border-transparent text-gray-400">
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      <div className="relative z-10 space-y-1.5">
        <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
          {title}
        </p>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight group-hover:scale-[1.02] origin-left transition-transform duration-300">
          {value.toLocaleString("id-ID")}
        </h3>
        <div className="pt-1.5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="text-[11px] font-semibold text-gray-500 tracking-wide">
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
}