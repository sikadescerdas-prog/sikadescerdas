// modules/store/hooks/useStoreList.ts

"use client";

import { useCallback, useEffect, useState } from "react";

export interface StoreProduct {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  price: number;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  category?: { id: string; name: string; } | null;
}

export interface StoreWithProducts {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  phone: string | null;
  email: string | null;
  province: string | null;
  regency: string | null;
  district: string | null;
  village: string | null;
  address: string | null;
  isStoreComplete: boolean;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products: StoreProduct[];
}

interface StoreListResponse {
  data: StoreWithProducts[];
}

export function useStoreList() {
  const [stores, setStores] = useState<StoreWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/store", { cache: "no-store" });
      const json: StoreListResponse = await res.json();

      if (!res.ok) {
        throw new Error("Gagal mengambil data toko");
      }

      setStores(json.data ?? []);
    } catch (error) {
      console.error("FETCH STORES ERROR:", error);
      setStores([]);
      setError(error instanceof Error ? error.message : "Gagal mengambil data toko");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return {
    stores,
    loading,
    error,
    refresh: fetchStores,
  };
}