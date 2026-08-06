// components/product/list/ListProduct.tsx

"use client";

import { FaBox } from "react-icons/fa";
import ProductCard from "@/components/product/card/ProductCard";
import type { ProductWithStore } from "@/modules/product/hooks/useProductList";

interface Category {
  id: string;
  name: string;
}

interface ListProductProps {
  products: ProductWithStore[];
  categories?: Category[];
  category: string;
  sort: string;
}

export default function ListProduct({
  products,
  category,
  sort,
}: ListProductProps) {
  const filteredProducts = [...products]
    .filter((product: any) => {
      if (category === "semua") {
        return true;
      }

      return (
        product.category?.id === category ||
        product.product_categories?.id === category
      );
    })
    .sort((a, b) => {
      if (sort === "harga_asc") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "harga_desc") {
        return Number(b.price) - Number(a.price);
      }

      if (sort === "terbaru") {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }

      return 0;
    });

  if (filteredProducts.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-gradient-to-b from-white via-emerald-50/30 to-white px-6 py-16 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 shadow-lg">
          <FaBox size={40} className="text-emerald-600" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800">
          Belum Ada Produk
        </h2>

        <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
          Belum ada produk yang tersedia atau tidak ada produk
          yang sesuai dengan filter yang dipilih.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showStoreName={true}
        />
      ))}
    </div>
  );
}