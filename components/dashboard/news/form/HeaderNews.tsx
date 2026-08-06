// components/dashboard/news/form/HeaderNews.tsx

"use client";

import { ArrowLeft } from "lucide-react";

interface Props {
  isEdit?: boolean;
  onBack: () => void;
}

export default function HeaderNews({ isEdit = false, onBack }: Props) {
  return (
    <div className="flex items-center gap-3 border-b px-6 py-4">
      <button
        type="button"
        onClick={onBack}
        className="rounded-lg border p-2 hover:bg-gray-50"
      >
        <ArrowLeft size={18} />
      </button>

      <div>
        <h3 className="font-semibold text-gray-900">{isEdit ? "Edit Berita" : "Tambah Berita"}</h3>
        <p className="text-sm text-gray-500">
          {isEdit ? "Perbarui informasi berita desa" : "Kelola informasi berita desa"}
        </p>
      </div>
    </div>
  );
}