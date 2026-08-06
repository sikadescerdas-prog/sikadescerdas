// components/product/form/FormProduct.tsx

"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import HeaderProduct from "./HeaderProduct";
import ThumbnailProduct from "./ThumbnailProduct";
import GeneralProduct from "./GeneralProduct";
import GalleryProduct from "./GalleryProduct";
import SaveProduct from "./SaveProduct";

import type { Product, ProductForm } from "@/modules/product/types/product.types";
import { generateProductSlug } from "@/shared/utils/slug";

interface ProductCategory {
  id: string;
  name: string;
}

interface Props {
  initialData?: Product;
  categories: ProductCategory[];
  onBack: () => void;
  onSubmit: (data: ProductForm) => Promise<void>;
}

const initialForm: ProductForm = {
  categoryId: null,
  name: "",
  slug: "",
  description: "",
  thumbnail: {
    url: null,
    publicId: null,
    file: null,
  },
  images: [],
  price: "",
  stock: "",
  unit: "",
  weight: "",
  isFeatured: false,
  isActive: true,
};

export default function FormProduct({
  initialData,
  categories,
  onBack,
  onSubmit,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(initialForm);

  // =========================
  // INITIAL DATA
  // =========================
  useEffect(() => {
    if (initialData) {
      setForm({
        categoryId: initialData.categoryId ?? null,
        name: initialData.name ?? "",
        slug: initialData.slug ?? "",
        description: initialData.description ?? "",
        thumbnail: {
          url: initialData.thumbnailUrl ?? null,
          publicId: initialData.thumbnailPublicId ?? null,
          file: null,
        },
        images:
          initialData.images?.map((item) => ({
            id: item.id,
            url: item.url,
            publicId: item.publicId ?? null,
            file: null,
          })) ?? [],
        price: String(initialData.price ?? ""),
        stock: String(initialData.stock ?? ""),
        unit: initialData.unit ?? "",
        weight:
          initialData.weight !== null && initialData.weight !== undefined
            ? String(initialData.weight)
            : "",
        isFeatured: initialData.isFeatured ?? false,
        isActive: initialData.isActive ?? true,
      });

      setThumbnailPreview(initialData.thumbnailUrl ?? null);
    } else {
      setForm({
        ...initialForm,
        thumbnail: {
          ...initialForm.thumbnail,
        },
        images: [],
      });

      setThumbnailPreview(null);
    }
  }, [initialData]);

  // =========================
  // FIELD UPDATE
  // =========================
  function updateField<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // =========================
  // NAME
  // =========================
  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: value.trim() ? generateProductSlug(value) : "",
    }));
  }

  // =========================
  // THUMBNAIL
  // =========================
  function handleThumbnail(file: File) {
    setThumbnailPreview(URL.createObjectURL(file));

    setForm((prev) => ({
      ...prev,
      thumbnail: {
        ...prev.thumbnail,
        file,
      },
    }));
  }

  function removeThumbnail() {
    setThumbnailPreview(null);

    setForm((prev) => ({
      ...prev,
      thumbnail: {
        url: null,
        publicId: null,
        file: null,
      },
    }));
  }

  // =========================
  // GALLERY
  // =========================
  function addImage(file: File) {
    if (form.images.length >= 10) {
      Swal.fire({
        icon: "warning",
        title: "Maksimal 10 foto",
        text: "Produk maksimal memiliki 10 foto.",
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url: URL.createObjectURL(file),
          publicId: null,
          file,
        },
      ],
    }));
  }

  function updateImage(index: number, file: File) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((item, i) =>
        i === index
          ? {
              ...item,
              url: URL.createObjectURL(file),
              file,
              publicId: null,
            }
          : item
      ),
    }));
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  // =========================
  // NUMBER
  // =========================
  function handleNumberChange(
    field: "price" | "stock" | "weight",
    value: string
  ) {
    let numericValue = value.replace(/[^\d,]/g, "");

    if (field !== "weight") {
      numericValue = numericValue.replace(/,/g, "");
    }

    updateField(field, numericValue);
  }

  // =========================
  // SUBMIT
  // =========================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.slug.trim() ||
      !form.categoryId ||
      (!form.thumbnail.file && !form.thumbnail.url)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Nama produk, kategori, dan thumbnail wajib diisi.",
      });
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Harga belum diisi",
        text: "Masukkan harga produk.",
      });
      return;
    }

    if (!form.stock) {
      Swal.fire({
        icon: "warning",
        title: "Stok belum diisi",
        text: "Masukkan stok produk.",
      });
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        ...form,
        images: form.images.slice(0, 10),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white">
      <HeaderProduct isEdit={!!initialData} onBack={onBack} />

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ThumbnailProduct
              imageUrl={form.thumbnail.url}
              previewUrl={thumbnailPreview}
              onFileSelect={handleThumbnail}
              onDeleteImage={removeThumbnail}
            />
          </div>

          <div className="lg:col-span-2">
            <GalleryProduct
              images={form.images}
              onAdd={addImage}
              onUpdate={updateImage}
              onDelete={removeImage}
            />
          </div>
        </div>

        <GeneralProduct
          name={form.name}
          slug={form.slug}
          categoryId={form.categoryId}
          categories={categories}
          price={form.price}
          stock={form.stock}
          unit={form.unit}
          weight={form.weight}
          description={form.description}
          onNameChange={handleNameChange}
          onCategoryChange={(value) => updateField("categoryId", value || null)}
          onPriceChange={(value) => handleNumberChange("price", value)}
          onStockChange={(value) => handleNumberChange("stock", value)}
          onUnitChange={(value) => updateField("unit", value)}
          onWeightChange={(value) => handleNumberChange("weight", value)}
          onDescriptionChange={(value) => updateField("description", value)}
        />

        <SaveProduct loading={loading} editMode={!!initialData} />
      </form>
    </div>
  );
}