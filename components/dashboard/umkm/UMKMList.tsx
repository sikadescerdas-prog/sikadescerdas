// components/dashboard/umkm/UMKMList.tsx

"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaBoxOpen, FaListUl, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import type { Store, UMKMProduct } from "@/modules/dashboard/umkm/types/umkm.types";

type Props = {
  stores: Store[];
  products: UMKMProduct[];
  onStatusChanged?: () => void;
};

export default function UMKMList({ stores, products, onStatusChanged }: Props) {
  const router = useRouter();
  const [loadingUid, setLoadingUid] = useState<string | null>(null);

  const getProductCount = (ownerUid: string) =>
    products.filter((p) => p.ownerUid === ownerUid).length;

  const handleToggleVerify = async (ownerUid: string, currentVerified: boolean) => {
    const nextVerifiedState: boolean = !currentVerified;

    try {
      setLoadingUid(ownerUid);

      Swal.fire({
        title: "Memproses...",
        text: "Sedang memperbarui status verifikasi toko",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await fetch("/api/dashboard/umkm/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerUid, isVerified: nextVerifiedState }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mengubah status verifikasi");
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Status toko berhasil diubah menjadi ${nextVerifiedState ? "Terverifikasi" : "Belum Verifikasi"}.`,
        timer: 1500,
        showConfirmButton: false,
      });

      if (onStatusChanged) onStatusChanged();

      router.refresh();
      window.location.reload();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Terjadi kesalahan saat mengubah status verifikasi",
      });
    } finally {
      setLoadingUid(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-3 text-left">Nama Toko</th>
            <th className="p-3 text-left">Alamat</th>
            <th className="p-3 text-center">Status Verifikasi</th>
            <th className="p-3 text-center">Total Produk</th>
            <th className="p-3 text-center">Link</th>
            <th className="p-3 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {stores.map((store) => {
            const count = getProductCount(store.ownerUid);
            const isVerified = store.isVerified ?? false;
            const isLoading = loadingUid === store.ownerUid;

            return (
              <tr key={store.ownerUid} className="border-b hover:bg-gray-50">
                {/* STORE INFO */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={store.logo?.url || "/placeholder.png"}
                      className="h-10 w-10 rounded-lg border object-cover"
                      alt={store.nameStore || "store"}
                    />
                    <p className="font-semibold">{store.nameStore || "-"}</p>
                  </div>
                </td>

                {/* ADDRESS */}
                <td className="p-3 text-gray-600">{store.addressStore?.city || "-"}</td>

                {/* VERIFIED BADGE */}
                <td className="p-3 text-center">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isVerified ? "Terverifikasi" : "Belum Verifikasi"}
                  </span>
                </td>

                {/* PRODUCT COUNT */}
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <FaBoxOpen />
                    {count}
                  </div>
                </td>

                {/* MAPS */}
                <td className="p-3 text-center">
                  {store.addressStore?.latitude && store.addressStore?.longitude ? (
                    <a
                      href={`https://www.google.com/maps?q=${store.addressStore.latitude},${store.addressStore.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-blue-500"
                    >
                      <FaMapMarkerAlt size={16} /> Maps
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                {/* ACTION */}
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleVerify(store.ownerUid, isVerified)}
                      disabled={isLoading}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        isVerified
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {isVerified ? <FaTimesCircle size={14} /> : <FaCheckCircle size={14} />}
                      {isLoading ? "Proses..." : isVerified ? "Batalkan Verifikasi" : "Verifikasi"}
                    </button>

                    <button
                      onClick={() => router.push(`/dashboard/umkm?id=${store.ownerUid}`)}
                      className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                    >
                      <FaListUl size={14} /> Produk
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}