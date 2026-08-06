// components/dashboard/potential/list/TablePotential.tsx

"use client";

import Image from "next/image";
import { Pencil, Trash2, MapPin, Trees, Settings, Plus } from "lucide-react";
import Swal from "sweetalert2";
import type { Potential } from "@/modules/dashboard/potential/types/potential.types";

interface Props {
  potentials: Potential[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (data: Potential) => void;
  onDelete: (id: string) => Promise<void>;
  onSettings: () => void;
}

export default function TablePotential({ potentials, loading, onAdd, onEdit, onDelete, onSettings }: Props) {
  const grouped = potentials.reduce((acc, item) => {
    const category = item.village_potential_categories?.name ?? "Lainnya";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, Potential[]>);

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Hapus potensi?",
      text: "Data potensi dan gambar akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      await onDelete(id);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Potensi berhasil dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus potensi",
      });
    }
  }

  if (loading) {
    return <div className="rounded-xl bg-white p-10 text-center text-gray-500">Memuat data potensi...</div>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white px-6 py-4">
        <div>
          <h3 className="font-semibold text-gray-800">Potensi Desa</h3>
          <p className="text-sm text-gray-500">Kelola data potensi berdasarkan kategori</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSettings}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            <Settings size={16} />
            Pengaturan
          </button>

          <button
            onClick={onAdd}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
          >
            <Plus size={16} />
            Tambah
          </button>
        </div>
      </div>

      {/* EMPTY */}
      {Object.entries(grouped).length === 0 && (
        <div className="rounded-xl bg-white p-12 text-center">
          <Trees size={48} className="mx-auto text-green-500" />
          <p className="mt-3 font-medium text-gray-700">Belum ada potensi desa</p>
          <p className="mt-1 text-sm text-gray-400">Silakan tambahkan potensi terlebih dahulu</p>
        </div>
      )}

      {/* TABLE GROUP */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="overflow-hidden rounded-xl border bg-white">
          <div className="border-b px-6 py-4">
            <h3 className="font-semibold text-green-600">{category}</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left">No</th>
                  <th className="px-6 py-3 text-left">Potensi</th>
                  <th className="px-6 py-3 text-left">Kategori</th>
                  <th className="px-6 py-3 text-left">Alamat</th>
                  <th className="px-6 py-3 text-left">Website</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                          {item.image_url ? (
                            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                          ) : (
                            <Trees size={24} className="text-gray-400" />
                          )}
                        </div>

                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">{item.village_potential_categories?.name ?? "-"}</td>

                    <td className="px-6 py-4">{item.address ?? "-"}</td>

                    <td className="px-6 py-4">
                      {item.website ? (
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-green-600 hover:underline"
                        >
                          Kunjungi
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {item.link_maps && (
                          <a
                            href={item.link_maps}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <MapPin size={16} />
                          </a>
                        )}

                        <button onClick={() => onEdit(item)} className="rounded-lg p-2 hover:bg-gray-100">
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
        </div>
      ))}
    </div>
  );
}