// components/store/category/ProductInfo.tsx

"use client";

import { useSearchParams } from "next/navigation";

interface ProductInfoProps {
  totalProduk: number;
}

export default function ProductInfo({ totalProduk }: ProductInfoProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.trim() ?? "";

  return (
    <div className="flex min-w-0 items-center gap-2 overflow-hidden md:flex-1 md:justify-between md:gap-4">
      <p className="shrink-0 text-xs font-medium text-slate-400 md:text-sm">
        <span className="font-semibold text-emerald-600">{totalProduk}</span> produk
      </p>

      {search && (
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-xs text-emerald-200 md:hidden">|</span>
          <span className="shrink-0 text-xs text-slate-400 md:text-sm">Hasil pencarian:</span>
          <span className="max-w-[150px] truncate rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 ring-1 ring-emerald-100 md:text-xs">
            &quot;{search}&quot;
          </span>
        </div>
      )}
    </div>
  );
}