// components/home/LiteracySection.tsx
"use client";

import Link from "next/link";
import { BookOpen, LibraryBig, Newspaper, Smartphone, ArrowRight } from "lucide-react";

interface Props {
  total?: number | string;
  books?: number | string;
  articles?: number | string;
}

export default function LiteracySection({ total = 0, books = 0, articles = 0 }: Props) {
  function formatTotal(value: number | string) {
    if (typeof value === "string") return value;
    if (value >= 100000) return `${Math.floor(value / 1000)}rb+`;
    if (value >= 1000) return `${Math.floor(value / 1000)}rb+`;
    return value.toString();
  }

  const literacyData = [
    {
      title: "UMP BACA",
      subtitle: "Aplikasi Perpustakaan Digital",
      href: "https://play.google.com/store/apps/details?id=id.kubuku.kbk1986375&hl=id",
      icon: <Smartphone className="h-5 w-5 lg:h-7 lg:w-7" />,
      gradient: "from-emerald-400 via-green-500 to-teal-400",
      badge: "Gratis",
    },
    {
      title: "Smart Library",
      subtitle: "Koleksi Buku Digital",
      href: "/literasi",
      icon: <LibraryBig className="h-5 w-5 lg:h-7 lg:w-7" />,
      gradient: "from-violet-400 via-fuchsia-500 to-pink-400",
      badge: `${books} Buku`,
    },
    {
      title: "Edukasi Desa",
      subtitle: "Artikel & Pembelajaran",
      href: "/literasi?type",
      icon: <Newspaper className="h-5 w-5 lg:h-7 lg:w-7" />,
      gradient: "from-sky-400 via-blue-500 to-indigo-400",
      badge: `${articles} Artikel`,
    },
  ];

  return (
    <section className="h-full">
      <div className="relative h-full overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-yellow-100/60 p-5 shadow-xl">
        
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 text-white shadow-lg">
              <BookOpen className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Literasi Digital</h3>
              <p className="text-xs text-gray-500">Akses buku, aplikasi, dan edukasi desa</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/90 px-4 py-2 shadow-md backdrop-blur-md">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Total</span>
            <span className="text-sm font-extrabold text-emerald-600">{formatTotal(total)}</span>
          </div>
        </div>

        {/* MOBILE */}
        <div className="mt-5 flex flex-col gap-3 md:hidden">
          {literacyData.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative flex items-center gap-4 rounded-2xl border border-white/40 bg-white/70 p-4 shadow-md backdrop-blur-xl transition-all active:scale-[0.98]"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 blur-2xl transition group-hover:opacity-20`} />
              
              <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition group-hover:scale-110`}>
                {item.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">{item.badge}</span>
                </div>

                <p className="mt-1 text-xs text-gray-500">{item.subtitle}</p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Explore</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-900">
                    Buka
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* DESKTOP */}
        <div className="mt-7 hidden grid-cols-3 gap-4 md:grid">
          {literacyData.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-5 text-center shadow-md backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 blur-2xl transition duration-500 group-hover:opacity-20`} />

              <div className="absolute right-4 top-4 z-10">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm ${
                  item.title === "Smart Library"
                    ? "bg-violet-100 text-violet-700"
                    : item.title === "Edukasi Desa"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}>
                  {item.badge}
                </span>
              </div>

              <div className={`relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-xl transition duration-300 group-hover:scale-110`}>
                {item.icon}
              </div>

              <h4 className="mt-4 text-sm font-bold text-gray-900">{item.title}</h4>

              <p className="mt-2 text-[11px] leading-relaxed text-gray-500">{item.subtitle}</p>

              <div className="mt-5 flex items-center justify-center gap-1 text-xs font-medium text-gray-700 transition group-hover:text-gray-900">
                Explore
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Decorative Blur */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />

      </div>
    </section>
  );
}