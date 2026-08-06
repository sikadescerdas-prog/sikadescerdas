// components/about/AboutBackground.tsx

"use client";

interface AboutBackgroundProps {
  children: React.ReactNode;
}

export default function AboutBackground({ children }: AboutBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* BACKGROUND GRADIENT */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -right-40 top-40 h-[450px] w-[450px] rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-green-300/10 blur-3xl" />
      </div>

      {/* GRID PATTERN */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* CONTENT */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}