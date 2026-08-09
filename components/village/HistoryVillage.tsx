// components/village/HistoryVillage.tsx
"use client";

import Image from "next/image";
import { BookOpen, Quote, Sparkles } from "lucide-react";
import { useVillage } from "@/modules/village/hooks/useVillage";

export default function HistoryVillage() {
  const { village, loading } = useVillage();

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100">
        <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-3/4 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </section>
    );
  }

  if (!village) return null;

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-2xl shadow-green-950/5 transition-all duration-700 hover:shadow-green-950/15">
      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes morphBlob { 0%, 100% { transform: translate(0px, 0px) scale(1); } 50% { transform: translate(-15px, 15px) scale(1.15); } }
        @keyframes shimmerLine { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
        .animate-fade-up { animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .blob-anim { animation: morphBlob 6s ease-in-out infinite; }
        .float-anim { animation: floatSlow 5s ease-in-out infinite; }
        .shimmer-border { background: linear-gradient(90deg, rgba(34,197,94,0.2) 0%, rgba(16,185,129,0.5) 50%, rgba(34,197,94,0.2) 100%); background-size: 200% 100%; animation: shimmerLine 4s linear infinite; }
        .glass-card-hover { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .glass-card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -15px rgba(22, 163, 74, 0.15); }
      `}</style>

      {/* HEADER */}
      <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-7 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-white/20 rounded-full blur-2xl blob-anim pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl blob-anim pointer-events-none" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 backdrop-blur-md p-3.5 border border-white/30 shadow-lg float-anim transition-transform">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 drop-shadow-sm">
                Sejarah Desa
                <Sparkles className="h-4 w-4 text-green-100 animate-pulse" />
              </h2>
              <p className="text-sm font-medium text-green-50 mt-0.5 tracking-wide">Mengenal perjalanan & profil {village.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10 p-8 sm:p-10">
        {/* HISTORY SECTION */}
        <div className="prose prose-slate max-w-none animate-fade-up">
          <p className="whitespace-pre-line leading-relaxed text-slate-600 text-base sm:text-lg font-normal tracking-wide">
            {village.history || "Belum ada informasi sejarah desa."}
          </p>
        </div>

        {/* SHIMMER DIVIDER */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full h-[2px] shimmer-border rounded-full" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-5 text-xs font-bold uppercase tracking-widest text-green-700 shadow-sm rounded-full py-1 border border-green-100">
              Pemerintahan Desa
            </span>
          </div>
        </div>

        {/* LEADERSHIP SECTION */}
        <div className="relative p-6 sm:p-8">
          <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-green-300/20 rounded-full blur-3xl transition-all duration-700 group-hover/card:scale-125 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
            {/* AVATAR CONTAINER */}
            <div className="relative shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full blur-lg opacity-30 group-hover/card:opacity-75 transition-all duration-500 animate-pulse" />
              <div className="relative h-36 w-36 sm:h-40 sm:w-40 rounded-full p-1.5 bg-white shadow-2xl ring-4 ring-green-100/80 overflow-hidden">
                <Image src={village.head?.photo || "/avatar.png"} alt={village.head?.name || "Kepala Desa"} fill className="rounded-full object-cover transition-transform duration-700 group-hover/card:scale-110 group-hover/card:rotate-1" />
              </div>
            </div>

            {/* DETAILS & QUOTE */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight transition-colors duration-300 group-hover/card:text-green-800">
                  {village.head?.name || "Nama Kepala Desa"}
                </h3>
                <p className="mt-1 text-sm font-bold tracking-widest text-green-600 uppercase">
                  {village.head?.title || "Kepala Desa"}
                </p>
              </div>

              {/* WELCOME QUOTE BOX */}
              <div className="relative rounded-2xl bg-white/95 backdrop-blur-md border border-green-100/90 p-6 shadow-md transition-all duration-500 group-hover/card:shadow-xl group-hover/card:border-green-300">
                <div className="absolute top-4 left-4 text-green-500/10 pointer-events-none transition-transform duration-500 group-hover/card:scale-110">
                  <Quote className="h-12 w-12 rotate-180" />
                </div>

                <div className="relative z-10">
                  <div className="mb-2.5 flex items-center justify-center gap-2.5 md:justify-start">
                    <div className="p-1.5 rounded-xl bg-green-100/80 text-green-700 shadow-inner">
                      <Quote className="h-4 w-4" />
                    </div>
                    <span className="font-extrabold text-xs uppercase tracking-wider text-green-800">Sambutan Kepala Desa</span>
                  </div>

                  <p className="whitespace-pre-line italic leading-relaxed text-slate-700 text-sm sm:text-base font-medium">
                    {village.welcomeMessage || "Selamat datang di website resmi desa kami. Semoga portal ini bermanfaat bagi seluruh warga."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}