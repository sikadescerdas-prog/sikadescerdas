// components/store/StorePageClient.tsx

"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Store, ShoppingBag } from "lucide-react";
import HeaderStore from "@/components/store/HeaderStore";
import ListStore from "@/components/store/list/ListStore";
import ListProduct from "@/components/product/list/ListProduct";
import CategoryStore from "@/components/store/CategoryStore";
import { useProductList } from "@/modules/product/hooks/useProductList";
import { useCategoryList } from "@/modules/product/hooks/useCategoryList";
import type { SortOption } from "@/shared/types/filter.types";

type Tab = "product" | "store";

export default function StorePageClient() {
  const searchParams = useSearchParams();
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();

  const [tab, setTab] = useState<Tab>("product");
  const [category, setCategory] = useState("semua");
  const [sort, setSort] = useState<SortOption>("default");

  const { products, loading } = useProductList();
  const { categories } = useCategoryList();

  const filteredProducts = useMemo(() => {
    let result = products.filter((item) => {
      const isStoreActive = (item as any).store?.is_active ?? (item as any).is_store_active ?? true;
      return isStoreActive;
    });

    if (search) {
      result = result.filter((item) => {
        const keyword = search.toLowerCase();
        return item.name.toLowerCase().includes(keyword) || item.storeName.toLowerCase().includes(keyword);
      });
    }

    if (category !== "semua") {
      result = result.filter((item) => item.category?.name === category);
    }

    if (sort === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (sort === "oldest") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, products, category, sort]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="animate-fade-up">
        <HeaderStore />
      </div>

      <section className="mx-auto w-full max-w-7xl">
        <div className="flex w-full flex-col gap-5 px-4 pt-6 md:flex-row md:items-center md:justify-between md:pl-10 md:pr-4">
          <div className="animate-fade-slide">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-700 shadow-lg shadow-emerald-200/60 animate-bounce-slow">
                {tab === "product" ? <ShoppingBag size={23} className="text-white" /> : <Store size={23} className="text-white" />}
              </div>

              <div>
                <h1 className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
                  {tab === "product" ? "Daftar Produk" : "Daftar Toko"}
                </h1>
                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                  {tab === "product" ? "Temukan produk UMKM terbaik dari warga desa" : "Jelajahi toko lokal dan produk unggulan desa"}
                </p>
              </div>
            </div>
          </div>

          <div className="animate-fade-slide-delay flex justify-start md:justify-end">
            <div className="inline-flex w-full rounded-full border border-emerald-100 bg-white p-1 shadow-lg shadow-emerald-100/50 backdrop-blur-md md:w-auto">
              <button
                onClick={() => setTab("product")}
                className={`relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 md:min-w-[150px] ${
                  tab === "product" ? "bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 text-white shadow-md shadow-emerald-200" : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                <ShoppingBag size={17} className="relative z-10" />
                <span className="relative z-10">Produk</span>
              </button>

              <button
                onClick={() => setTab("store")}
                className={`relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 md:min-w-[150px] ${
                  tab === "store" ? "bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 text-white shadow-md shadow-emerald-200" : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                <Store size={17} className="relative z-10" />
                <span className="relative z-10">Toko</span>
              </button>
            </div>
          </div>
        </div>

        {tab === "product" && (
          <div className="mt-6">
            <CategoryStore
              totalProduk={filteredProducts.length}
              categories={categories}
              selectedCategory={category}
              selectedSort={sort}
              onCategoryChange={setCategory}
              onSort={setSort}
            />
          </div>
        )}

        <div className="mt-5 px-3 pb-8 sm:px-6 lg:pb-16">
          {tab === "product" ? (
            loading ? (
              <div className="py-10 text-center text-slate-500">Loading produk...</div>
            ) : (
              <ListProduct
                products={filteredProducts}
                categories={categories}
                category={category}
                sort={sort}
              />
            )
          ) : (
            <ListStore />
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out;
        }
      `}</style>
    </main>
  );
}