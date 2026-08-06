// components/services/ServiceBackground.tsx

"use client";

export default function ServiceBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Main Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50" />

      {/* Top Glow */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />

      {/* Right Glow */}
      <div className="absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-blue-300/20 blur-3xl" />

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Floating Dots */}
      <div className="absolute left-[10%] top-[25%] h-2 w-2 rounded-full bg-emerald-400/40" />
      <div className="absolute right-[15%] top-[40%] h-3 w-3 rounded-full bg-blue-400/40" />
      <div className="absolute bottom-[20%] left-[40%] h-2 w-2 rounded-full bg-teal-400/40" />
    </div>
  );
}