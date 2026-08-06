// modules/product/hooks/useCategoryList.ts

"use client";

import { useCallback, useEffect, useState } from "react";

export interface ProductCategory { id: string; name: string; }
interface CategoryResponse { code: string; message: string; categories: ProductCategory[]; }

export function useCategoryList() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/product/categories", { cache: "no-store" });
      const json: CategoryResponse = await response.json();

      if (!response.ok) throw new Error(json.message ?? "Gagal mengambil kategori");

      setCategories(Array.isArray(json.categories) ? json.categories : []);
    } catch (error) {
      console.error("FETCH CATEGORY ERROR:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  return { categories, loading, refresh: fetchCategories };
}