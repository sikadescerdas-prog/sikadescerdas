// modules/dashboard/structure/hooks/useCategories.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import { getCategories } from "../services/category.service";
import type { StructureCategory } from "../types/structure.types";

export function useCategories() {
  const [categories, setCategories] = useState<StructureCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getCategories();

      setCategories(result.data ?? []);
    } catch (err) {
      console.error("FETCH CATEGORIES ERROR:", err);

      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refreshCategories: fetchCategories,
  };
}