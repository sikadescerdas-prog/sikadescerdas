// components/dashboard/profile/BoundaryVillage.tsx

"use client";

import InputGoogle from "@/components/ui/InputGoogle";
import type { VillageProfileForm } from "@/modules/dashboard/village/types/village.types";

type Props = {
  formData: VillageProfileForm;
  onChange: (field: string, value: any) => void;
};

export default function BoundaryVillage({ formData, onChange }: Props) {
  return (
    <div className="animate-fade-up delay-3">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-emerald-500" />
        <h3 className="text-base font-bold text-gray-800">Batas Wilayah</h3>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-1">
        <InputGoogle
          name="north"
          label="Sebelah Utara"
          value={formData.address.north}
          placeholder="Contoh: Desa Karangjati"
          onChange={(e) => onChange("address.north", e.target.value)}
        />

        <InputGoogle
          name="south"
          label="Sebelah Selatan"
          value={formData.address.south}
          placeholder="Contoh: Desa Sumbang"
          onChange={(e) => onChange("address.south", e.target.value)}
        />

        <InputGoogle
          name="east"
          label="Sebelah Timur"
          value={formData.address.east}
          placeholder="Contoh: Desa Kedungbanteng"
          onChange={(e) => onChange("address.east", e.target.value)}
        />

        <InputGoogle
          name="west"
          label="Sebelah Barat"
          value={formData.address.west}
          placeholder="Contoh: Desa Sokaraja"
          onChange={(e) => onChange("address.west", e.target.value)}
        />
      </div>
    </div>
  );
}