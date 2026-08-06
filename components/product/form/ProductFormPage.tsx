// components/product/form/ProductFormPage.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

import FormProduct from "@/components/product/form/FormProduct";
import { useProduct } from "@/modules/product/hooks/useProduct";

import type {
  Product,
  ProductForm,
} from "@/modules/product/types/product.types";

interface ProductCategory {
  id: string;
  name: string;
}

export default function ProductFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editSlug = searchParams.get("edit");

  const { saveProduct } = useProduct(false);

  const [initialData, setInitialData] = useState<Product>();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        const categoryResponse = await fetch(
          "/api/product/categories",
          { cache: "no-store" }
        );

        const categoryJson = await categoryResponse.json();

        if (!cancelled) {
          setCategories(
            Array.isArray(categoryJson)
              ? categoryJson
              : categoryJson.categories ?? []
          );
        }

        if (editSlug) {
          const response = await fetch(
            `/api/product/${editSlug}`,
            {
              cache: "no-store",
            }
          );

          const json = await response.json();

          if (!response.ok) {
            throw new Error(
              json.message ?? "Produk tidak ditemukan"
            );
          }

          if (!cancelled) {
            setInitialData(json.data);
          }
        }
      } catch (error) {
        console.error("LOAD PRODUCT ERROR:", error);

        if (!cancelled) {
          Swal.fire({
            icon: "error",
            title: "Gagal memuat data",
            text:
              error instanceof Error
                ? error.message
                : "Terjadi kesalahan",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [editSlug]);

  async function handleSubmit(data: ProductForm) {
    try {
      await saveProduct(
        data,
        initialData?.id
      );

      await Swal.fire({
        icon: "success",
        title: initialData
          ? "Produk diperbarui"
          : "Produk ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/store");
    } catch (error) {
      console.error("SAVE PRODUCT ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan",
      });
    }
  }

  function handleBack() {
    router.push("/dashboard/product");
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-gray-500">
            Memuat data produk...
          </p>
        </div>
      </div>
    );
  }

  return (
    <FormProduct
      initialData={initialData}
      categories={categories}
      onBack={handleBack}
      onSubmit={handleSubmit}
    />
  );
}