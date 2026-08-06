// components/dashboard/facility/list/TableFacility.tsx

"use client";

import Image from "next/image";
import { Pencil, Trash2, MapPin, School, Settings, Plus } from "lucide-react";
import Swal from "sweetalert2";

import type { Facility } from "@/modules/dashboard/facility/types/facility.types";

interface Props {
  facilities: Facility[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (data: Facility) => void;
  onDelete: (id: string) => Promise<void>;
  onSettings: () => void;
}

export default function TableFacility({
  facilities,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onSettings,
}: Props) {
  const grouped = facilities.reduce((acc, item) => {
    const category = item.village_facility_types?.village_facility_categories?.name ?? "Lainnya";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(item);
    return acc;
  }, {} as Record<string, Facility[]>);

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Hapus fasilitas?",
      text: "Data fasilitas akan dihapus permanen",
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
        text: "Fasilitas berhasil dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus fasilitas",
      });
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-10 text-center text-gray-500">
        Memuat data fasilitas...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white px-6 py-4">
        <div>
          <h3 className="font-semibold text-gray-800">Fasilitas Desa</h3>
          <p className="text-sm text-gray-500">Kelola data fasilitas berdasarkan kategori</p>
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

      {/* EMPTY STATE */}
      {Object.entries(grouped).length === 0 && (
        <div className="rounded-xl bg-white p-12 text-center">
          <School size={48} className="mx-auto text-green-500" />
          <p className="mt-3 font-medium text-gray-700">Belum ada fasilitas desa</p>
          <p className="mt-1 text-sm text-gray-400">Silakan tambahkan fasilitas terlebih dahulu</p>
        </div>
      )}

      {/* GROUPED TABLES */}
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
                  <th className="px-6 py-3 text-left">Fasilitas</th>
                  <th className="px-6 py-3 text-left">Jenis</th>
                  <th className="px-6 py-3 text-left">Alamat</th>
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
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <School size={24} className="text-gray-400" />
                          )}
                        </div>

                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">{item.village_facility_types?.name ?? "-"}</td>

                    <td className="px-6 py-4">{item.address ?? "-"}</td>

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
        </div>
      ))}
    </div>
  );
}