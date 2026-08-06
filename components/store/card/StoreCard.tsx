// components/store/card/StoreCard.tsx

"use client";

import Link from "next/link";
import { FaStore, FaMapMarkerAlt } from "react-icons/fa";
import type { StoreWithProducts } from "@/modules/store/hooks/useStoreList";

interface StoreCardProps {
  store: StoreWithProducts;
}

export default function StoreCard({ store }: StoreCardProps) {
  const formatPrice = (price: number | string) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(price || 0));

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* HEADER STORE */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-slate-100">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" />
          ) : (
            <FaStore className="text-slate-300" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold truncate text-slate-800">{store.name}</h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <FaMapMarkerAlt size={10} />
            <span>{store.regency || "Lokasi tidak tersedia"}</span>
          </div>
        </div>

        <Link
          href={`/store/${store.slug}`}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
        >
          Kunjungi
        </Link>
      </div>

      {/* PRODUCTS */}
      <div className="border-t border-slate-100 p-4">
        <p className="mb-3 text-xs font-semibold uppercase text-slate-400">Produk Terbaru</p>

        {store.products?.length ? (
          <div className="grid grid-cols-3 gap-3">
            {store.products.slice(0, 3).map((product) => (
              <Link key={product.id} href={`/store/${store.slug}/${product.slug}`} className="block">
                <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                  {product.thumbnailUrl ? (
                    <img src={product.thumbnailUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">-</div>
                  )}
                </div>

                <p className="mt-1 truncate text-xs font-medium text-slate-700">{product.name}</p>
                <p className="text-xs font-bold text-emerald-600">{formatPrice(product.price)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed py-4 text-center text-xs text-slate-400">
            Belum ada produk
          </div>
        )}
      </div>
    </div>
  );
}