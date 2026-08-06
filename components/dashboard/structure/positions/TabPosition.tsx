// components/dashboard/structure/positions/TabPosition.tsx

"use client";

import { Plus } from "lucide-react";

import TableGovernment from "./TableGovernment";
import TableInstitution from "./TableInstitution";

import type { StructurePosition } from "@/modules/dashboard/structure/types/structure.types";

interface Props {
  onAdd: () => void;
  onEdit: (data: StructurePosition) => void;
}

export default function TabPosition({ onAdd, onEdit }: Props) {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between rounded-xl bg-white p-4">
        <div>
          <h2 className="font-semibold text-green-600">Struktur Organisasi Desa</h2>
          <p className="text-sm text-gray-500">Kelola Pemerintah Desa dan Lembaga Desa</p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 sm:w-auto sm:gap-2 sm:px-4"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Tambah Jabatan</span>
        </button>
      </div>

      {/* TABLE CONTAINER (Atas-bawah di Mobile, Kiri-Kanan di Desktop) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* PEMERINTAH DESA */}
        <TableGovernment onEdit={onEdit} />

        {/* LEMBAGA DESA */}
        <TableInstitution onEdit={onEdit} />
      </div>
    </div>
  );
}