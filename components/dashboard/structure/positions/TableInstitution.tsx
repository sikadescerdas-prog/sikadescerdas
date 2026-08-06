// components/dashboard/structure/positions/TableInstitution.tsx

"use client";

import { Building2, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

import { usePositions } from "@/modules/dashboard/structure/hooks/usePositions";
import { useGroups } from "@/modules/dashboard/structure/hooks/useGroups";

import type { StructurePosition } from "@/modules/dashboard/structure/types/structure.types";

interface Props {
  onEdit?: (data: StructurePosition) => void;
}

const INSTITUTION_ORDER = ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Anggota"];

export default function TableInstitution({ onEdit }: Props) {
  const { positions, removePosition } = usePositions();
  const { groups } = useGroups();

  const institutionPositions = positions.filter((item) => item.category?.type === "institution");

  function sortInstitution(data: StructurePosition[]) {
    return [...data].sort((a, b) => {
      const aIndex = INSTITUTION_ORDER.findIndex((keyword) =>
        a.name.toLowerCase().includes(keyword.toLowerCase())
      );
      const bIndex = INSTITUTION_ORDER.findIndex((keyword) =>
        b.name.toLowerCase().includes(keyword.toLowerCase())
      );
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
  }

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Hapus jabatan?",
      text: "Data jabatan akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await removePosition(id);

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Jabatan berhasil dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",
        title: "Gagal menghapus",
        text: error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus jabatan",
      });
    }
  }

  const tableData = groups.flatMap((group) => {
    const data = sortInstitution(institutionPositions.filter((item) => item.group_id === group.id));
    return data.map((item, index) => ({
      ...item,
      groupName: index === 0 ? group.name : "",
    }));
  });

  return (
    <div className="space-y-4">
      {tableData.length === 0 ? (
        <div className="rounded-xl bg-white">
          <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
            <div className="mb-4 rounded-full bg-green-100 p-4">
              <Building2 className="h-10 w-10 text-green-600" strokeWidth={1.5} />
            </div>

            <h3 className="text-center text-base font-semibold text-gray-900 sm:text-lg">
              Belum ada lembaga desa
            </h3>

            <p className="mt-1 text-center text-sm text-gray-500">
              Silakan tambahkan data lembaga desa terlebih dahulu.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="border-b bg-green-50 px-4 py-3 sm:px-6 sm:py-4">
            <h3 className="font-semibold text-green-600">Lembaga Desa</h3>
            <p className="text-xs text-gray-500 sm:text-sm">Struktur organisasi lembaga desa</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-green-50">
                <tr>
                  <th className="w-12 px-3 py-3 text-left text-green-700 sm:w-36 sm:px-6">Lembaga</th>
                  <th className="px-3 py-3 text-left text-green-700 sm:w-16 sm:px-6">Jabatan</th>
                  <th className="w-24 px-3 py-3 text-right text-green-700 sm:w-28 sm:px-6">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {tableData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.groupName}</td>

                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit?.(item)}
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                          title="Edit Jabatan"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          title="Hapus Jabatan"
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
        </div>
      )}
    </div>
  );
}