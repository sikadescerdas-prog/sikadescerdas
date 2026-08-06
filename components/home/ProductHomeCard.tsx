// components/home/ProductHomeCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, Store } from "lucide-react";

interface ProductHomeCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    thumbnail_url: string | null;
    price: number | string;
    stock: number;
    stores?: {
      name: string;
      slug: string;
      logo_url?: string | null;
    } | null;
  };
}

export default function ProductHomeCard({ product }: ProductHomeCardProps) {
  function formatPrice(value: number | string) {
    const price = Number(value ?? 0);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  }

  return (
    <Link
      href={`/store/${product.stores?.slug ?? "store"}/${product.slug}`}
      className="group block overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={product.name}
            fill
            sizes="250px"
            className="object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-10 w-10 text-slate-300" />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3">
        {/* PRODUCT NAME */}
        <h3 className="line-clamp-1 text-sm font-semibold leading-5 text-slate-800" title={product.name}>
          {product.name}
        </h3>

        {/* PRICE */}
        <p className="mt-2 text-sm font-bold text-emerald-600">
          {formatPrice(product.price)}
        </p>

        {/* STORE */}
        <div className="mt-2 flex items-center gap-2">
          <div className="relative h-5 w-5 overflow-hidden rounded-md bg-slate-100 flex items-center justify-center">
            {product.stores?.logo_url ? (
              <Image
                src={product.stores.logo_url}
                alt={product.stores.name}
                fill
                sizes="20px"
                className="object-cover"
              />
            ) : (
              <Store className="h-3 w-3 text-slate-400" />
            )}
          </div>

          <p className="truncate text-xs text-slate-400" title={product.stores?.name ?? "UMKM Desa"}>
            {product.stores?.name ?? "UMKM Desa"}
          </p>
        </div>
      </div>
    </Link>
  );
}