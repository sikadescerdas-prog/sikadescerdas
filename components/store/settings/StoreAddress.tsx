// components/store/settings/StoreAddress.tsx

"use client";

import dynamic from "next/dynamic";
import { MapPin, RotateCcw } from "lucide-react";
import InputGoogle from "@/components/ui/InputGoogle";

const Maps = dynamic(() => import("@/components/ui/Maps"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-400">
      Memuat Maps...
    </div>
  ),
});

type ProfileAddress = {
  address?: string | null;
  village?: string | null;
  district?: string | null;
  regency?: string | null;
  province?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
};

type StoreAddressProps = {
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  latitude: string;
  longitude: string;
  sameAsProfile: boolean;
  profileAddress?: ProfileAddress;
  onChange: (field: "address" | "village" | "district" | "regency" | "province" | "latitude" | "longitude", value: string) => void;
  onSameAsProfileChange: (value: boolean) => void;
};

export default function StoreAddress({
  address,
  village,
  district,
  regency,
  province,
  latitude,
  longitude,
  sameAsProfile,
  profileAddress,
  onChange,
  onSameAsProfileChange,
}: StoreAddressProps) {
  const lat = Number(latitude) || 0;
  const lng = Number(longitude) || 0;
  const location = { lat, lng };

  const handleMapSelect = (value: { lat: number; lng: number }) => {
    if (sameAsProfile) return;
    onChange("latitude", String(value.lat));
    onChange("longitude", String(value.lng));
  };

  const handleSameAsProfile = (checked: boolean) => {
    onSameAsProfileChange(checked);

    if (checked) {
      onChange("address", profileAddress?.address ?? "");
      onChange("village", profileAddress?.village ?? "");
      onChange("district", profileAddress?.district ?? "");
      onChange("regency", profileAddress?.regency ?? "");
      onChange("province", profileAddress?.province ?? "");
      onChange("latitude", profileAddress?.latitude != null ? String(profileAddress.latitude) : "");
      onChange("longitude", profileAddress?.longitude != null ? String(profileAddress.longitude) : "");
      return;
    }

    onChange("address", "");
    onChange("village", "");
    onChange("district", "");
    onChange("regency", "");
    onChange("province", "");
    onChange("latitude", "");
    onChange("longitude", "");
  };

  return (
    <section className="border-t border-gray-100 pt-6">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-800">Alamat Toko</h2>
        <p className="mt-1 text-xs text-gray-500">Lengkapi alamat dan lokasi toko Anda.</p>
      </div>

      <div className="space-y-4">
        {/* ALAMAT LENGKAP */}
        <div className="relative">
          <textarea
            id="store-address"
            name="address"
            value={address}
            disabled={sameAsProfile}
            onChange={(event) => onChange("address", event.target.value)}
            placeholder="Masukkan alamat lengkap, RT/RW, nomor rumah, dan keterangan lainnya"
            rows={4}
            className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 ${
              sameAsProfile
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                : "border-gray-300 bg-white text-gray-700 focus:border-green-500"
            }`}
          />
          <label htmlFor="store-address" className={`pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs ${sameAsProfile ? "text-gray-400" : "text-gray-500"}`}>
            Alamat Lengkap
          </label>
        </div>

        {/* DESA */}
        <div className="relative">
          <input
            id="store-village"
            name="village"
            type="text"
            value={village}
            disabled={sameAsProfile}
            onChange={(event) => onChange("village", event.target.value)}
            placeholder="Masukkan nama desa"
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 ${
              sameAsProfile
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                : "border-gray-300 bg-white text-gray-700 focus:border-green-500"
            }`}
          />
          <label htmlFor="store-village" className={`pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs ${sameAsProfile ? "text-gray-400" : "text-gray-500"}`}>
            Desa
          </label>
        </div>

        {/* KECAMATAN */}
        <div className="relative">
          <input
            id="store-district"
            name="district"
            type="text"
            value={district}
            disabled={sameAsProfile}
            onChange={(event) => onChange("district", event.target.value)}
            placeholder="Masukkan nama kecamatan"
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 ${
              sameAsProfile
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                : "border-gray-300 bg-white text-gray-700 focus:border-green-500"
            }`}
          />
          <label htmlFor="store-district" className={`pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs ${sameAsProfile ? "text-gray-400" : "text-gray-500"}`}>
            Kecamatan
          </label>
        </div>

        {/* KABUPATEN / KOTA */}
        <div className="relative">
          <input
            id="store-regency"
            name="regency"
            type="text"
            value={regency}
            disabled={sameAsProfile}
            onChange={(event) => onChange("regency", event.target.value)}
            placeholder="Masukkan kabupaten atau kota"
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 ${
              sameAsProfile
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                : "border-gray-300 bg-white text-gray-700 focus:border-green-500"
            }`}
          />
          <label htmlFor="store-regency" className={`pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs ${sameAsProfile ? "text-gray-400" : "text-gray-500"}`}>
            Kabupaten / Kota
          </label>
        </div>

        {/* PROVINSI */}
        <div className="relative">
          <input
            id="store-province"
            name="province"
            type="text"
            value={province}
            disabled={sameAsProfile}
            onChange={(event) => onChange("province", event.target.value)}
            placeholder="Masukkan provinsi"
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 ${
              sameAsProfile
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                : "border-gray-300 bg-white text-gray-700 focus:border-green-500"
            }`}
          />
          <label htmlFor="store-province" className={`pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs ${sameAsProfile ? "text-gray-400" : "text-gray-500"}`}>
            Provinsi
          </label>
        </div>

        {/* MAPS */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Lokasi Toko</p>
              <p className="text-xs text-gray-500">
                {sameAsProfile ? "Lokasi mengikuti profile Anda." : "Pilih lokasi toko pada peta."}
              </p>
            </div>
          </div>

          <div className={sameAsProfile ? "pointer-events-none select-none" : ""}>
            <Maps value={location} onSelect={handleMapSelect} disabled={sameAsProfile} />
          </div>

          {/* LATITUDE & LONGITUDE HIDDEN */}
          <input type="hidden" name="latitude" value={latitude} />
          <input type="hidden" name="longitude" value={longitude} />
        </div>

        {/* SAMAKAN DENGAN PROFILE + RESET */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={sameAsProfile}
              onChange={(event) => handleSameAsProfile(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Gunakan alamat dan lokasi yang tersimpan pada profile Anda.
              </p>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}