// modules/product/hooks/useStoreProducts.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types/product.types";
import type { SortOption } from "@/shared/types/filter.types";

export type StoreProduct = Product & { storeSlug: string; storeName: string; storeCity?: string; logoUrl?: string | null; };

export function useStoreProducts(
  storeId?: string,
  category?: string,
  sort: SortOption = "default",
  isOwner?: boolean // <-- 1. Tambahkan parameter isOwner di sini
) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!storeId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("storeId", storeId);

      if (category && category !== "semua") {
        params.set("category", category);
      }

      if (sort && sort !== "default") {
        params.set("sort", sort);
      }

      // 2. Kirim parameter isOwner=true ke backend jika statusnya pemilik toko
      if (isOwner) {
        params.set("isOwner", "true");
      }

      const response = await fetch(`/api/product?${params.toString()}`, { cache: "no-store" });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message ?? "Gagal mengambil produk toko");
      }

      const data = json.data ?? [];
      const result = data.map((product: any) => ({
        id: String(product.id),
        storeId: String(product.store_id),
        categoryId: product.category_id ? String(product.category_id) : null,
        category: product.product_categories ?? null,
        name: product.name,
        slug: product.slug,
        description: product.description ?? null,
        thumbnailUrl: product.thumbnail_url ?? null,
        thumbnailPublicId: product.thumbnail_public_id ?? null,
        price: Number(product.price ?? 0),
        stock: Number(product.stock ?? 0),
        unit: product.unit ?? null,
        weight: product.weight ? Number(product.weight) : null,
        isFeatured: product.is_featured ?? false,
        isActive: product.is_active ?? false,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        images: product.product_images?.map((image: any) => ({ id: String(image.id), url: image.image_url, publicId: image.image_public_id })) ?? [],
        storeSlug: product.stores?.slug ?? "",
        storeName: product.stores?.name ?? "",
        storeCity: product.stores?.regency ?? "",
        logoUrl: product.stores?.logo_url ?? null,
      }));

      setProducts(result);
    } catch (error) {
      console.error("FETCH STORE PRODUCT ERROR:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [storeId, category, sort, isOwner]); // 3. Masukkan isOwner ke dalam dependency array

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refresh: fetchProducts };
}