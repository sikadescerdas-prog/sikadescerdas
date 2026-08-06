// components/dashboard/news/HeaderNews.tsx

"use client";

export default function HeaderNews() {
  return (
    <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 px-8 pb-6 pt-8">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 h-40 w-40 animate-pulse rounded-full bg-white/40 blur-2xl" />
        <div className="absolute -right-8 top-1/2 h-32 w-32 animate-pulse rounded-full bg-white/30 blur-xl delay-700" />
        <div className="absolute -bottom-16 left-1/3 h-48 w-48 animate-pulse rounded-full bg-white/30 blur-2xl delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Berita Desa</h2>
            <p className="mt-1 text-sm text-white/80">Kelola informasi, pengumuman, dan kegiatan desa</p>
          </div>

          {/* Indicator */}
          <div className="flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-md">
            <span className="h-3 w-3 animate-pulse rounded-full bg-white" />
            <span className="h-3 w-3 animate-pulse rounded-full bg-white" />
            <span className="h-3 w-3 animate-pulse rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Bottom Pattern */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex h-1 items-center gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-full flex-1 bg-white/40" />
          ))}
        </div>
        <div className="h-1 bg-white" />
      </div>
    </div>
  );
}