// components/home/UMKMSection.tsx
"use client";

import { useSwipe } from "@/shared/hooks/useSwipe";
import { Package } from "lucide-react";
import ProductHomeCard from "./ProductHomeCard";

interface Product {
  id: number;
  name: string;
  slug: string;
  thumbnail_url: string;
  price: number;
  stock: number;
  stores?: {
    name: string;
    slug: string;
    logo_url?: string | null;
  };
}

interface UMKMSectionProps {
  products?: Product[];
}

export default function UMKMSection({ products = [] }: UMKMSectionProps) {
  const swipeRef = useSwipe(1.2);

  return (
    <section className="relative mt-6 xl:mt-8 overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-100/60 p-4 shadow-2xl backdrop-blur-xl xl:p-6">
      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between gap-3">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 text-white shadow-lg">
            <Package className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Store UMKM</h3>
            <p className="text-xs text-gray-500">Produk unggulan masyarakat desa</p>
          </div>
        </div>

        {/* RIGHT */}
        <a href="/store" className="whitespace-nowrap text-sm font-semibold text-emerald-600 hover:underline">
          Lihat Semua →
        </a>
      </div>

      {/* CONTENT */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-white/60 py-14 text-center backdrop-blur">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
            <Package className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Belum Ada Produk</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Produk dari pelaku UMKM desa akan segera ditampilkan di sini.
          </p>
        </div>
      ) : (
        <div ref={swipeRef} className="flex cursor-grab gap-3 overflow-x-auto pb-3 scrollbar-hide active:cursor-grabbing">
          {products.map((product) => (
            <div key={product.id} className="w-[210px] flex-none sm:w-[230px] md:w-[240px]">
              <ProductHomeCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* GLOW */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
    </section>
  );
}