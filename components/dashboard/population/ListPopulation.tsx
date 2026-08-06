// components/dashboard/population/ListPopulation.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import Swal from "sweetalert2";
import { usePopulation } from "@/modules/dashboard/population/hooks/usePopulation";
import CardPopulation from "./card/CardPopulation";
import type { Population } from "@/modules/dashboard/population/types/population.types";

interface Props {
  onAdd: () => void;
  onEdit: (data: Population) => void;
}

export default function ListPopulation({ onAdd, onEdit }: Props) {
  const { populations, master, loading, removePopulation } = usePopulation();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (populations.length) {
      const latest = [...populations].sort((a, b) => b.year - a.year)[0];
      setSelectedYear(latest.year);
    }
  }, [populations]);

  const selectedPopulation = useMemo(() => {
    return populations.find((item) => item.year === selectedYear);
  }, [populations, selectedYear]);

  async function handleDelete(data: Population) {
    const result = await Swal.fire({
      title: "Hapus data penduduk?",
      text: `Data tahun ${data.year} akan dihapus`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;
    await removePopulation(data.id);
  }

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Memuat data penduduk...</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Penduduk Desa</h3>
          <p className="text-sm text-gray-500">Data kependudukan berdasarkan tahun</p>
        </div>

        <div className="flex items-center gap-3">
          {populations.length > 0 && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-lg border px-4 py-2 text-sm outline-none focus:border-green-600"
            >
              {[...populations]
                .sort((a, b) => b.year - a.year)
                .map((item) => (
                  <option key={item.id} value={item.year}>
                    {item.year}
                  </option>
                ))}
            </select>
          )}

          <button
            onClick={onAdd}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Data</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {selectedPopulation ? (
        <CardPopulation
          data={selectedPopulation}
          master={master}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-12 text-center text-gray-500">
          <Users className="mb-3 h-10 w-10 text-gray-400" />
          <p className="text-base font-medium text-gray-700">Belum ada data penduduk</p>
        </div>
      )}
    </div>
  );
}