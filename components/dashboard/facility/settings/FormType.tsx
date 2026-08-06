// components/dashboard/facility/settings/type/FormType.tsx

"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Swal from "sweetalert2";

import { useFacilityTypes } from "@/modules/dashboard/facility/hooks/useTypes";
import { useFacilityCategories } from "@/modules/dashboard/facility/hooks/useCategories";
import type { FacilityType } from "@/modules/dashboard/facility/types/facility.types";

interface Props {
  initialData?: FacilityType;
  onBack: () => void;
  onSuccess: () => void;
}

export default function FormType({
  initialData,
  onBack,
  onSuccess,
}: Props) {
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? "");
  const [name, setName] = useState(initialData?.name ?? "");
  const [loading, setLoading] = useState(false);

  const { categories } = useFacilityCategories();
  const { addType, editType } = useFacilityTypes();

  useEffect(() => {
    if (initialData) {
      setCategoryId(initialData.category_id);
      setName(initialData.name);
    }
  }, [initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!categoryId) {
      Swal.fire({
        icon: "warning",
        title: "Kategori belum dipilih",
        text: "Silakan pilih kategori fasilitas",
      });
      return;
    }

    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nama jenis kosong",
        text: "Silakan isi nama jenis fasilitas",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        category_id: categoryId,
        name: name.trim(),
      };

      if (initialData) {
        await editType(initialData.id, payload);
      } else {
        await addType(payload);
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: initialData ? "Jenis fasilitas berhasil diperbarui" : "Jenis fasilitas berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      });

      onSuccess();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menyimpan jenis fasilitas",
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
          <h2 className="font-semibold text-gray-950">
            {initialData ? "Edit Jenis Fasilitas" : "Tambah Jenis Fasilitas"}
          </h2>
          <p className="text-sm text-gray-500">Hubungkan jenis dengan kategori fasilitas</p>
        </div>
      </div>

      {/* BODY FORM */}
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* SELECT CATEGORY */}
        <div>
          <label className="mb-2 block text-sm font-medium">Kategori</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-green-500"
          >
            <option value="">Pilih kategori</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* INPUT NAME */}
        <div>
          <label className="mb-2 block text-sm font-medium">Nama Jenis</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: SD, Masjid, Puskesmas"
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