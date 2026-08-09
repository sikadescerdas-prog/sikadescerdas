// components/product/card/ProductCard.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { FaBox, FaMapMarkerAlt } from "react-icons/fa";
import type { ProductWithStore } from "@/modules/product/hooks/useProductList";

interface ProductCardProps { product: ProductWithStore; showStoreName?: boolean; }

export default function ProductCard({ product, showStoreName = true }: ProductCardProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const productUrl = `/store/${product.storeSlug}/${product.slug}`;
  const storeUrl = `/store/${product.storeSlug}`;
  const categoryName = product.category?.name ?? "Umum";

  const categoryColor = {
    Makanan: "bg-orange-100 text-orange-700 border-orange-200",
    Minuman: "bg-blue-100 text-blue-700 border-blue-200",
    Fashion: "bg-pink-100 text-pink-700 border-pink-200",
    Kerajinan: "bg-purple-100 text-purple-700 border-purple-200",
    Pertanian: "bg-green-100 text-green-700 border-green-200",
    Peternakan: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Jasa: "bg-cyan-100 text-cyan-700 border-cyan-200",
    Lainnya: "bg-slate-100 text-slate-700 border-slate-200",
  }[categoryName] ?? "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-xl">
      <Link href={productUrl} className="relative block aspect-[4/3] overflow-hidden bg-slate-50">
        {product.thumbnailUrl ? (<img src={product.thumbnailUrl} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />) : (<div className="flex h-full items-center justify-center"><FaBox size={40} className="text-slate-300" /></div>)}
        <div className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${categoryColor}`}>{categoryName}</div>
      </Link>

      <div className="p-4">
        <Link href={productUrl} className="line-clamp-1 text-sm font-semibold leading-5 text-slate-800">{product.name}</Link>
        <div className="mt-1 text-base font-bold text-emerald-600">{formatPrice(product.price)}</div>

        {showStoreName && product.storeName && (
          <Link href={storeUrl} className="mt-3 flex gap-2 border-t pt-3">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-100 bg-white">
              {product.logoUrl ? (<Image src={product.logoUrl} alt={product.storeName} fill className="object-cover" unoptimized />) : (<div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">T</div>)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-slate-700">{product.storeName}</div>
              {product.storeCity && (<div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400"><FaMapMarkerAlt size={10} />{product.storeCity}</div>)}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}