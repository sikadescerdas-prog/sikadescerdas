// app/dashboard/profile/village/page.tsx

"use client";

import HeaderVillage from "@/components/dashboard/profile/HeaderVillage";
import LogoVillage from "@/components/dashboard/profile/LogoVillage";
import IdentityVillage from "@/components/dashboard/profile/IdentityVillage";
import VisionMissionVillage from "@/components/dashboard/profile/VisionMissionVillage";
import AddressVillage from "@/components/dashboard/profile/AddressVillage";
import BoundaryVillage from "@/components/dashboard/profile/BoundaryVillage";
import SocialMediaVillage from "@/components/dashboard/profile/SocialMediaVillage";
import SaveVillage from "@/components/dashboard/profile/SaveVillage";
import { useVillage } from "@/modules/dashboard/village/hooks/useVillage";

export default function VillageProfilePage() {
  const {
    formData,
    loading,
    isSaving,
    logoPreview,
    updateField,
    updateLogo,
    deleteLogo,
    saveVillage,
  } = useVillage();

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-100 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <HeaderVillage />

      <div className="space-y-8 p-6">
        <section>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">
            <LogoVillage
              logoUrl={formData.logo.url}
              previewUrl={logoPreview}
              onFileSelect={(file) => {
                updateLogo(file);
              }}
              onDeleteLogo={deleteLogo}
            />
            <IdentityVillage formData={formData} onChange={updateField} />
          </div>
        </section>

        <section>
          <VisionMissionVillage formData={formData} onChange={updateField} />
        </section>

        <section>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
            <div className="lg:col-span-6">
              <AddressVillage formData={formData} onChange={updateField} />
            </div>
            <div className="lg:col-span-4">
              <BoundaryVillage formData={formData} onChange={updateField} />
            </div>
          </div>
        </section>

        <section>
          <SocialMediaVillage formData={formData} onChange={updateField} />
        </section>

        <SaveVillage isSaving={isSaving} onSave={saveVillage} />
      </div>
    </div>
  );
}