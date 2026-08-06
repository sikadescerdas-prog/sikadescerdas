// components/dashboard/facility/list/FormFacility.tsx

"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Swal from "sweetalert2";

import { useFacilityCategories } from "@/modules/dashboard/facility/hooks/useCategories";
import { useFacilityTypes } from "@/modules/dashboard/facility/hooks/useTypes";
import ThumbnailFacility from "./ThumbnailFacility";

import type {
  Facility,
  FacilityForm,
} from "@/modules/dashboard/facility/types/facility.types";

interface Props {
  initialData?: Facility;
  onBack: () => void;
  onSubmit: (data: FacilityForm) => Promise<void>;
  onDeleteImage?: (publicId: string | null) => Promise<void>;
}

export default function FormFacility({
  initialData,
  onBack,
  onSubmit,
  onDeleteImage,
}: Props) {
  const { categories } = useFacilityCategories();
  const { types } = useFacilityTypes();

  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState<FacilityForm>({
    type_id: "",
    name: "",
    image: {
      url: null,
      publicId: null,
      file: null,
    },
    address: null,
    link_maps: null,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        type_id: initialData.type_id,
        name: initialData.name,
        image: {
          url: initialData.image_url,
          publicId: initialData.image_public_id,
          file: null,
        },
        address: initialData.address,
        link_maps: initialData.link_maps,
      });

      setImagePreview(initialData.image_url);
      setCategoryId(initialData.village_facility_types?.category_id ?? "");
    } else {
      setForm({
        type_id: "",
        name: "",
        image: {
          url: null,
          publicId: null,
          file: null,
        },
        address: null,
        link_maps: null,
      });

      setImagePreview(null);
      setCategoryId("");
    }
  }, [initialData]);

  const filteredTypes = types.filter((item) => item.category_id === categoryId);

  function handleChange(
    field: "type_id" | "name" | "address" | "link_maps",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleImageUpload(file: File) {
    const preview = URL.createObjectURL(file);

    setImagePreview(preview);
    setForm((prev) => ({
      ...prev,
      image: {
        ...prev.image,
        file,
      },
    }));
  }

  async function handleDeleteImage() {
    if (form.image.publicId && onDeleteImage) {
      await onDeleteImage(form.image.publicId);
    }

    setImagePreview(null);
    setForm((prev) => ({
      ...prev,
      image: {
        url: null,
        publicId: null,
        file: null,
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.type_id || !form.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Jenis dan nama fasilitas wajib diisi",
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
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border p-2 hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h3 className="font-semibold text-gray-900">
            {initialData ? "Edit Fasilitas" : "Tambah Fasilitas"}
          </h3>
          <p className="text-sm text-gray-500">Kelola fasilitas desa</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        {/* IMAGE + FORM */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_1fr]">
          {/* IMAGE */}
          <div>
            <ThumbnailFacility
              imageUrl={form.image.url}
              previewUrl={imagePreview}
              onFileSelect={handleImageUpload}
              onDeleteImage={handleDeleteImage}
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* CATEGORY + TYPE */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Kategori</label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      type_id: "",
                    }));
                  }}
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

              <div>
                <label className="mb-2 block text-sm font-medium">Jenis Fasilitas</label>
                <select
                  value={form.type_id}
                  onChange={(e) => handleChange("type_id", e.target.value)}
                  className="w-full rounded-lg border px-4 py-2"
                >
                  <option value="">Pilih jenis</option>
                  {filteredTypes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium">Nama Fasilitas</label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Contoh: SD Negeri 1"
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>
          </div>
        </div>

        {/* ADDRESS + MAPS */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Alamat</label>
            <input
              value={form.address ?? ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Masukkan alamat fasilitas"
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