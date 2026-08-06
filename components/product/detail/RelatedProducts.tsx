// components/product/details/RelatedProducts.tsx

"use client";

import Link from "next/link";
import type { ProductWithStore } from "@/modules/product/hooks/useProductList";

interface RelatedProductsProps {
  products: ProductWithStore[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  function formatPrice(price: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  }

  return (
    <section className="mt-10 border-t border-slate-200 pt-6">
      <h2 className="mb-5 text-lg font-bold text-slate-900">Produk Lainnya</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {products.slice(0, 6).map((product) => (
          <Link
            key={product.id}
            href={`/store/${product.storeSlug}/${product.slug}`}
            className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition duration-300 hover:shadow-md"
          >
            {/* IMAGE */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
              {product.thumbnailUrl ? (
                <img src={product.thumbnailUrl} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">Tidak ada gambar</div>
              )}
              {/* CATEGORY BADGE */}
              <div className="absolute left-3 top-3 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
                {product.category?.name ?? "Umum"}
              </div>
            </div>

            {/* INFO */}
            <div className="space-y-2 p-3">
              <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800">{product.name}</p>
              <p className="text-sm font-bold text-emerald-600">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}