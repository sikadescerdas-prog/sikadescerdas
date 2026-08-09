// components/home/CTASection.tsx
"use client";

import Link from "next/link";
import { ChevronRight, Sparkles, Users, BookOpen, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";

export default function CTASection() {
  const features = [
    { icon: ShieldCheck, title: "Layanan Aman", color: "text-green-200" },
    { icon: Zap, title: "Cepat Praktis", color: "text-yellow-200" },
    { icon: Users, title: "Untuk Warga", color: "text-cyan-200" },
  ];

  return (
    <section className="relative mt-8 overflow-hidden rounded-3xl text-white shadow-2xl">
      <div className="absolute inset-0 footer-gradient" />
      <div className="absolute inset-0 bg-emerald-950/10" />
      <div className="footer-grid pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="footer-orb footer-orb-one" />
        <div className="footer-orb footer-orb-two" />
        <div className="footer-orb footer-orb-three" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="footer-particle particle-one" />
        <span className="footer-particle particle-two" />
        <span className="footer-particle particle-three" />
        <span className="footer-particle particle-four" />
      </div>

      <div className="footer-light pointer-events-none absolute inset-y-0 left-[-35%] w-[28%]" />

      <div className="relative mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-green-50 backdrop-blur-md shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" /> Platform Desa Digital
          </div>

          <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-white md:text-3xl">Desa Danasari <span className="text-green-100">Maju & Modern</span></h2>

          <p className="mt-1.5 text-sm text-green-50 leading-relaxed">Nikmati kemudahan layanan administrasi, informasi, dan UMKM desa dalam satu genggaman.</p>

          <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md shadow-sm transition-transform duration-300 hover:scale-105">
                  <Icon className={`h-4 w-4 ${feature.color}`} />
                  <span className="text-xs font-medium text-white">{feature.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex w-full flex-col sm:flex-row gap-3 lg:w-auto">
          <Link href="/login" className="group flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white px-5 py-3 text-sm font-bold text-emerald-900 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-50">
            <span>Gabung Warga</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link href="/village" className="group flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/30">
            <BookOpen className="h-4 w-4" />
            <span>Profil Desa</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .footer-gradient {
          background: linear-gradient(120deg, #58e88e, #25c95f, #10a957, #42df80, #25c95f, #0f9f50);
          background-size: 400% 400%;
          animation: gradientMove 14s ease infinite;
        }
        .footer-grid {
          opacity: 0.07;
          background-image: linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 20s linear infinite;
        }
        .footer-orb {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          filter: blur(50px);
          mix-blend-mode: screen;
        }
        .footer-orb-one { width: 220px; height: 220px; left: -60px; top: -60px; background: rgba(255, 255, 255, 0.14); animation: orbOne 10s ease-in-out infinite; }
        .footer-orb-two { width: 280px; height: 280px; right: -80px; top: 10px; background: rgba(110, 255, 180, 0.18); animation: orbTwo 13s ease-in-out infinite; }
        .footer-orb-three { width: 200px; height: 200px; left: 40%; bottom: -80px; background: rgba(255, 255, 255, 0.1); animation: orbThree 11s ease-in-out infinite; }
        
        .footer-light {
          transform: skewX(-20deg);
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          filter: blur(2px);
          animation: lightSweep 8s linear infinite;
        }

        .footer-particle {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.65);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.45);
        }
        .particle-one { width: 5px; height: 5px; left: 15%; top: 30%; animation: particleOne 7s ease-in-out infinite; }
        .particle-two { width: 4px; height: 4px; left: 45%; top: 60%; animation: particleTwo 6s ease-in-out infinite; }
        .particle-three { width: 6px; height: 6px; right: 25%; top: 20%; animation: particleThree 8s ease-in-out infinite; }
        .particle-four { width: 4px; height: 4px; right: 10%; bottom: 25%; animation: particleFour 6s ease-in-out infinite; }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gridMove {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(60px, 60px, 0); }
        }
        @keyframes orbOne {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(40px, 30px, 0) scale(1.15); }
        }
        @keyframes orbTwo {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-50px, 40px, 0) scale(1.1); }
        }
        @keyframes orbThree {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(40px, -30px, 0); }
        }
        @keyframes lightSweep {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(500%) skewX(-20deg); }
        }
        @keyframes particleOne {
          0%, 100% { transform: translate(0, 0); opacity: 0.25; }
          50% { transform: translate(20px, -25px); opacity: 1; }
        }
        @keyframes particleTwo {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(-20px, 20px); opacity: 0.9; }
        }
        @keyframes particleThree {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(25px, 25px); opacity: 1; }
        }
        @keyframes particleFour {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(-25px, -20px); opacity: 0.9; }
        }
      `}</style>
    </section>
  );
}