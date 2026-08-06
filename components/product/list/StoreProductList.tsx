// components/product/store/StoreProductList.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaEllipsisV, FaEdit, FaEye, FaTrash, FaBox, FaStar, FaRegStar, FaEyeSlash, FaStoreSlash } from "react-icons/fa";
import type { ProductWithStore } from "@/modules/product/hooks/useProductList";

interface StoreProductListProps {
  products: ProductWithStore[];
  isOwner?: boolean;
  isStoreOpen?: boolean;
  onEdit?: (product: ProductWithStore) => void;
  onDelete?: (product: ProductWithStore) => void;
  onToggleActive?: (product: ProductWithStore) => void;
  onToggleFeatured?: (product: ProductWithStore) => void;
}

export default function StoreProductList({
  products,
  isOwner = false,
  isStoreOpen = true,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
}: StoreProductListProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  if (!isOwner && !isStoreOpen) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-red-200 bg-gradient-to-b from-white via-red-50/40 to-white px-6 py-16 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 shadow-lg">
          <FaStoreSlash size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Toko Sedang Tutup</h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">Produk sementara tidak tersedia. Silakan kunjungi kembali lain waktu.</p>
      </div>
    );
  }

  const visibleProducts = isOwner ? products : products.filter((product) => product.isActive);

  if (visibleProducts.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-gradient-to-b from-white via-emerald-50/30 to-white px-6 py-16 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 shadow-lg">
          <FaBox size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Belum Ada Produk</h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">Belum ada produk yang tersedia atau tidak ada produk yang sesuai dengan filter yang dipilih.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
      {visibleProducts.map((product) => (
        <div key={product.id} className="group relative overflow-visible rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">
          {/* HIDDEN OVERLAY FULL CARD */}
          {!product.isActive && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/45 backdrop-blur-[2px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl">
                <FaEyeSlash size={28} className="text-red-600" />
              </div>
            </div>
          )}

          {/* IMAGE */}
          <div className="relative aspect-[16/9] rounded-t-2xl bg-slate-100">
            <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
              {product.thumbnailUrl ? (
                <Image src={product.thumbnailUrl} alt={product.name} fill className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <FaBox size={40} className="text-slate-300" />
                </div>
              )}

              {/* FEATURED ICON */}
              {product.isFeatured && (
                <div className={`absolute top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow ${isOwner ? "right-14" : "right-3"}`}>
                  <FaStar size={14} className="text-yellow-400" />
                </div>
              )}
            </div>

            {isOwner ? (
              <>
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === product.id ? null : product.id)}
                  className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
                >
                  <FaEllipsisV size={14} className="text-slate-600" />
                </button>

                {openMenu === product.id && (
                  <div className="absolute right-3 top-12 z-10 w-40 rounded-xl border bg-white p-1 shadow-xl">
                    <Link href={`/store/${product.storeSlug}/${product.slug}`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
                      <FaEye /> Lihat
                    </Link>
                    <button type="button" onClick={() => onEdit?.(product)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
                      <FaEdit /> Edit
                    </button>
                    <button type="button" onClick={() => onToggleFeatured?.(product)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
                      {product.isFeatured ? <FaRegStar className="text-slate-900" /> : <FaStar className="text-yellow-400" />}
                      {product.isFeatured ? "Hapus Unggulan" : "Jadikan Unggulan"}
                    </button>
                    <button type="button" onClick={() => onToggleActive?.(product)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
                      {product.isActive ? <FaEyeSlash /> : <FaEye />}
                      {product.isActive ? "Hidden" : "Aktifkan"}
                    </button>
                    <button type="button" onClick={() => onDelete?.(product)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-600 hover:bg-red-50">
                      <FaTrash /> Hapus
                    </button>
                  </div>
                )}
              </>
            ) : (
              product.isFeatured && (
                <div className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow">
                  <FaStar size={16} className="text-yellow-400" />
                </div>
              )
            )}
          </div>

          {/* CONTENT */}
          <Link href={`/store/${product.storeSlug}/${product.slug}`} className="block p-4 transition hover:bg-slate-50">
            {product.category && (
              <span className="mb-2 inline-flex rounded-md bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                {typeof product.category === "object" ? product.category.name : product.category}
              </span>
            )}
            <h3 className="line-clamp-1 text-sm font-semibold leading-5 text-slate-800">{product.name}</h3>
            <p className="mt-2 text-lg font-bold leading-tight text-emerald-600">{formatPrice(product.price)}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}