// components/services/SearchServices.tsx

"use client";

import { Search, X } from "lucide-react";

interface SearchServicesProps {
  keyword: string;
  setKeyword: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
  hasFilters: boolean;
  onClear: () => void;
}

export default function SearchServices({
  keyword,
  setKeyword,
  category,
  setCategory,
  categories,
  hasFilters,
  onClear,
}: SearchServicesProps) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white/85 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari layanan..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-emerald-400"
          />
        </div>

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none md:w-56"
        >
          <option value="">Semua Kategori</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* CLEAR */}
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}