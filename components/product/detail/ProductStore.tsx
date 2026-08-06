// components/product/details/ProductStore.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Store, ChevronRight } from "lucide-react";

interface ProductStoreProps {
  product: any;
  storeSlug: string;
}

export default function ProductStore({ product, storeSlug }: ProductStoreProps) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between gap-3">
        {/* STORE INFO */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-100 bg-white sm:h-16 sm:w-16">
            {product.storeLogo ? (
              <Image src={product.storeLogo} alt={product.storeName ?? "Toko"} fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Store className="h-5 w-5 text-slate-400 sm:h-7 sm:w-7" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 sm:text-base">{product.storeName ?? "Toko"}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4" />
              <span className="truncate">{product.storeRegency ?? "Indonesia"}</span>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <Link
          href={`/store/${storeSlug}`}
          className="group flex shrink-0 items-center gap-1 rounded-xl border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-600 transition-all hover:border-emerald-400 hover:bg-emerald-50 sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <span>Kunjungi</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
        </Link>
      </div>
    </div>
  );
}