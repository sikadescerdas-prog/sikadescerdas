// components/dashboard/population/form/HeaderFormPopulation.tsx

"use client";

import { ArrowLeft } from "lucide-react";

interface Props {
  isEdit?: boolean;
  year: number;
  onYearChange: (value: number) => void;
  onBack: () => void;
}

export default function HeaderFormPopulation({ isEdit = false, year, onYearChange, onBack }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-6 py-4">
      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onBack} className="shrink-0 rounded-lg border p-2 transition hover:bg-gray-50">
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-gray-900">{isEdit ? "Edit Data Penduduk" : "Tambah Data Penduduk"}</h2>
          <p className="truncate text-sm text-gray-500">Kelola data penduduk desa berdasarkan tahun</p>
        </div>
      </div>

      {/* YEAR */}
      <div className="flex shrink-0 items-center gap-2">
        <label className="whitespace-nowrap text-sm font-medium text-gray-700">Tahun</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={year}
          readOnly={isEdit}
          onChange={(e) => {
            if (isEdit) return;
            const value = e.target.value.replace(/\D/g, "").slice(0, 4);
            onYearChange(value ? Number(value) : new Date().getFullYear());
          }}
          className={`w-16 rounded-lg border px-3 py-1 outline-none ${
            isEdit ? "cursor-not-allowed bg-gray-100 text-gray-500" : "bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
          }`}
        />
      </div>
    </div>
  );
}