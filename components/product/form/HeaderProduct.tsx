// components/dashboard/product/form/HeaderProduct.tsx

"use client";

import { ArrowLeft, Package } from "lucide-react";

interface Props {
  isEdit?: boolean;
  onBack: () => void;
}

export default function HeaderProduct({ isEdit = false, onBack }: Props) {
  return (
    <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
          aria-label="Kembali"
        >
          <ArrowLeft size={19} />
        </button>

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Package size={20} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-gray-800">
              {isEdit ? "Edit Produk" : "Tambah Produk"}
            </h1>

            <p className="truncate text-xs text-gray-500">
              {isEdit
                ? "Perbarui informasi produk."
                : "Tambahkan produk baru ke toko."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}