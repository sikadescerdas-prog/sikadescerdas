// components/dashboard/structure/periods/FormPeriod.tsx

"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Swal from "sweetalert2";

import type {
  StructurePeriod,
  StructurePeriodForm as PeriodFormType,
} from "@/modules/dashboard/structure/types/structure.types";

interface Props {
  initialData?: StructurePeriod;
  onBack: () => void;
  onSubmit: (data: PeriodFormType) => Promise<void>;
}

export default function FormPeriod({ initialData, onBack, onSubmit }: Props) {
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState<PeriodFormType>({
    start_year: currentYear,
    end_year: currentYear + 5,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        start_year: initialData.start_year,
        end_year: initialData.end_year,
      });
    } else {
      setForm({
        start_year: currentYear,
        end_year: currentYear + 5,
      });
    }
  }, [initialData, currentYear]);

  function handleChange(field: keyof PeriodFormType, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.end_year < form.start_year) {
      await Swal.fire({
        icon: "warning",
        title: "Validasi Gagal",
        text: "Tahun selesai tidak boleh lebih kecil dari tahun mulai.",
      });
      return;
    }

    try {
      setLoading(true);
      await onSubmit(form);

      await Swal.fire({
        icon: "success",
        title: initialData ? "Berhasil diperbarui" : "Berhasil ditambahkan",
        text: initialData
          ? "Periode struktur berhasil diperbarui"
          : "Periode struktur berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      });

      onBack();
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data",
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
          <h3 className="font-semibold text-gray-950">
            {initialData ? "Edit Periode Struktur" : "Tambah Periode Struktur"}
          </h3>
          <p className="text-sm text-gray-500">Atur masa jabatan organisasi desa</p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Tahun Mulai</label>
            <input
              type="number"
              value={form.start_year || ""}
              onChange={(e) => handleChange("start_year", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Tahun Selesai</label>
            <input
              type="number"
              value={form.end_year || ""}
              onChange={(e) => handleChange("end_year", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-3 border-t pt-5">
          <button type="button" onClick={onBack} className="rounded-lg border px-5 py-2 text-sm hover:bg-gray-50">
            Batal
          </button>

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