// components/dashboard/structure/list/TableMember.tsx

"use client";

import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Users, Filter } from "lucide-react";
import Swal from "sweetalert2";

import { useMembers } from "@/modules/dashboard/structure/hooks/useMembers";
import { usePeriods } from "@/modules/dashboard/structure/hooks/usePeriods";

import type { StructureMember } from "@/modules/dashboard/structure/types/structure.types";

interface Props {
  onAdd: () => void;
  onEdit: (data: StructureMember) => void;
}

const POSITION_ORDER = [
  "Kepala Desa",
  "Sekretaris Desa",
  "Kaur Tata Usaha dan Umum",
  "Kaur Keuangan",
  "Kaur Perencanaan",
  "Kasi Pemerintahan",
  "Kasi Kesejahteraan",
  "Kasi Pelayanan",
  "Kepala Dusun",
  "Ketua",
  "Wakil Ketua",
  "Sekretaris",
  "Bendahara",
  "Anggota",
];

function sortMembers(data: StructureMember[]) {
  return [...data].sort((a, b) => {
    const aStartYear = a.period?.start_year ?? (a as any).village_structure_periods?.start_year ?? 0;
    const bStartYear = b.period?.start_year ?? (b as any).village_structure_periods?.start_year ?? 0;

    if (aStartYear !== bStartYear) {
      return bStartYear - aStartYear;
    }

    const aIndex = POSITION_ORDER.indexOf(a.position?.name ?? "");
    const bIndex = POSITION_ORDER.indexOf(b.position?.name ?? "");

    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });
}

export default function TableMember({ onAdd, onEdit }: Props) {
  const { members, loading, removeMember } = useMembers();
  const { periods } = usePeriods();

  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");

  const filteredAndSortedMembers = useMemo(() => {
    let result = members;

    if (selectedPeriodId) {
      result = members.filter(
        (item) =>
          item.period_id === selectedPeriodId ||
          (item as any).village_structure_periods?.id === selectedPeriodId
      );
    }

    return sortMembers(result);
  }, [members, selectedPeriodId]);

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Hapus pengurus?",
      text: "Data akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await removeMember(id);

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data berhasil dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",
        title: "Gagal menghapus",
        text: error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus data",
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-blue-600">Data Struktur Organisasi Desa</h2>
          <p className="text-sm text-gray-500">Kelola seluruh pejabat dan anggota organisasi desa</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* FILTER PERIODE */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Semua Periode</option>
              {periods?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.start_year} - {p.end_year}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 sm:w-auto sm:gap-2 sm:px-4"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Tambah Pejabat</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center text-gray-500">Memuat data...</div>
      ) : filteredAndSortedMembers.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center">
          <div className="flex flex-col items-center gap-3 text-blue-500">
            <Users size={44} strokeWidth={1.5} />
            <p className="font-medium text-blue-600">Tidak ada data pengurus</p>
            <p className="text-sm text-gray-400">
              {selectedPeriodId
                ? "Tidak ada pengurus pada periode yang dipilih"
                : "Silakan tambahkan data pengurus terlebih dahulu"}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-blue-700">No</th>
                  <th className="px-6 py-3 text-left text-blue-700">Nama Pengurus</th>
                  <th className="px-6 py-3 text-left text-blue-700">Jabatan</th>
                  <th className="px-6 py-3 text-left text-blue-700">Periode Jabatan</th>
                  <th className="px-6 py-3 text-left text-blue-700">No HP</th>
                  <th className="px-6 py-3 text-left text-blue-700">Alamat</th>
                  <th className="px-6 py-3 text-left text-blue-700">Email</th>
                  <th className="px-6 py-3 text-right text-blue-700">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredAndSortedMembers.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                          {item.photo_url && (
                            <img
                              src={item.photo_url}
                              alt={item.full_name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div>
                            <p className="font-medium text-gray-900">{item.full_name}</p>
                            {item.position?.group?.name && (
                              <p className="text-xs text-gray-500">{item.position.name}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {item.position?.group?.name ?? item.position?.name ?? "-"}
                    </td>

                    {/* Kolom Periode */}
                    <td className="px-6 py-4 text-gray-600">
                      {item.period?.start_year && item.period?.end_year
                        ? `${item.period.start_year} - ${item.period.end_year}`
                        : item.village_structure_periods?.start_year &&
                            item.village_structure_periods?.end_year
                          ? `${item.village_structure_periods.start_year} - ${item.village_structure_periods.end_year}`
                          : "-"}
                    </td>

                    <td className="px-6 py-4">{item.phone ?? "-"}</td>
                    <td className="px-6 py-4">{item.address ?? "-"}</td>
                    <td className="px-6 py-4">{item.email ?? "-"}</td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="rounded-lg p-2 hover:bg-gray-100"
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