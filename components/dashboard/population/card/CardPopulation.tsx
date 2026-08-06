// components/dashboard/population/card/CardPopulation.tsx

"use client";

import { Pencil, Trash2 } from "lucide-react";

import CardStat from "./CardStat";
import CardCategory from "./CardCategory";

import { formatPopulationNumber } from "@/modules/dashboard/population/helpers/population.helper";
import type { Population } from "@/modules/dashboard/population/types/population.types";

interface Props {
  data: Population;
  master: any[];
  onEdit: (data: Population) => void;
  onDelete: (data: Population) => void;
}

export default function CardPopulation({ data, master, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">Data Penduduk Tahun</p>
          <h2 className="text-2xl font-bold text-gray-900">{data.year}</h2>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onEdit(data)} className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50">
            <Pencil size={18} />
          </button>
          <button onClick={() => onDelete(data)} className="rounded-lg p-2 text-red-600 transition hover:bg-red-50">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* TOTAL */}
      <div className="mb-6 rounded-xl border border-green-100 bg-green-50 p-5">
        <p className="text-sm text-gray-500">Total Penduduk</p>
        <h3 className="mt-1 text-4xl font-bold text-green-700">{formatPopulationNumber(data.total_population)}</h3>
        <p className="text-sm text-gray-500">Jiwa</p>
      </div>

      {/* STAT */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CardStat type="kk" label="Kartu Keluarga" value={data.total_family_cards} />
        <CardStat type="male" label="Laki-laki" value={data.total_male} />
        <CardStat type="female" label="Perempuan" value={data.total_female} />
      </div>

      {/* DETAIL */}
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">Detail Kependudukan</h3>
          <p className="text-sm text-gray-500">Rincian data berdasarkan kategori</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {master.map((category) => (
            <CardCategory key={category.id} category={category} details={data.village_population_details ?? []} />
          ))}
        </div>
      </div>
    </div>
  );
}