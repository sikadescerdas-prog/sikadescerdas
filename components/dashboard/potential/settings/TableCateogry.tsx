// components/dashboard/potential/settings/TableCategory.tsx

"use client";

import { Pencil, Plus, Trash2, Tags } from "lucide-react";
import Swal from "sweetalert2";
import { usePotentialCategories } from "@/modules/dashboard/potential/hooks/useCategories";
import type { PotentialCategory } from "@/modules/dashboard/potential/types/potential.types";

interface Props {
  onAdd: () => void;
  onEdit: (data: PotentialCategory) => void;
}

export default function TableCategory({ onAdd, onEdit }: Props) {
  const { categories, loading, removeCategory } = usePotentialCategories();

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Hapus kategori?",
      text: "Semua data potensi yang terkait dengan kategori ini juga akan terhapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await removeCategory(id);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Kategori gagal dihapus",
      });
    }
  }

  if (loading) {
    return <div className="rounded-xl bg-white p-10 text-center text-gray-500">Memuat kategori...</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Tags size={20} className="text-green-600" />
          <h3 className="font-semibold">Kategori Potensi</h3>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
        >
          <Plus size={16} />
          Tambah
        </button>
      </div>

      {/* EMPTY */}
      {categories.length === 0 ? (
        <div className="p-12 text-center">
          <Tags size={42} className="mx-auto text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">Belum ada kategori potensi</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left">No</th>
                <th className="px-6 py-3 text-left">Nama Kategori</th>
                <th className="px-6 py-3 text-left">Deskripsi</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {categories.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-gray-600">{item.description ?? "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(item)} className="hidden rounded-lg p-2 hover:bg-gray-100">
                        <Pencil size={16} />
                      </button>

                      <button onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
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