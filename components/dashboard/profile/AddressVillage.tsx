// components/dashboard/profile/AddressVillage.tsx

"use client";

import InputGoogle from "@/components/ui/InputGoogle";
import type { VillageProfileForm } from "@/modules/dashboard/village/types/village.types";

type Props = {
  formData: VillageProfileForm;
  onChange: (field: string, value: any) => void;
};

export default function AddressVillage({ formData, onChange }: Props) {
  return (
    <div className="animate-fade-up delay-2">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-emerald-500" />
        <h3 className="text-base font-bold text-gray-800">Alamat Desa</h3>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <InputGoogle
              name="detailAddress"
              label="Alamat Lengkap"
              value={formData.address.detailAddress}
              placeholder="Jl. Desa No. 1"
              onChange={(e) => onChange("address.detailAddress", e.target.value)}
            />
          </div>

          <div className="lg:col-span-2">
            <InputGoogle
              name="rt"
              label="RT"
              value={formData.address.rt}
              placeholder="001"
              maxLength={3}
              onChange={(e) => onChange("address.rt", e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <div className="lg:col-span-2">
            <InputGoogle
              name="rw"
              label="RW"
              value={formData.address.rw}
              placeholder="001"
              maxLength={3}
              onChange={(e) => onChange("address.rw", e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InputGoogle
            name="village"
            label="Desa"
            value={formData.address.village}
            placeholder="Nama Desa"
            onChange={(e) => onChange("address.village", e.target.value)}
          />

          <InputGoogle
            name="district"
            label="Kecamatan"
            value={formData.address.district}
            placeholder="Nama Kecamatan"
            onChange={(e) => onChange("address.district", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <InputGoogle
            name="regency"
            label="Kabupaten"
            value={formData.address.regency}
            placeholder="Kabupaten"
            onChange={(e) => onChange("address.regency", e.target.value)}
          />

          <InputGoogle
            name="province"
            label="Provinsi"
            value={formData.address.province}
            placeholder="Provinsi"
            onChange={(e) => onChange("address.province", e.target.value)}
          />

          <InputGoogle
            name="postalCode"
            label="Kode Pos"
            value={formData.address.postalCode}
            placeholder="53182"
            maxLength={5}
            onChange={(e) => onChange("address.postalCode", e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <InputGoogle
          name="mapEmbed"
          label="Link Google Maps"
          value={formData.mapEmbed}
          placeholder="https://maps.google.com/..."
          onChange={(e) => onChange("mapEmbed", e.target.value)}
        />
      </div>
    </div>
  );
}