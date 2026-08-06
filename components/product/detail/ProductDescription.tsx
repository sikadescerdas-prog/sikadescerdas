// components/product/details/ProductDescription.tsx

"use client";

import { Boxes, Package, Scale } from "lucide-react";

interface ProductDescriptionProps {
  product: any;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <div className="space-y-6">
      {/* KATEGORI */}
      <div className="grid grid-cols-[100px_1fr] border-b border-slate-100 pb-3 sm:grid-cols-[140px_1fr]">
        <p className="border-r border-slate-200 pr-3 text-sm font-semibold text-slate-400">Kategori</p>
        <p className="pl-3 text-sm font-bold text-slate-800">{product.category ?? "-"}</p>
      </div>

      {/* DESKRIPSI */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">Deskripsi</h2>
        <div className="my-3 h-px bg-slate-100" />
        <p className="text-sm leading-6 text-slate-600">{product.description || "Tidak ada deskripsi produk."}</p>
      </div>

      {/* DETAIL PRODUK */}
      <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3 sm:divide-x">
        {/* SATUAN */}
        <div className="flex items-center gap-3 sm:px-4">
          <Package className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-xs text-slate-400">Satuan</p>
            <p className="text-sm font-semibold text-slate-700">{product.unit ?? "-"}</p>
          </div>
        </div>

        {/* BERAT */}
        <div className="flex items-center gap-3 sm:px-4">
          <Scale className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-xs text-slate-400">Berat</p>
            <p className="text-sm font-semibold text-slate-700">{product.weight ? `${product.weight} gram` : "-"}</p>
          </div>
        </div>

        {/* STOK */}
        <div className="flex items-center gap-3 sm:px-4">
          <Boxes className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-xs text-slate-400">Stok</p>
            <p className="text-sm font-semibold text-slate-700">{product.stock ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}