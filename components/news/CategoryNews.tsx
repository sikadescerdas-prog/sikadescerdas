// components/news/CategoryNews.tsx

"use client";

import { Newspaper, Megaphone, CalendarDays, Layers } from "lucide-react";
import { useSwipe } from "@/shared/hooks/useSwipe";

interface Props {
  active?: string;
  onChange?: (value: string) => void;
}

const categories = [
  { value: "", label: "Semua", icon: Layers },
  { value: "news", label: "Berita", icon: Newspaper },
  { value: "announcement", label: "Pengumuman", icon: Megaphone },
  { value: "event", label: "Event", icon: CalendarDays },
];

export default function CategoryNews({ active = "", onChange }: Props) {
  const swipeRef = useSwipe(1.2) as React.RefObject<HTMLDivElement | null>;

  return (
    <section>
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* LIST BERITA (KIRI) */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200">
            <Newspaper size={23} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">List Berita</h2>
            <p className="text-sm text-slate-500">Informasi terbaru desa</p>
          </div>
        </div>

        {/* CATEGORY (KANAN) */}
        <div className="flex w-full items-center gap-3 md:w-auto md:justify-end">
          {/* SWIPE AREA: Bisa digeser/swipe kanan-kiri */}
          <div ref={swipeRef} className="flex flex-1 md:flex-initial gap-2 overflow-x-auto scrollbar-hide cursor-grab select-none pb-1 md:pb-0">
            {categories.map((item) => {
              const Icon = item.icon;
              const selected = active === item.value;

              return (
                <button
                  key={item.value}
                  onClick={() => onChange?.(item.value)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    selected ? "bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg shadow-emerald-200 scale-105" : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-emerald-50"
                  }`}
                >
                  <Icon size={16} className={selected ? "text-white" : "text-slate-400"} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}