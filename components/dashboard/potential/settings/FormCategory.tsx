// components/dashboard/potential/settings/FormCategory.tsx

"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Swal from "sweetalert2";
import { usePotentialCategories } from "@/modules/dashboard/potential/hooks/useCategories";
import type { PotentialCategory } from "@/modules/dashboard/potential/types/potential.types";

interface Props {
  initialData?: PotentialCategory;
  onBack: () => void;
  onSuccess: () => void;
}

export default function FormCategory({ initialData, onBack, onSuccess }: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [loading, setLoading] = useState(false);

  const { addCategory, editCategory } = usePotentialCategories();

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

      const payload = {
        name: name.trim(),
        description: description.trim() || null,
      };

      if (initialData) {
        await editCategory(initialData.id, payload);
      } else {
        await addCategory(payload);
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
        <button type="button" onClick={onBack} className="rounded-lg border p-2 hover:bg-gray-50">
          <ArrowLeft size={18} />
        </button>

        <div>
          <h2 className="font-semibold text-gray-900">{initialData ? "Edit Kategori" : "Tambah Kategori"}</h2>
          <p className="text-sm text-gray-500">Kelola kategori potensi desa</p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Nama Kategori</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Wisata"
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Deskripsi</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Potensi wisata alam dan budaya desa"
            className="w-full resize-none rounded-lg border px-4 py-2 outline-none focus:border-green-500"
          />
        </div>

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