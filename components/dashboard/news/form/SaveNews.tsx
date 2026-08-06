// components/dashboard/news/form/SaveNews.tsx

"use client";

import { Save } from "lucide-react";

interface Props {
  loading: boolean;
  editMode: boolean;
}

export default function SaveNews({ loading, editMode }: Props) {
  return (
    <div className="flex justify-end border-t pt-6">
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={16} />
        {loading ? "Menyimpan..." : editMode ? "Simpan Perubahan" : "Simpan Berita"}
      </button>
    </div>
  );
}