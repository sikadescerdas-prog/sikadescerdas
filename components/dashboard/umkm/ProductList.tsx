// components/dashboard/umkm/ProductList.tsx

"use client";

import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import type { UMKMProduct } from "@/modules/dashboard/umkm/types/umkm.types";

type Props = {
  products?: UMKMProduct[];
};

export default function ProductList({ products }: Props) {
  const router = useRouter();
  const safeProducts = products ?? [];

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 transition hover:text-black"
        >
          <FaArrowLeft /> Kembali
        </button>

        <h1 className="text-lg font-semibold">Daftar Produk UMKM</h1>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Produk</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-right">Harga</th>
            </tr>
          </thead>

          <tbody>
            {safeProducts.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                {/* PRODUCT */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image?.url || "/placeholder.png"}
                      className="h-10 w-10 rounded-lg border object-cover"
                      alt={product.name || "product"}
                    />
                    <p className="font-semibold">{product.name || "Tanpa Nama"}</p>
                  </div>
                </td>

                {/* CATEGORY */}
                <td className="p-3 text-gray-600">{product.category || "-"}</td>

                {/* PRICE */}
                <td className="p-3 text-right">
                  {product.price !== undefined ? `Rp ${product.price.toLocaleString()}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {safeProducts.length === 0 && <p className="mt-6 text-left text-gray-500">Tidak ada produk</p>}
      </div>
    </div>
  );
}