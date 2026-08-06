// components/dashboard/profile/SocialMediaVillage.tsx

"use client";

import InputGoogle from "@/components/ui/InputGoogle";
import type { VillageProfileForm } from "@/modules/dashboard/village/types/village.types";

type Props = {
  formData: VillageProfileForm;
  onChange: (field: string, value: any) => void;
};

export default function SocialMediaVillage({ formData, onChange }: Props) {
  return (
    <div className="animate-fade-up delay-4">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-emerald-500" />
        <h3 className="text-base font-bold text-gray-800">Media Sosial</h3>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <InputGoogle
          name="facebook"
          label="Facebook"
          value={formData.socialMedia.facebook}
          placeholder="https://facebook.com/..."
          onChange={(e) => onChange("socialMedia.facebook", e.target.value)}
        />

        <InputGoogle
          name="instagram"
          label="Instagram"
          value={formData.socialMedia.instagram}
          placeholder="https://instagram.com/..."
          onChange={(e) => onChange("socialMedia.instagram", e.target.value)}
        />

        <InputGoogle
          name="tiktok"
          label="TikTok"
          value={formData.socialMedia.tiktok}
          placeholder="https://tiktok.com/@..."
          onChange={(e) => onChange("socialMedia.tiktok", e.target.value)}
        />

        <InputGoogle
          name="youtube"
          label="YouTube"
          value={formData.socialMedia.youtube}
          placeholder="https://youtube.com/..."
          onChange={(e) => onChange("socialMedia.youtube", e.target.value)}
        />
      </div>
    </div>
  );
}