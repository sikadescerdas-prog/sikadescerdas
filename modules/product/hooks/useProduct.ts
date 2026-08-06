// modules/product/hooks/useProduct.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product, ProductForm, ProductFilter } from "../types/product.types";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../services/product.service";
import { uploadImage, deleteImage } from "@/shared/services/upload.service";
import { sweet } from "@/shared/utils/sweet";
import { useTableQuery } from "@/shared/hooks/useTableQuery";
import { usePagination } from "@/shared/hooks/usePagination";

export function useProduct(enableTable = true) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null);
  const [storeLoading, setStoreLoading] = useState(true);

  const table = enableTable ? useTableQuery({ defaultSearch: "", defaultCategory: "", defaultPage: 1, defaultLimit: 10 }) : null;
  const pagination = enableTable ? usePagination({ page: 1, limit: 10 }) : null;

  useEffect(() => {
    async function fetchStore() {
      try {
        const res = await fetch("/api/store", { cache: "no-store" });
        const json = await res.json();
        const store = Array.isArray(json.data) ? json.data[0] : json.data;

        if (store?.id) {
          setCurrentStoreId(String(store.id));
        }
      } catch (error) {
        console.error("FETCH STORE ERROR:", error);
      } finally {
        setStoreLoading(false);
      }
    }

    fetchStore();
  }, []);

  const fetchProducts = useCallback(async (customFilter?: Partial<ProductFilter>) => {
    if (!enableTable || !table || !pagination) return;

    try {
      setLoading(true);

      // Tambahkan storeId dan isOwner=true agar backend mengizinkan produk is_active: false milik toko ini ikut tampil
      const params: any = {
        search: table.search,
        category: table.category || undefined,
        page: customFilter?.page ?? table.page,
        limit: table.limit,
        isOwner: "true",
      };

      if (currentStoreId) {
        params.storeId = currentStoreId;
      }

      const result = await getProducts(params);

      setProducts(result.data);
      pagination.setPagination(result.pagination);
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);
      setProducts([]);
      pagination.resetPagination();
    } finally {
      setLoading(false);
    }
  }, [enableTable, table, pagination, currentStoreId]);

  useEffect(() => {
    if (enableTable && !storeLoading) {
      fetchProducts();
    }
  }, [enableTable, storeLoading, fetchProducts]);

  function createSlug(value: string) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function saveProduct(data: ProductForm, id?: string) {
    try {
      if (storeLoading) throw new Error("Sedang mengambil data toko");
      if (!currentStoreId) throw new Error("Toko belum tersedia");

      setIsSaving(true);
      sweet.loading({ title: "Menyimpan...", text: "Mengunggah gambar dan menyimpan produk" });

      let existingProduct: Product | null = null;
      if (id) {
        existingProduct = await getProductById(id);
      }

      let thumbnailUrl = data.thumbnail.url;
      let thumbnailPublicId = data.thumbnail.publicId;
      let newThumbnailUploaded = false;

      if (data.thumbnail.file) {
        const uploaded = await uploadImage(data.thumbnail.file, "products/thumbnail", `${createSlug(data.name)}-${crypto.randomUUID().split("-")[0]}`, "banner");
        thumbnailUrl = uploaded.url;
        thumbnailPublicId = uploaded.publicId;
        newThumbnailUploaded = true;
      }

      if (!thumbnailUrl) throw new Error("Thumbnail produk wajib diunggah");

      const images: { url: string; publicId: string | null }[] = [];

      for (const item of data.images) {
        if (item.file) {
          const uploaded = await uploadImage(item.file, "products/gallery", `${createSlug(data.name)}-${crypto.randomUUID().split("-")[0]}`, "banner");
          images.push({ url: uploaded.url, publicId: uploaded.publicId });
        } else if (item.url) {
          images.push({ url: item.url, publicId: item.publicId });
        }
      }

      const payload = {
        storeId: currentStoreId,
        categoryId: data.categoryId,
        name: data.name,
        slug: id && data.slug ? `${createSlug(data.name)}-${data.slug.split("-").pop()}` : `${createSlug(data.name)}-${crypto.randomUUID().split("-")[0]}`,
        description: data.description || null,
        thumbnailUrl,
        thumbnailPublicId,
        price: Number(data.price),
        stock: Number(data.stock),
        unit: data.unit || null,
        weight: data.weight === "" ? null : Number(data.weight),
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        images,
      };

      let savedProduct: Product | null = null;

      if (!id) {
        savedProduct = await createProduct(payload);
      } else {
        savedProduct = await updateProduct(id, payload);

        const oldGalleryIds = existingProduct?.images?.map(item => item.publicId).filter((id): id is string => Boolean(id)) ?? [];
        const newGalleryIds = images.map(item => item.publicId).filter((id): id is string => Boolean(id));
        const deletedGalleryIds = oldGalleryIds.filter(id => !newGalleryIds.includes(id));

        for (const publicId of deletedGalleryIds) {
          await deleteImage(publicId);
        }

        if (newThumbnailUploaded && existingProduct?.thumbnailPublicId && existingProduct.thumbnailPublicId !== thumbnailPublicId) {
          await deleteImage(existingProduct.thumbnailPublicId);
        }
      }

      sweet.close();
      sweet.success({ title: "Berhasil", text: id ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan" });

      if (enableTable) {
        await fetchProducts();
      }

      return savedProduct;
    } catch (error) {
      sweet.close();
      sweet.error({ title: "Gagal", text: error instanceof Error ? error.message : "Gagal menyimpan produk" });
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function removeProduct(id: string) {
    try {
      sweet.loading({ title: "Menghapus...", text: "Menghapus gambar dan produk" });

      const product = await getProductById(id);

      if (product.thumbnailPublicId) {
        await deleteImage(product.thumbnailPublicId);
      }

      for (const image of product.images) {
        if (image.publicId) {
          await deleteImage(image.publicId);
        }
      }

      await deleteProduct(id);

      sweet.close();
      sweet.success({ title: "Berhasil", text: "Produk berhasil dihapus" });

      if (enableTable) {
        await fetchProducts();
      }
    } catch (error) {
      sweet.close();
      sweet.error({ title: "Gagal", text: error instanceof Error ? error.message : "Gagal menghapus produk" });
    }
  }

  return {
    products,
    loading,
    isSaving,
    currentStoreId,
    storeLoading,
    table,
    pagination,
    saveProduct,
    removeProduct,
    refresh: fetchProducts,
  };
}