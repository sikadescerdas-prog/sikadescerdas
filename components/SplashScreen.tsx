// components/SplashScreen.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SPLASH_DURATION = 2400;
const CLOSE_DURATION = 500;

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percentage = Math.min((elapsed / SPLASH_DURATION) * 100, 100);
      setProgress(percentage);

      if (percentage >= 100) {
        window.clearInterval(progressTimer);
        window.setTimeout(() => { setClosing(true); }, 150);
        window.setTimeout(() => { setVisible(false); }, 150 + CLOSE_DURATION);
      }
    }, 30);

    return () => { window.clearInterval(progressTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] overflow-hidden bg-[#effcf4] transition-all duration-700 ${closing ? "pointer-events-none scale-[1.03] opacity-0 blur-[4px]" : "opacity-100"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8fffa] via-[#ecfaf1] to-[#d5f5df]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/20 blur-[120px] animate-[auroraPulse_6s_ease-in-out_infinite]" />
        <div className="absolute -left-32 top-10 h-[380px] w-[380px] rounded-full bg-green-200/30 blur-[100px] animate-[auroraLeft_10s_ease-in-out_infinite]" />
        <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-emerald-200/30 blur-[110px] animate-[auroraRight_12s_ease-in-out_infinite]" />
        <div className="absolute left-[30%] top-[-180px] h-[320px] w-[320px] rounded-full bg-white/50 blur-[100px] animate-[auroraTop_9s_ease-in-out_infinite]" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-[20%] h-64 w-64 rounded-full border border-white/70 bg-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] backdrop-blur-3xl animate-[orbOne_10s_ease-in-out_infinite]" />
        <div className="absolute -right-28 bottom-[15%] h-72 w-72 rounded-full border border-white/70 bg-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] backdrop-blur-3xl animate-[orbTwo_12s_ease-in-out_infinite]" />
        <div className="absolute left-[12%] top-[18%] h-10 w-10 rounded-full border border-white/80 bg-white/30 backdrop-blur-xl animate-[miniOrbOne_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] right-[14%] h-14 w-14 rounded-full border border-white/70 bg-white/25 backdrop-blur-xl animate-[miniOrbTwo_7s_ease-in-out_infinite]" />
      </div>

      <div className="pointer-events-none absolute inset-y-[-50%] left-[-25%] w-[20%] rotate-[20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-2xl animate-[lightSweep_8s_linear_infinite]" />

      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[18%] top-[30%] h-1.5 w-1.5 rounded-full bg-emerald-500/40 animate-[particleOne_5s_ease-in-out_infinite]" />
        <span className="absolute left-[28%] top-[68%] h-1 w-1 rounded-full bg-green-600/40 animate-[particleTwo_6s_ease-in-out_infinite]" />
        <span className="absolute right-[22%] top-[28%] h-1.5 w-1.5 rounded-full bg-white/80 animate-[particleThree_7s_ease-in-out_infinite]" />
        <span className="absolute right-[31%] bottom-[25%] h-1 w-1 rounded-full bg-emerald-500/50 animate-[particleFour_5s_ease-in-out_infinite]" />
        <span className="absolute left-[50%] top-[14%] h-1 w-1 rounded-full bg-white animate-[particleFive_6s_ease-in-out_infinite]" />
        <span className="absolute right-[43%] top-[72%] h-1.5 w-1.5 rounded-full bg-green-600/30 animate-[particleSix_7s_ease-in-out_infinite]" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className={`relative w-full max-w-[430px] transition-all duration-700 ${closing ? "translate-y-4 scale-95 opacity-0" : "translate-y-0 scale-100 opacity-100"}`}>
          <div className="relative overflow-hidden rounded-[42px] border border-white/70 bg-white/35 px-7 py-10 shadow-[0_40px_120px_rgba(22,101,52,0.14),inset_0_1px_3px_rgba(255,255,255,0.95)] backdrop-blur-[30px] sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="pointer-events-none absolute inset-[6px] rounded-[36px] border border-white/20" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[42px]">
              <div className="absolute -left-[60%] top-[-20%] h-[150%] w-[35%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-md animate-[glassShine_6s_ease-in-out_infinite]" />
            </div>

            <div className="relative z-10 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-10 rounded-full bg-emerald-400/20 blur-3xl animate-[logoGlow_4s_ease-in-out_infinite]" />
                <div className="absolute -inset-4 rounded-[46px] border border-emerald-400/20" />
                <div className="absolute -inset-4 rounded-[46px] border-2 border-transparent border-t-emerald-400/80 border-r-emerald-300/50 animate-[logoRing_3s_linear_infinite]" />

                <div className="relative flex h-[136px] w-[136px] items-center justify-center rounded-[40px] border border-white/80 bg-white/35 shadow-[inset_0_1px_3px_rgba(255,255,255,0.95),0_28px_70px_rgba(22,101,52,0.14)] backdrop-blur-2xl animate-[logoFloat_5s_ease-in-out_infinite]">
                  <div className="absolute inset-[8px] rounded-[32px] border border-white/60 bg-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]" />
                  <div className="absolute inset-5 rounded-[28px] bg-emerald-400/5 blur-xl" />
                  <Image src="/logo-desa.png" alt="Logo Desa Danasari" width={94} height={94} priority className="relative z-10 h-[92px] w-[92px] object-contain drop-shadow-[0_12px_22px_rgba(22,101,52,0.16)]" />
                  <div className="pointer-events-none absolute left-5 top-4 h-10 w-16 rotate-[-35deg] rounded-full bg-white/45 blur-lg" />
                  <div className="pointer-events-none absolute bottom-5 right-5 h-3 w-8 rotate-[-35deg] rounded-full bg-white/30 blur-sm" />
                </div>

                <span className="absolute -right-2 top-4 flex h-5 w-5 items-center justify-center rounded-full border border-white/80 bg-white/70 shadow-lg backdrop-blur-xl">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-[statusPulse_2s_ease-in-out_infinite]" />
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-10 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.45em] text-emerald-700/60">Website Resmi</p>
              <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.04em] text-green-900 sm:text-[34px]">Desa Danasari</h1>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-emerald-500/20" />
                <p className="text-sm text-green-800/50">Kecamatan Karangjambu</p>
                <span className="h-px w-8 bg-emerald-500/20" />
              </div>
            </div>

            <div className="relative z-10 mt-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.25em] text-green-800/50">LOADING</span>
                </div>
                <span className="text-[10px] font-semibold tabular-nums text-green-800/40">{Math.round(progress)}%</span>
              </div>

              <div className="relative mt-4 h-[5px] overflow-hidden rounded-full bg-green-900/5">
                <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.35)]" style={{ width: `${progress}%` }} />
                <div className="absolute inset-y-0 w-20 rounded-full bg-white/45 blur-sm" style={{ left: `${Math.max(0, progress - 10)}%`, opacity: progress > 3 && progress < 99 ? 1 : 0 }} />
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-green-800/30">Memuat halaman</p>
                <span className="flex gap-0.5">
                  <span className="animate-[loadingDot_1.4s_ease-in-out_infinite]">.</span>
                  <span className="animate-[loadingDot_1.4s_ease-in-out_0.2s_infinite]">.</span>
                  <span className="animate-[loadingDot_1.4s_ease-in-out_0.4s_infinite]">.</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/25 px-4 py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-green-800/40">SIKADES CERDAS</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes auroraPulse { 0%, 100% { transform: translate(-50%, -50%) scale(0.88); opacity: 0.35; } 50% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.75; } }
        @keyframes auroraLeft { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(100px, 50px) scale(1.12); } }
        @keyframes auroraRight { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-90px, -60px) scale(1.12); } }
        @keyframes auroraTop { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; } 50% { transform: translate(80px, 90px) scale(1.1); opacity: 0.65; } }
        @keyframes orbOne { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(90px, 45px) scale(1.08); } }
        @keyframes orbTwo { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-80px, -55px) scale(1.1); } }
        @keyframes miniOrbOne { 0%, 100% { transform: translate(0, 0); opacity: 0.4; } 50% { transform: translate(28px, 35px); opacity: 0.8; } }
        @keyframes miniOrbTwo { 0%, 100% { transform: translate(0, 0); opacity: 0.35; } 50% { transform: translate(-30px, -35px); opacity: 0.75; } }
        @keyframes lightSweep { 0% { transform: translateX(-100%) rotate(20deg); opacity: 0; } 15% { opacity: 0.7; } 55% { opacity: 0.35; } 100% { transform: translateX(700%) rotate(20deg); opacity: 0; } }
        @keyframes glassShine { 0% { transform: translateX(-120%) rotate(18deg); } 45%, 100% { transform: translateX(420%) rotate(18deg); } }
        @keyframes logoGlow { 0%, 100% { transform: scale(0.9); opacity: 0.3; } 50% { transform: scale(1.12); opacity: 0.7; } }
        @keyframes logoFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(1deg); } }
        @keyframes logoRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes statusPulse { 0%, 100% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.25); opacity: 1; } }
        @keyframes loadingDot { 0%, 60%, 100% { opacity: 0.2; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-2px); } }
        @keyframes particleOne { 0%, 100% { transform: translate(0, 0); opacity: 0.2; } 50% { transform: translate(30px, -40px); opacity: 0.8; } }
        @keyframes particleTwo { 0%, 100% { transform: translate(0, 0); opacity: 0.2; } 50% { transform: translate(-30px, -25px); opacity: 0.8; } }
        @keyframes particleThree { 0%, 100% { transform: translate(0, 0); opacity: 0.25; } 50% { transform: translate(-35px, 30px); opacity: 0.9; } }
        @keyframes particleFour { 0%, 100% { transform: translate(0, 0); opacity: 0.2; } 50% { transform: translate(30px, -30px); opacity: 0.8; } }
        @keyframes particleFive { 0%, 100% { transform: translate(0, 0); opacity: 0.2; } 50% { transform: translate(-25px, 40px); opacity: 0.8; } }
        @keyframes particleSix { 0%, 100% { transform: translate(0, 0); opacity: 0.2; } 50% { transform: translate(25px, -30px); opacity: 0.8; } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; } }
      `}</style>
    </div>
  );
}