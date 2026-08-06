// components/dashboard/potential/list/FormPotential.tsx

"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Swal from "sweetalert2";
import { usePotentialCategories } from "@/modules/dashboard/potential/hooks/useCategories";
import ThumbnailPotential from "./ThumbnailPotential";
import type { Potential, PotentialForm } from "@/modules/dashboard/potential/types/potential.types";

interface Props {
  initialData?: Potential;
  onBack: () => void;
  onSubmit: (data: PotentialForm) => Promise<void>;
  onDeleteImage?: (publicId: string | null) => Promise<void>;
}

export default function FormPotential({ initialData, onBack, onSubmit, onDeleteImage }: Props) {
  const { categories } = usePotentialCategories();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState<PotentialForm>({
    category_id: "",
    name: "",
    description: null,
    image: { url: null, publicId: null, file: null },
    address: null,
    link_maps: null,
    website: null,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        category_id: initialData.category_id,
        name: initialData.name,
        description: initialData.description,
        image: { url: initialData.image_url, publicId: initialData.image_public_id, file: null },
        address: initialData.address,
        link_maps: initialData.link_maps,
        website: initialData.website,
      });
      setImagePreview(initialData.image_url);
    } else {
      setForm({
        category_id: "",
        name: "",
        description: null,
        image: { url: null, publicId: null, file: null },
        address: null,
        link_maps: null,
        website: null,
      });
      setImagePreview(null);
    }
  }, [initialData]);

  function handleChange(field: "category_id" | "name" | "description" | "address" | "link_maps" | "website", value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImageUpload(file: File) {
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setForm((prev) => ({ ...prev, image: { ...prev.image, file } }));
  }

  async function handleDeleteImage() {
    if (form.image.publicId && onDeleteImage) {
      await onDeleteImage(form.image.publicId);
    }
    setImagePreview(null);
    setForm((prev) => ({ ...prev, image: { url: null, publicId: null, file: null } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.category_id || !form.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Kategori dan nama potensi wajib diisi",
      });
      return;
    }

    try {
      setLoading(true);
      await onSubmit(form);
      onBack();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <button type="button" onClick={onBack} className="rounded-lg border p-2 hover:bg-gray-50">
          <ArrowLeft size={18} />
        </button>

        <div>
          <h3 className="font-semibold text-gray-900">{initialData ? "Edit Potensi Desa" : "Tambah Potensi Desa"}</h3>
          <p className="text-sm text-gray-500">Kelola data potensi desa</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        {/* IMAGE + FORM */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_1fr]">
          <ThumbnailPotential
            imageUrl={form.image.url}
            previewUrl={imagePreview}
            onFileSelect={handleImageUpload}
            onDeleteImage={handleDeleteImage}
          />

          <div className="space-y-5">
            {/* CATEGORY */}
            <div>
              <label className="mb-2 block text-sm font-medium">Kategori</label>
              <select
                value={form.category_id}
                onChange={(e) => handleChange("category_id", e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
              >
                <option value="">Pilih kategori</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium">Nama Potensi</label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Contoh: Wisata Alam"
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="mb-2 block text-sm font-medium">Deskripsi</label>
          <textarea
            value={form.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Deskripsi isi potensi desa"
            rows={4}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        {/* ADDRESS + MAPS + WEBSITE */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">Alamat</label>
            <input
              value={form.address ?? ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Alamat Potensi"
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Link Maps</label>
            <input
              value={form.link_maps ?? ""}
              onChange={(e) => handleChange("link_maps", e.target.value)}
              placeholder="https://maps.google.com"
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Website</label>
            <input
              value={form.website ?? ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-end border-t pt-5">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "Menyimpan..." : initialData ? "Perbarui" : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}