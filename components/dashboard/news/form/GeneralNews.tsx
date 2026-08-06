// components/dashboard/news/form/GeneralNews.tsx

"use client";

import type { NewsCategory } from "@/modules/dashboard/news/types/news.types";

interface Props {
  category: "" | NewsCategory;
  contentDate: string | null;
  contentLocation: string | null;
  onCategoryChange: (value: "" | NewsCategory) => void;
  onContentDateChange: (value: string) => void;
  onContentLocationChange: (value: string) => void;
}

export default function GeneralNews({
  category,
  contentDate,
  contentLocation,
  onCategoryChange,
  onContentDateChange,
  onContentLocationChange,
}: Props) {
  return (
    <div className="space-y-5">
      {/* CATEGORY */}
      <div>
        <label className="mb-2 block text-sm font-medium">Kategori</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as "" | NewsCategory)}
          className="w-full rounded-lg border px-4 py-2"
        >
          <option value="">Pilih kategori</option>
          <option value="news">Berita</option>
          <option value="announcement">Pengumuman</option>
          <option value="event">Kegiatan</option>
        </select>
      </div>

      {/* DATE & LOCATION */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Tanggal Acara</label>
          <input
            type="date"
            value={contentDate ?? ""}
            onChange={(e) => onContentDateChange(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Lokasi</label>
          <input
            value={contentLocation ?? ""}
            onChange={(e) => onContentLocationChange(e.target.value)}
            placeholder="Contoh: Balai Desa"
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>
      </div>
    </div>
  );
}