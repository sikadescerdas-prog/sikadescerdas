// modules/dashboard/hooks/useUMKM.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import type { Store, UMKMProduct } from "../types/umkm.types";

export function useUMKM() {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<UMKMProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/dashboard/umkm");
      
      if (!response.ok) {
        throw new Error("Gagal mengambil data UMKM dari server");
      }

      const data = await response.json();

      setStores(data.stores || []);
      setProducts(data.products || []);
    } catch (err) {
      console.error("useUMKM error:", err);
      setStores([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stores,
    products,
    loading,
    refetch: fetchData,
  };
}