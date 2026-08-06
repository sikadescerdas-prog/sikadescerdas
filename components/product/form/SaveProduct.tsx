// components/dashboard/product/form/SaveProduct.tsx

"use client";

import { Loader2, Save } from "lucide-react";

interface Props {
  loading?: boolean;
  editMode?: boolean;
}

export default function SaveProduct({
  loading = false,
  editMode = false,
}: Props) {
  return (
    <div className="flex items-center justify-end border-t pt-5">
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            {editMode ? "Simpan Perubahan" : "Simpan Produk"}
          </>
        )}
      </button>
    </div>
  );
}