// components/home/BeritaSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Newspaper, ArrowRight, CalendarDays } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail_url: string | null;
  category: string;
  content_date?: string | null;
}

interface BeritaSectionProps {
  news?: NewsItem[];
}

export default function BeritaSection({ news = [] }: BeritaSectionProps) {
  function formatDate(date?: string | null) {
    if (!date) return "-";
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
  }

  function formatCategory(category: string) {
    const map: any = { news: "Berita", announcement: "Pengumuman", event: "Kegiatan" };
    return map[category] ?? "Berita";
  }

  return (
    <section className="relative mt-6 xl:mt-8 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 p-4 shadow-2xl backdrop-blur-xl xl:p-6">
      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 text-white shadow-lg"><Newspaper className="h-5 w-5 animate-pulse" /></div>
          <div><h3 className="text-lg font-bold text-gray-900">Berita Desa</h3><p className="text-xs text-gray-500">Informasi terbaru masyarakat desa</p></div>
        </div>

        <Link href="/news" className="hidden items-center gap-2 text-sm font-semibold text-blue-600 hover:underline md:flex">
          Lihat Semua <ArrowRight size={16} />
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-blue-200 bg-white/70 py-14 text-center">
          <Newspaper className="mb-3 h-10 w-10 text-blue-400" />
          <h3 className="font-semibold text-slate-700">Belum Ada Berita</h3>
          <p className="mt-1 text-sm text-slate-500">Informasi desa akan muncul di sini.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 py-5">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* IMAGE */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                {item.thumbnail_url ? (
                  <Image src={item.thumbnail_url} alt={item.title} fill sizes="400px" className="object-cover transition duration-500 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl">📰</div>
                )}

                <div className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                  {formatCategory(item.category)}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-400"><CalendarDays size={14} />{formatDate(item.content_date)}</div>

                <h3 className="mt-3 line-clamp-2 text-lg font-bold text-gray-800">{item.title}</h3>

                <p className="mt-2 line-clamp-3 text-sm text-gray-500">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* BLUE GLOW */}
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />
    </section>
  );
}