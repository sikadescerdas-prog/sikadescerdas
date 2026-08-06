// app/store/[slug]/[productSlug]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductDetail from "@/components/product/detail/ProductDetail";
import RelatedProducts from "@/components/product/detail/RelatedProducts";
import { sweet } from "@/shared/utils/sweet";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const storeSlug = params.slug as string;
  const productSlug = params.productSlug as string;

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productSlug) return;
    fetchProduct();
  }, [productSlug]);

  async function fetchProduct() {
    try {
      setLoading(true);
      const res = await fetch(`/api/product/${productSlug}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Produk tidak ditemukan");

      setProduct(json.data);

      if (json.data.storeId) {
        fetchRelatedProducts(json.data.storeId, json.data.id);
      }
    } catch (err: any) {
      sweet.error(err?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRelatedProducts(storeId: string, productId: string) {
    try {
      const res = await fetch(`/api/product/related?storeId=${storeId}&productId=${productId}`);
      const json = await res.json();

      if (res.ok) {
        setRelatedProducts(json.data ?? []);
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">Memuat produk...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">Produk tidak ditemukan.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 md:px-8">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 active:scale-95"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>

        <ProductDetail product={product} storeSlug={storeSlug} />

        <RelatedProducts products={relatedProducts} />
      </div>
    </main>
  );
}