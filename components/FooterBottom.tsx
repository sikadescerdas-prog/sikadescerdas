// components/FooterBottom.tsx
"use client";

const YEAR = new Date().getFullYear();

interface FooterBottomProps { village?: string; }

export default function FooterBottom({ village = "Desa Danasari" }: FooterBottomProps) {
  return (
    <>
      <div className="footer-bottom relative overflow-hidden border-t border-white/10 bg-green-950/10 backdrop-blur-sm">
        <div className="footer-bottom-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 text-center text-xs text-green-50 sm:text-sm md:flex-row md:text-left">
            <p className="transition-colors duration-300 hover:text-white">© {YEAR} {village}. All rights reserved.</p>
            <p className="transition-colors duration-300 hover:text-white">Dikembangkan dengan <span className="font-semibold italic text-white">SIKADES Cerdas {YEAR}</span></p>
          </div>
        </div>
        <div className="footer-bottom-line absolute bottom-0 left-[-35%] h-[2px] w-[35%]" />
      </div>

      <style jsx>{`
        .footer-bottom-glow { background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.08), transparent 35%), radial-gradient(circle at 80% 50%, rgba(110, 255, 180, 0.12), transparent 40%); animation: bottomGlow 8s ease-in-out infinite; }
        .footer-bottom-line { background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85), transparent); animation: bottomLineMove 6s linear infinite; }
        @keyframes bottomGlow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
        @keyframes bottomLineMove { 0% { transform: translateX(-100%); } 100% { transform: translateX(500%); } }
        @media (prefers-reduced-motion: reduce) { .footer-bottom-glow, .footer-bottom-line { animation: none; } }
      `}</style>
    </>
  );
}