// components/dashboard/facility/settings/FormCategory.tsx

"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Swal from "sweetalert2";

import { useFacilityCategories } from "@/modules/dashboard/facility/hooks/useCategories";
import type { FacilityCategory } from "@/modules/dashboard/facility/types/facility.types";

interface Props {
  initialData?: FacilityCategory;
  onBack: () => void;
  onSuccess: () => void;
}

export default function FormCategory({
  initialData,
  onBack,
  onSuccess,
}: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [loading, setLoading] = useState(false);

  const { addCategory, editCategory } = useFacilityCategories();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nama kategori kosong",
        text: "Silakan isi nama kategori",
      });
      return;
    }

    try {
      setLoading(true);

      if (initialData) {
        await editCategory(initialData.id, {
          name: name.trim(),
        });
      } else {
        await addCategory({
          name: name.trim(),
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: initialData ? "Kategori berhasil diperbarui" : "Kategori berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      });

      onSuccess();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan kategori",
      });
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
          <h2 className="font-semibold text-gray-900">
            {initialData ? "Edit Kategori" : "Tambah Kategori"}
          </h2>
          <p className="text-sm text-gray-500">Masukkan nama kategori fasilitas</p>
        </div>
      </div>

      {/* FORM BODY */}
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* INPUT FIELD */}
        <div>
          <label className="mb-2 block text-sm font-medium">Nama Kategori</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Pendidikan"
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-green-500"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end border-t pt-5">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            <Save size={17} />
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}