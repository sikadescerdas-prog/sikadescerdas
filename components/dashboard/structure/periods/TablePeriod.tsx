// components/dashboard/structure/periods/TablePeriod.tsx

"use client";

import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react";
import Swal from "sweetalert2";

import { usePeriods } from "@/modules/dashboard/structure/hooks/usePeriods";

import type { StructurePeriod } from "@/modules/dashboard/structure/types/structure.types";

interface Props {
  onAdd: () => void;
  onEdit: (data: StructurePeriod) => void;
}

export default function TablePeriod({ onAdd, onEdit }: Props) {
  const { periods, loading, removePeriod } = usePeriods();

  async function handleStatusChange(item: StructurePeriod, newStatus: boolean) {
    if (item.is_active === newStatus) return;

    Swal.fire({
      title: "Memperbarui status...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(`/api/dashboard/structure/periods/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newStatus }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `Status periode ${item.start_year} - ${item.end_year} diubah menjadi ${newStatus ? "Aktif" : "Tidak Aktif"}`,
        timer: 1500,
        showConfirmButton: false,
      });

      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    }
  }

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Hapus periode?",
      text: "Data periode akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Menghapus data...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await removePeriod(id);

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Periode berhasil dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",
        title: "Gagal menghapus",
        text: error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus periode",
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between rounded-xl bg-white p-4">
        <div>
          <h2 className="font-semibold text-orange-600">Periode Struktur Organisasi</h2>
          <p className="text-sm text-gray-500">Kelola masa jabatan struktur organisasi desa</p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600 text-white hover:bg-orange-700 sm:w-auto sm:gap-2 sm:px-4"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Tambah Periode</span>
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="rounded-xl bg-white p-12 text-center text-gray-500">Memuat data...</div>
      ) : periods.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center">
          <div className="flex flex-col items-center gap-3 text-orange-500">
            <CalendarDays size={44} strokeWidth={1.5} />
            <p className="font-medium text-orange-600">Tidak ada periode</p>
            <p className="text-sm text-gray-400">Silakan tambahkan periode terlebih dahulu</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">No</th>
                  <th className="px-6 py-3 text-left">Masa Jabatan</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {periods.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>

                    <td className="px-6 py-4 font-medium">
                      Periode {item.start_year} - {item.end_year}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={item.is_active ? "true" : "false"}
                        onChange={(e) => handleStatusChange(item, e.target.value === "true")}
                        className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          item.is_active
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : "border border-gray-200 bg-gray-100 text-gray-600"
                        }`}
                      >
                        <option value="true">Aktif</option>
                        <option value="false">Tidak Aktif</option>
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
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
      )}
    </div>
  );
}