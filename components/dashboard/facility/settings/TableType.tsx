// components/dashboard/facility/settings/type/TableType.tsx

"use client";

import { Pencil, Plus, Trash2, Layers } from "lucide-react";
import Swal from "sweetalert2";

import { useFacilityTypes } from "@/modules/dashboard/facility/hooks/useTypes";
import type { FacilityType } from "@/modules/dashboard/facility/types/facility.types";

interface Props {
  onAdd: () => void;
  onEdit: (data: FacilityType) => void;
}

export default function TableType({ onAdd, onEdit }: Props) {
  const { types, loading, removeType } = useFacilityTypes();

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Hapus jenis fasilitas?",
      text: "Data jenis fasilitas akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await removeType(id);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Jenis fasilitas berhasil dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Jenis fasilitas gagal dihapus",
      });
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-10 text-center text-gray-500">
        Memuat jenis fasilitas...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Layers size={20} className="text-green-600" />
          <h3 className="font-semibold">Jenis Fasilitas</h3>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
        >
          <Plus size={16} />
          Tambah
        </button>
      </div>

      {/* EMPTY STATE / TABLE */}
      {types.length === 0 ? (
        <div className="p-12 text-center">
          <Layers size={42} className="mx-auto text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">Belum ada jenis fasilitas</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left">No</th>
                <th className="px-6 py-3 text-left">Kategori</th>
                <th className="px-6 py-3 text-left">Jenis</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {types.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    {item.village_facility_categories?.name ?? "-"}
                  </td>
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-lg p-2 hover:bg-gray-100"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}