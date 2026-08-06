// components/services/HeroServices.tsx

"use client";

import { ArrowRight, Sparkles, PlayCircle } from "lucide-react";

export default function HeroServices() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-180px] top-[-120px] h-[420px] w-[420px] rounded-full bg-emerald-400/20 blur-[120px]" />
        <div className="absolute right-[-180px] top-20 h-[420px] w-[420px] rounded-full bg-sky-400/20 blur-[120px]" />
        <div className="absolute bottom-[-180px] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-300/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pb-20 pt-24 text-center lg:pt-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-xl">
          <Sparkles className="h-4 w-4" />
          Layanan Desa Digital
        </div>

        {/* Title */}
        <h1 className="mt-7 max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
          Semua
          <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-sky-500 bg-clip-text text-transparent"> Layanan Administrasi </span>
          Desa Dalam Satu Platform
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-500 md:text-lg">
          Nikmati pelayanan desa yang lebih cepat, transparan, dan modern. Mulai dari surat keterangan, bantuan sosial, hingga pengaduan masyarakat dapat dilakukan secara online tanpa antre panjang.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            Ajukan Layanan
            <ArrowRight className="h-4 w-4" />
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-8 py-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-emerald-300 hover:text-emerald-600">
            <PlayCircle className="h-5 w-5" />
            Panduan Layanan
          </button>
        </div>

        {/* Feature */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          <div className="rounded-2xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-xl">
            <p className="text-sm font-bold text-slate-900">💻 100% Online</p>
            <p className="mt-1 text-xs text-slate-500">Pengajuan lebih mudah</p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-xl">
            <p className="text-sm font-bold text-slate-900">⚡ Proses Cepat</p>
            <p className="mt-1 text-xs text-slate-500">Tanpa antre panjang</p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-xl">
            <p className="text-sm font-bold text-slate-900">🛡️ Transparan</p>
            <p className="mt-1 text-xs text-slate-500">Status dapat dipantau</p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-xl">
            <p className="text-sm font-bold text-slate-900">🆓 Gratis</p>
            <p className="mt-1 text-xs text-slate-500">Tanpa biaya layanan</p>
          </div>
        </div>
      </div>
    </section>
  );
}