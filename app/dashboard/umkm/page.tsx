// app/dashboard/umkm/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useUMKM } from "@/modules/dashboard/umkm/hooks/useUMKM";
import UMKMHeader from "@/components/dashboard/umkm/UMKMHeader";
import UMKMList from "@/components/dashboard/umkm/UMKMList";
import ProductList from "@/components/dashboard/umkm/ProductList";

export default function UMKMPage() {
  const { stores, products, loading } = useUMKM();
  const searchParams = useSearchParams();
  const selectedOwnerUid = searchParams.get("id");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-900" />
      </div>
    );
  }

  const filteredProducts = selectedOwnerUid
    ? products.filter((p) => p.ownerUid === selectedOwnerUid)
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <UMKMHeader stores={stores} products={products} />

      <div className="p-6">
        {selectedOwnerUid ? (
          <ProductList products={filteredProducts} />
        ) : stores.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Belum ada data toko UMKM yang terdaftar.
          </div>
        ) : (
          <UMKMList stores={stores} products={products} />
        )}
      </div>
    </div>
  );
}