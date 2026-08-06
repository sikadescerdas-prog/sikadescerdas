// app/store/[slug]/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { ProductWithStore } from "@/modules/product/hooks/useProductList";
import HeaderStoreDetail, { StoreData } from "@/components/store/HeaderStoreDetail";
import CategoryStore from "@/components/store/CategoryStore";
import StoreProductList from "@/components/product/list/StoreProductList";
import { sweet } from "@/shared/utils/sweet";
import type { SortOption } from "@/shared/types/filter.types";
import { useStoreProducts } from "@/modules/product/hooks/useStoreProducts";

interface StoreCategory {
  id: string;
  name: string;
}

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug = params?.slug as string;
  const category = searchParams.get("category") ?? "semua";
  const sort = (searchParams.get("sort") ?? "default") as SortOption;
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();

  const [store, setStore] = useState<StoreData | null>(null);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const { products } = useStoreProducts(store?.id, category, sort, isOwner);
  
  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter((product) => product.name.toLowerCase().includes(search));
  }, [products, search]);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [storeResponse, categoryResponse] = await Promise.all([
          fetch(`/api/store/${slug}`, { cache: "no-store" }),
          fetch("/api/product/categories", { cache: "no-store" }),
        ]);

        const storeData = await storeResponse.json();
        const categoryData = await categoryResponse.json();

        if (!storeResponse.ok) throw new Error(storeData?.message ?? "Gagal mengambil data toko.");
        if (!categoryResponse.ok) throw new Error(categoryData?.message ?? "Gagal mengambil kategori.");

        setStore(storeData.store);
        setCategories(categoryData.categories ?? []);
        setIsStoreOpen(storeData.store?.is_active ?? storeData.store?.isActive ?? false);
        setIsOwner(storeData.store?.is_owner ?? storeData.isOwner ?? false);
      } catch (err) {
        console.error("[STORE_PAGE_ERROR]", err);
        setError(err instanceof Error ? err.message : "Gagal mengambil data toko.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const handleToggleActive = async (product: ProductWithStore) => {
    const confirm = await sweet.confirm({
      title: product.isActive ? "Sembunyikan Produk?" : "Aktifkan Produk?",
      text: product.isActive ? `Produk ${product.name} akan disembunyikan dari pengunjung.` : `Produk ${product.name} akan ditampilkan kembali.`,
      confirmButtonText: product.isActive ? "Ya, Sembunyikan" : "Ya, Aktifkan",
      cancelText: "Batal",
      icon: "warning",
    });

    if (!confirm) return;

    try {
      const response = await fetch(`/api/product/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message ?? "Gagal mengubah status produk");

      await sweet.success({ title: product.isActive ? "Produk Disembunyikan" : "Produk Diaktifkan" });
      window.location.reload();
    } catch (error) {
      await sweet.error({ title: "Gagal", text: error instanceof Error ? error.message : "Terjadi kesalahan" });
    }
  };

  const handleToggleFeatured = async (product: ProductWithStore) => {
    const confirm = await sweet.confirm({
      title: product.isFeatured ? "Hapus Produk Unggulan?" : "Jadikan Produk Unggulan?",
      text: product.isFeatured ? `Produk ${product.name} akan dihapus dari daftar unggulan.` : `Produk ${product.name} akan dijadikan produk unggulan.`,
      confirmButtonText: product.isFeatured ? "Ya, Hapus" : "Ya, Jadikan Unggulan",
      cancelText: "Batal",
      icon: "warning",
    });

    if (!confirm) return;

    try {
      const response = await fetch(`/api/product/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !product.isFeatured }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message ?? "Gagal mengubah status unggulan");

      await sweet.success({
        title: product.isFeatured ? "Unggulan Dihapus" : "Produk Menjadi Unggulan",
        text: product.isFeatured ? "Produk berhasil dihapus dari unggulan." : "Produk berhasil dijadikan unggulan.",
      });

      window.location.reload();
    } catch (error) {
      await sweet.error({ title: "Gagal", text: error instanceof Error ? error.message : "Terjadi kesalahan" });
    }
  };

  const handleDelete = async (product: ProductWithStore) => {
    const confirm = await sweet.confirm({
      title: "Hapus Produk?",
      text: `Produk ${product.name} akan dihapus.`,
      confirmButtonText: "Ya, Hapus",
      cancelText: "Batal",
      icon: "warning",
    });

    if (!confirm) return;

    try {
      const response = await fetch(`/api/product/${product.id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) throw new Error(data?.message ?? "Gagal menghapus produk");

      await sweet.success({ title: "Berhasil", text: "Produk berhasil dihapus" });
      window.location.reload();
    } catch (error) {
      await sweet.error({ title: "Gagal", text: error instanceof Error ? error.message : "Terjadi kesalahan" });
    }
  };

  const handleSort = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "default") params.delete("sort");
    else params.set("sort", value);

    router.replace(`/store/${slug}?${params.toString()}`, { scroll: false });

    setTimeout(() => {
      document.getElementById("store-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCategoryChange = (categoryName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!categoryName || categoryName === "semua") params.delete("category");
    else params.set("category", categoryName);

    router.replace(`/store/${slug}?${params.toString()}`, { scroll: false });

    setTimeout(() => {
      document.getElementById("store-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleToggleStore = async () => {
    if (!store || !isOwner) return;

    const willOpen = !isStoreOpen;
    const confirmed = await sweet.confirm({
      title: willOpen ? "Buka Toko?" : "Tutup Toko?",
      text: willOpen ? "Toko akan ditampilkan sebagai toko yang sedang buka." : "Toko akan ditampilkan sebagai toko yang sedang tutup.",
      confirmButtonText: willOpen ? "Ya, Buka Toko" : "Ya, Tutup Toko",
      cancelText: "Batal",
      icon: "warning",
    });

    if (!confirmed) return;

    try {
      sweet.loading({ title: "Memproses...", text: willOpen ? "Sedang membuka toko..." : "Sedang menutup toko..." });

      const response = await fetch(`/api/store/${store.slug}/toggle`, { method: "PATCH" });
      const data = await response.json();

      if (!response.ok) throw new Error(data?.message ?? "Gagal mengubah status toko.");

      const active = data.store?.is_active ?? data.store?.isActive ?? false;
      setIsStoreOpen(active);
      setStore((prev) => (prev ? { ...prev, is_active: active } : prev));

      await sweet.success({
        title: active ? "Toko Dibuka" : "Toko Ditutup",
        text: active ? "Toko berhasil dibuka." : "Toko berhasil ditutup.",
      });
    } catch (err) {
      await sweet.error({ title: "Gagal", text: err instanceof Error ? err.message : "Gagal mengubah status toko." });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="animate-pulse">
          <div className="h-64 bg-slate-200" />
          <div className="px-4 -mt-10">
            <div className="h-40 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-700">Toko tidak ditemukan</h1>
          <p className="mt-2 text-sm text-slate-400">{error || "Data toko tidak tersedia."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <HeaderStoreDetail
        toko={store}
        isStoreOpen={isStoreOpen}
        isOwner={isOwner}
        onToggleStore={isOwner ? handleToggleStore : undefined}
      />

      {(isStoreOpen || isOwner) && (
        <CategoryStore
          totalProduk={filteredProducts.length}
          categories={categories}
          selectedCategory={category}
          selectedSort={sort}
          onSort={handleSort}
          onCategoryChange={handleCategoryChange}
        />
      )}

      <section id="store-products" className="scroll-mt-[120px] px-4 py-6 lg:pb-16">
        <StoreProductList
          products={filteredProducts}
          isOwner={isOwner}
          isStoreOpen={isStoreOpen}
          onEdit={(product) => router.push(`/product/form?edit=${product.slug}`)}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onToggleFeatured={handleToggleFeatured}
        />
      </section>
    </main>
  );
}