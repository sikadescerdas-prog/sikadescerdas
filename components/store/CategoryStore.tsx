// components/store/CategoryStore.tsx

"use client";

import CategoryList from "./category/CategoryList";
import FilterToolbar from "./category/FilterToolbar";
import ProductInfo from "./category/ProductInfo";
import type { SortOption } from "@/shared/types/filter.types";

interface StoreCategory { id: string; name: string; }

interface CategoryStoreProps {
  totalProduk: number;
  categories: StoreCategory[];
  selectedCategory: string;
  selectedSort: SortOption;
  onSort: (value: SortOption) => void;
  onCategoryChange?: (categoryName: string) => void;
}

export default function CategoryStore({ totalProduk, categories, selectedCategory, selectedSort, onSort, onCategoryChange }: CategoryStoreProps) {
  const hasFilter = selectedCategory !== "semua" || selectedSort !== "default";

  function handleCategory(name: string) {
    const value = selectedCategory === name ? "semua" : name;
    onCategoryChange?.(value);
  }

  function handleSort(value: SortOption) {
    onSort(value);
  }

  function handleReset() {
    onCategoryChange?.("semua");
    onSort("default");
  }

  return (
    <>
      <div className="sticky top-15 z-30 border-b border-slate-100 bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <div className="mx-auto max-w-7xl px-3 py-2 sm:px-4 lg:px-6">
          {/* DESKTOP */}
          <div className="hidden md:flex md:flex-col md:gap-3">
            <div className="flex items-start justify-between gap-8">
              <CategoryList categories={categories} activeCategory={selectedCategory} onChange={handleCategory} />
              <FilterToolbar sort={selectedSort} hasFilter={hasFilter} onSortChange={handleSort} onReset={handleReset} />
            </div>

            <div className="border-t border-slate-100">
              <ProductInfo totalProduk={totalProduk} />
            </div>
          </div>

          {/* MOBILE */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex items-center gap-3 border-t border-slate-100 pt-1">
              {/* CATEGORY 85% */}
              <div className="w-[85%] overflow-hidden">
                <CategoryList categories={categories} activeCategory={selectedCategory} onChange={handleCategory} />
              </div>

              {/* PEMBATAS */}
              <div className="h-8 w-px bg-green-200" />

              {/* FILTER 10% */}
              <div className="flex w-[10%] justify-end">
                <FilterToolbar mobile sort={selectedSort} hasFilter={hasFilter} onSortChange={handleSort} onReset={handleReset} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}