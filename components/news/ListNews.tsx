// components/news/ListNews.tsx

"use client";

import { Newspaper } from "lucide-react";
import CardNews from "./CardNews";
import type { News } from "@/modules/news/types/news.types";

interface Props {
  news: News[];
}

export default function ListNews({ news }: Props) {
  if (!news.length) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-gradient-to-b from-white via-emerald-50/30 to-white px-6 py-16 text-center">
        {/* Icon */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 shadow-lg">
          <Newspaper size={42} className="text-emerald-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-800">Belum Ada Berita</h2>

        {/* Description */}
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">Belum ada berita yang tersedia saat ini. Silakan kembali lagi untuk mendapatkan informasi terbaru dari desa.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <CardNews key={item.id} news={item} />
      ))}
    </div>
  );
}