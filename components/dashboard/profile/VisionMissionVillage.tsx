// components/dashboard/profile/VisionMissionVillage.tsx

"use client";

import TextareaGoogle from "@/components/ui/TextareaGoogle";
import type { VillageProfileForm } from "@/modules/dashboard/village/types/village.types";

type Props = {
  formData: VillageProfileForm;
  onChange: <K extends keyof VillageProfileForm>(field: K, value: VillageProfileForm[K]) => void;
};

export default function VisionMissionVillage({ formData, onChange }: Props) {
  return (
    <div className="animate-fade-up delay-1">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-emerald-500" />
        <h3 className="text-base font-bold text-gray-800">Visi & Misi</h3>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <TextareaGoogle
          name="vision"
          label="Visi"
          rows={4}
          value={formData.vision ?? ""}
          placeholder="Visi desa..."
          onChange={(e) => onChange("vision", e.target.value)}
        />

        <TextareaGoogle
          name="mission"
          label="Misi"
          rows={4}
          value={formData.mission ?? ""}
          placeholder="Misi desa..."
          onChange={(e) => onChange("mission", e.target.value)}
        />
      </div>
    </div>
  );
}