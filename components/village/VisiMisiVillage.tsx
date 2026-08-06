// components/village/VisiMisiVillage.tsx
"use client";

import { Eye, Target, Sparkles, Quote, CheckCircle2 } from "lucide-react";

interface VisiMisiVillageProps {
  village: {
    vision?: string | null;
    mission?: string | null;
  };
}

export default function VisiMisiVillage({ village }: VisiMisiVillageProps) {
  const vision = village.vision || "Menjadi desa yang maju, mandiri, sejahtera, serta berdaya saing melalui pembangunan berkelanjutan berbasis potensi lokal.";

  const missions = village.mission?.split(/\r?\n|;/).map((item) => item.trim()).filter(Boolean) || [
    "Meningkatkan kualitas pelayanan publik yang cepat, transparan, dan akuntabel.",
    "Mengembangkan potensi ekonomi desa berbasis UMKM dan pertanian.",
    "Meningkatkan kualitas pendidikan, kesehatan, dan kesejahteraan masyarakat.",
    "Melestarikan budaya, lingkungan hidup, dan nilai gotong royong.",
    "Memanfaatkan teknologi informasi menuju desa digital.",
  ];

  return (
    <div className="w-full mx-auto group/card">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-2xl shadow-green-950/5 transition-all duration-700 hover:shadow-green-950/20 hover:-translate-y-1">
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(3deg); }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.35; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.15); }
          }
          @keyframes morphBlob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-20px, 12px) scale(1.15); }
            66% { transform: translate(15px, -18px) scale(0.92); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(35px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeRight {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .blob { animation: morphBlob 8s ease-in-out infinite; }
          .float { animation: float 5s ease-in-out infinite; }
          .pulse { animation: pulseGlow 4s ease-in-out infinite; }
          .appear { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .appearLeft { animation: fadeRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .spin { animation: spinSlow 20s linear infinite; }
          .mission-item { opacity: 0; animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .mission-item:nth-child(1) { animation-delay: 0.15s; }
          .mission-item:nth-child(2) { animation-delay: 0.3s; }
          .mission-item:nth-child(3) { animation-delay: 0.45s; }
          .mission-item:nth-child(4) { animation-delay: 0.6s; }
          .mission-item:nth-child(5) { animation-delay: 0.75s; }
          .mission-item:nth-child(6) { animation-delay: 0.9s; }
          .mission-item:nth-child(7) { animation-delay: 1.05s; }
          .mission-item:nth-child(8) { animation-delay: 1.2s; }
        `}</style>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-green-100/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
        </div>

        <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 px-8 py-7">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl blob" />
          <div className="absolute left-1/4 -bottom-16 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl blob" style={{ animationDelay: '3s' }} />
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/20 backdrop-blur-md shadow-xl float transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-6">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-white drop-shadow-sm">
                Visi & Misi Desa
                <Sparkles className="h-4 w-4 animate-pulse text-green-100" />
              </h2>
              <p className="mt-1 text-sm font-medium text-green-50 tracking-wide">
                Arah pembangunan dan komitmen pemerintah desa dalam mewujudkan masyarakat yang maju, mandiri, dan sejahtera.
              </p>
            </div>
          </div>
        </div>

        <div className="relative space-y-8 p-8 sm:p-12 bg-gradient-to-b from-white via-emerald-50/10 to-white">
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none pulse" />

          <div className="group relative overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-white via-green-50/30 to-emerald-50 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-100/40 blur-3xl transition-all duration-500 group-hover:scale-150" />
            <div className="relative z-10">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-100 bg-white text-green-600 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <Eye size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-600">Vision</p>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Visi Desa</h3>
                </div>
              </div>
              <div className="rounded-2xl border border-green-100 bg-white/70 p-6 backdrop-blur-sm shadow-inner">
                <Quote className="mb-4 h-8 w-8 text-green-500 opacity-70" />
                <p className="text-lg font-semibold leading-9 text-slate-700">{vision}</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl">
            <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-emerald-100/40 blur-3xl transition-all duration-500 group-hover:scale-150" />
            <div className="relative z-10">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-600 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <Target size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600">Mission</p>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Misi Desa</h3>
                </div>
              </div>
              <div className="space-y-4">
                {missions.map((mission, index) => (
                  <div key={index} className="group/item flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 backdrop-blur-sm transition-all duration-300 hover:border-green-300 hover:shadow-md mission-item">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow">
                      <CheckCircle2 size={18} />
                    </div>
                    <p className="flex-1 text-sm leading-7 text-slate-700 font-medium">{mission}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}