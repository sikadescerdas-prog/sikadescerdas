// components/dashboard/ListCard.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowUpRight, Sparkles } from "lucide-react";

interface ListItem {
  id: string | number;
  title?: string;
  name?: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  rightText?: string;
}

interface ListCardProps {
  title: string;
  icon: string;
  viewAllHref: string;
  items: ListItem[];
  emptyMessage: string;
  variant?: "emerald" | "blue" | "amber" | "purple" | "indigo" | "rose";
}

const themeStyles = {
  emerald: {
    border: "border-emerald-100 hover:border-emerald-400/50",
    bgCard: "bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/10",
    glow: "bg-gradient-to-br from-emerald-500/10 via-teal-400/20 to-transparent",
    iconBox: "bg-emerald-600 text-white shadow-emerald-600/30",
    badge: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
    hoverItem: "hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-teal-50/50 hover:border-emerald-300",
    hoverText: "group-hover/item:text-emerald-700",
    hoverBgIcon: "group-hover/item:bg-emerald-600",
    tagColor: "text-emerald-800 bg-emerald-100/80 border-emerald-200",
    accentLine: "bg-emerald-500",
    btnColor: "text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border-emerald-100",
    subtleLabel: "text-emerald-700"
  },
  blue: {
    border: "border-blue-100 hover:border-blue-400/50",
    bgCard: "bg-gradient-to-br from-white via-blue-50/20 to-sky-50/10",
    glow: "bg-gradient-to-br from-blue-500/10 via-sky-400/20 to-transparent",
    iconBox: "bg-blue-600 text-white shadow-blue-600/30",
    badge: "text-blue-700 bg-blue-50 border-blue-200/80",
    hoverItem: "hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-sky-50/50 hover:border-blue-300",
    hoverText: "group-hover/item:text-blue-700",
    hoverBgIcon: "group-hover/item:bg-blue-600",
    tagColor: "text-blue-800 bg-blue-100/80 border-blue-200",
    accentLine: "bg-blue-500",
    btnColor: "text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 border-blue-100",
    subtleLabel: "text-blue-700"
  },
  amber: {
    border: "border-amber-100 hover:border-amber-400/50",
    bgCard: "bg-gradient-to-br from-white via-amber-50/20 to-yellow-50/10",
    glow: "bg-gradient-to-br from-amber-500/10 via-yellow-400/20 to-transparent",
    iconBox: "bg-amber-600 text-white shadow-amber-600/30",
    badge: "text-amber-700 bg-amber-50 border-amber-200/80",
    hoverItem: "hover:bg-gradient-to-r hover:from-amber-50/80 hover:to-yellow-50/50 hover:border-amber-300",
    hoverText: "group-hover/item:text-amber-700",
    hoverBgIcon: "group-hover/item:bg-amber-600",
    tagColor: "text-amber-800 bg-amber-100/80 border-amber-200",
    accentLine: "bg-amber-500",
    btnColor: "text-amber-700 hover:text-white bg-amber-50 hover:bg-amber-600 border-amber-100",
    subtleLabel: "text-amber-700"
  },
  purple: {
    border: "border-purple-100 hover:border-purple-400/50",
    bgCard: "bg-gradient-to-br from-white via-purple-50/20 to-fuchsia-50/10",
    glow: "bg-gradient-to-br from-purple-500/10 via-fuchsia-400/20 to-transparent",
    iconBox: "bg-purple-600 text-white shadow-purple-600/30",
    badge: "text-purple-700 bg-purple-50 border-purple-200/80",
    hoverItem: "hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-fuchsia-50/50 hover:border-purple-300",
    hoverText: "group-hover/item:text-purple-700",
    hoverBgIcon: "group-hover/item:bg-purple-600",
    tagColor: "text-purple-800 bg-purple-100/80 border-purple-200",
    accentLine: "bg-purple-500",
    btnColor: "text-purple-700 hover:text-white bg-purple-50 hover:bg-purple-600 border-purple-100",
    subtleLabel: "text-purple-700"
  },
  indigo: {
    border: "border-indigo-100 hover:border-indigo-400/50",
    bgCard: "bg-gradient-to-br from-white via-indigo-50/20 to-violet-50/10",
    glow: "bg-gradient-to-br from-indigo-500/10 via-violet-400/20 to-transparent",
    iconBox: "bg-indigo-600 text-white shadow-indigo-600/30",
    badge: "text-indigo-700 bg-indigo-50 border-indigo-200/80",
    hoverItem: "hover:bg-gradient-to-r hover:from-indigo-50/80 hover:to-violet-50/50 hover:border-indigo-300",
    hoverText: "group-hover/item:text-indigo-700",
    hoverBgIcon: "group-hover/item:bg-indigo-600",
    tagColor: "text-indigo-800 bg-indigo-100/80 border-indigo-200",
    accentLine: "bg-indigo-500",
    btnColor: "text-indigo-700 hover:text-white bg-indigo-50 hover:bg-indigo-600 border-indigo-100",
    subtleLabel: "text-indigo-700"
  },
  rose: {
    border: "border-rose-100 hover:border-rose-400/50",
    bgCard: "bg-gradient-to-br from-white via-rose-50/20 to-pink-50/10",
    glow: "bg-gradient-to-br from-rose-500/10 via-pink-400/20 to-transparent",
    iconBox: "bg-rose-600 text-white shadow-rose-600/30",
    badge: "text-rose-700 bg-rose-50 border-rose-200/80",
    hoverItem: "hover:bg-gradient-to-r hover:from-rose-50/80 hover:to-pink-50/50 hover:border-rose-300",
    hoverText: "group-hover/item:text-rose-700",
    hoverBgIcon: "group-hover/item:bg-rose-600",
    tagColor: "text-rose-800 bg-rose-100/80 border-rose-200",
    accentLine: "bg-rose-500",
    btnColor: "text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border-rose-100",
    subtleLabel: "text-rose-700"
  }
};

export function ListCard({
  title,
  icon,
  viewAllHref,
  items,
  emptyMessage,
  variant = "emerald",
}: ListCardProps) {
  const currentTheme = themeStyles[variant] || themeStyles.emerald;

  const getBadgeType = (name: string = "", cardTitle: string = "") => {
    if (!cardTitle.toLowerCase().includes("pendidikan") && !cardTitle.toLowerCase().includes("fasilitas")) {
      return null;
    }

    const lower = name.toLowerCase();
    if (/\bsd\b/.test(lower) || lower.includes("sdn") || lower.includes("sekolah dasar")) return "SD";
    if (/\bsmp\b/.test(lower) || lower.includes("smpn") || lower.includes("menengah pertama")) return "SMP";
    if (/\bsma\b/.test(lower) || /\bsmk\b/.test(lower) || lower.includes("man ") || lower.includes("atas")) return "SMA/SMK";
    if (/\btk\b/.test(lower) || lower.includes("paud") || lower.includes("ra ")) return "PAUD/TK";
    if (lower.includes("masjid") || lower.includes("musala") || lower.includes("gereja")) return "Religi";
    if (lower.includes("posyandu") || lower.includes("klinik") || lower.includes("puskesmas")) return "Kesehatan";
    return null;
  };

  return (
    <div className={`group/card relative overflow-hidden ${currentTheme.bgCard} backdrop-blur-2xl p-7 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 border ${currentTheme.border} flex flex-col justify-between`}>
      <div className={`absolute -right-12 -top-12 w-40 h-40 ${currentTheme.glow} rounded-full blur-3xl pointer-events-none group-hover/card:scale-175 group-hover/card:rotate-45 transition-all duration-700 opacity-60`}></div>
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 ${currentTheme.iconBox} rounded-2xl shadow-lg group-hover/card:rotate-6 group-hover/card:scale-110 transition-all duration-300 flex items-center justify-center text-base`}>
              {icon}
            </div>
            <div>
              <span className={`text-[10px] font-black tracking-widest ${currentTheme.subtleLabel} uppercase block`}>Direktori & Data</span>
              <h3 className="font-black text-lg text-gray-900 tracking-tight">{title}</h3>
            </div>
          </div>

          <Link
            href={viewAllHref}
            className={`group/link text-xs flex items-center font-extrabold transition-all duration-300 px-3.5 py-2 rounded-xl border shadow-xs ${currentTheme.btnColor}`}
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ul className="space-y-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
          {items.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <Sparkles className="w-5 h-5 text-gray-300 mx-auto animate-pulse" />
              <p className="text-xs text-gray-400 font-semibold">{emptyMessage}</p>
            </div>
          ) : (
            items.map((item) => {
              const displayName = item.name || item.title || "";
              const detectedBadge = getBadgeType(displayName, title);

              return (
                <Link
                  key={item.id}
                  href={viewAllHref}
                  className={`group/item relative overflow-hidden p-4 bg-white/90 ${currentTheme.hoverItem} transition-all duration-300 rounded-2xl flex justify-between items-center border border-gray-100 shadow-xs hover:shadow-md active:scale-[0.99] gap-3`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${currentTheme.accentLine} opacity-0 group-hover/item:opacity-100 transition-opacity`}></div>

                  <div className="min-w-0 flex-1 space-y-0.5 pl-1.5">
                    <p className={`font-bold text-gray-800 text-xs line-clamp-1 ${currentTheme.hoverText} transition-colors flex items-center gap-1.5`}>
                      {displayName}
                    </p>
                    {(item.subtitle || item.description) && (
                      <p className="text-[11px] text-gray-500 line-clamp-1 font-medium">
                        {item.subtitle || item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {detectedBadge && (
                      <span className={`text-[10px] font-black ${currentTheme.badge} border px-2.5 py-1 rounded-xl shadow-2xs uppercase tracking-wider`}>
                        {detectedBadge}
                      </span>
                    )}

                    {item.badgeText && !detectedBadge && (
                      <span className={`text-[10px] font-black ${currentTheme.badge} border px-2.5 py-1 rounded-xl shadow-2xs uppercase tracking-wider`}>
                        {item.badgeText}
                      </span>
                    )}

                    {item.rightText && (
                      <span className={`text-xs sm:text-sm font-black ${currentTheme.tagColor} px-3.5 py-1.5 rounded-xl border shadow-2xs whitespace-nowrap`}>
                        {item.rightText}
                      </span>
                    )}

                    <div className={`w-7 h-7 rounded-xl bg-gray-50 ${currentTheme.hoverBgIcon} group-hover/item:text-white flex items-center justify-center transition-all shadow-2xs border border-gray-100 group-hover/item:border-transparent text-gray-400`}>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}