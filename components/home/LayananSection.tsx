// components/home/LayananSection.tsx
"use client";

import Link from "next/link";
import { FileText, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { services } from "@/modules/services/data/services.data";

export default function LayananSection() {
  return (
    <section className="relative mt-6 xl:mt-8 overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-rose-100/70 p-5 shadow-2xl backdrop-blur-xl xl:p-6">
      
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-400 text-white shadow-lg"><FileText className="h-6 w-6 animate-pulse" /></div>
          <div>
            <div className="flex items-center gap-2"><h3 className="text-lg font-bold text-gray-900">Layanan Desa</h3><Sparkles className="h-4 w-4 text-red-500" /></div>
            <p className="text-xs text-gray-500">Pelayanan digital masyarakat</p>
          </div>
        </div>

        <Link href="/service" className="hidden items-center gap-1 text-sm font-semibold text-red-600 hover:underline md:flex">Semua <ArrowRight size={15} /></Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {services.slice(0, 6).map((service) => {
          const Icon = service.icon;
          return (
            <Link key={service.id} href={`/service`} className="group relative overflow-hidden rounded-2xl border border-white bg-white/80 p-3 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* ICON */}
              <div className={`relative mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-md transition duration-300 group-hover:scale-110`}>
                <Icon className="h-5 w-5" />
                <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-white"><CheckCircle2 className="h-3 w-3 text-emerald-500" /></div>
              </div>

              <h4 className="line-clamp-2 text-center text-xs font-bold text-gray-800">{service.title}</h4>

              <div className="mt-2 flex justify-center gap-1">
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-medium text-red-600">{service.duration}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* MOBILE BUTTON */}
      <Link href="/service" className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl md:hidden">
        Lihat Semua Layanan <ArrowRight size={16} />
      </Link>

      {/* GLOW */}
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-red-300/30 blur-3xl" />

    </section>
  );
}