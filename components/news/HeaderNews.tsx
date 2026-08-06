// components/news/HeaderNews.tsx

"use client";

import { ArrowUpRight, CalendarDays, Megaphone, Newspaper, Sparkles, Users } from "lucide-react";

export default function HeaderNews() {
  return (
    <section className="group relative h-[340px] overflow-hidden rounded-b-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/70 to-green-100/70 sm:h-[390px]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-emerald-50/60" />

      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "linear-gradient(#16a34a 1px,transparent 1px),linear-gradient(90deg,#16a34a 1px,transparent 1px)", backgroundSize: "38px 38px" }} />

      {/* GLOW */}
      <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-green-300/35 blur-3xl animate-pulse" />
      <div className="absolute -right-40 bottom-[-150px] h-[450px] w-[450px] rounded-full bg-emerald-300/30 blur-3xl" />

      {/* FLOAT LIGHT */}
      <div className="absolute right-[38%] top-20 h-24 w-24 rounded-full bg-green-300/20 blur-2xl animate-bounce" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-center">
        <div className="px-6 sm:px-10 lg:px-14">
          <div className="max-w-[620px]">
            {/* BADGE */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-xs font-semibold text-green-700 shadow-sm backdrop-blur-xl">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white">
                <Sparkles size={12} />
              </span>
              Portal Informasi Desa
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Update Terbaru
            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
              Informasi Desa,
              <br />
              <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-700 bg-clip-text text-transparent">Dalam Genggaman</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Temukan berita terbaru, kegiatan warga, pengumuman resmi, dan informasi penting Desa Danasari secara cepat dan terpercaya.
            </p>

            {/* MINI CARD */}
            <div className="mt-6 flex flex-wrap gap-3">
              <MiniCard icon={<Newspaper size={18} />} title="Berita" desc="Informasi Desa" />
              <MiniCard icon={<CalendarDays size={18} />} title="Kegiatan" desc="Agenda Warga" />
              <MiniCard icon={<Megaphone size={18} />} title="Pengumuman" desc="Info Resmi" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 lg:block">
        <div className="relative w-[320px] rounded-[32px] border border-white/80 bg-white/75 p-5 shadow-[0_25px_70px_rgba(16,185,129,0.18)] backdrop-blur-xl animate-[floatCard_6s_ease-in-out_infinite]">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg">
                <Newspaper size={22} />
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-slate-400">BERITA DESA</p>
                <p className="text-sm font-bold text-slate-800">Update Informasi</p>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </div>
          </div>

          {/* IMAGE */}
          <div className="relative mt-5 h-[105px] overflow-hidden rounded-2xl bg-gradient-to-br from-green-100 via-emerald-100 to-green-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <Newspaper size={45} className="text-green-600/40" />
            </div>
            <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-green-700">Berita Terbaru</div>
          </div>

          {/* TITLE */}
          <div className="mt-4">
            <p className="line-clamp-2 text-sm font-bold leading-5 text-slate-800">Informasi kegiatan dan perkembangan terbaru desa</p>
            <p className="mt-2 text-xs text-slate-400">Diperbarui setiap saat oleh admin desa</p>
          </div>

          {/* FOOTER */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full border-2 border-white bg-green-200" />
                <div className="h-7 w-7 rounded-full border-2 border-white bg-emerald-300" />
                <div className="h-7 w-7 rounded-full border-2 border-white bg-green-400" />
              </div>
              <span className="text-xs text-slate-500">Warga membaca</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM LINE */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />

      <style jsx>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
    </section>
  );
}

function MiniCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-600">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-slate-400">{title}</p>
        <p className="text-sm font-bold text-slate-700">{desc}</p>
      </div>
    </div>
  );
}