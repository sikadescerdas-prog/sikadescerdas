// components/village/HeaderVillage.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Sparkles } from "lucide-react";

interface HeaderVillageProps {
  title: string;
  village: {
    name: string | null;
    logo?: string | null;
    address?: {
      district?: string | null;
      regency?: string | null;
    };
  };
  showBackButton?: boolean;
}

export default function HeaderVillage({
  title,
  village,
  showBackButton = true,
}: HeaderVillageProps) {
  return (
    <section className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 px-4 pt-10 pb-32 lg:pb-40">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(3deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes popUp {
          0% { opacity: 0; transform: scale(0.5) translateY(20px); }
          70% { transform: scale(1.05) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .floating { animation: float 7s ease-in-out infinite; }
        .floatingDelay { animation: float 7s ease-in-out infinite; animation-delay: 2s; }
        .pulseGlow { animation: pulseGlow 4s ease-in-out infinite; }
        .spinSlow { animation: spinSlow 25s linear infinite; }
        .animate-logo-box { animation: popUp 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-badge { animation: slideInLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-title-text { animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.15s; opacity: 0; }
        .animate-meta-info { animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.3s; opacity: 0; }
        .glass-pill { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .glass-pill:hover { transform: translateY(-3px) scale(1.02); background-color: rgba(255, 255, 255, 0.25); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
      `}</style>

      {/* BACK BUTTON */}
      {showBackButton && (
        <Link href="/" className="absolute top-8 left-4 z-20">
          <div className="group flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xl border border-white/40 hover:bg-white hover:scale-105 transition-all duration-300">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300" />
            Beranda
          </div>
        </Link>
      )}

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ORBS & DYNAMIC SHAPES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 -left-10 w-28 h-28 bg-white/25 rounded-full floating blur-sm" />
        <div className="absolute top-1/3 -right-16 w-24 h-24 bg-emerald-300/30 rounded-full floatingDelay blur-sm" />
        <div className="absolute -bottom-12 -right-14 w-48 h-48 border-2 border-dashed border-white/25 rounded-full spinSlow" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8 px-2">
        
        {/* LOGO CONTAINER */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 animate-logo-box group">
          <div className="absolute inset-0 bg-white/50 blur-2xl rounded-full pulseGlow" />
          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-white/40 backdrop-blur-md shadow-2xl ring-4 ring-white/60 flex items-center justify-center transition-all duration-500 group-hover:ring-white group-hover:scale-105 group-hover:rotate-2">
            {village.logo ? (
              <Image
                src={village.logo}
                alt={village.name || "Logo Desa"}
                fill
                className="object-cover p-5 transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <span className="text-6xl filter drop-shadow-md animate-bounce">🏡</span>
            )}
          </div>
        </div>

        {/* TEXT INFO */}
        <div className="text-center sm:text-left space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[11px] font-bold uppercase tracking-widest shadow-sm border border-white/25 animate-badge">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-spin" style={{ animationDuration: '6s' }} />
            {title}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight animate-title-text drop-shadow-sm">
            {village.name}
          </h1>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 animate-meta-info">
            <span className="glass-pill flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20 cursor-default">
              Kec. {village.address?.district || "Kecamatan"}
            </span>
            <span className="glass-pill bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20 cursor-default">
              Kab. {village.address?.regency || "Kabupaten"}
            </span>
          </div>
        </div>

      </div>

      {/* WAVE */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none">
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            d="M0,160L48,144C96,128,192,96,288,106C384,117,480,171,576,186C672,203,768,181,864,154C960,128,1056,96,1152,101C1248,107,1344,149,1392,170L1440,192L1440,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
}