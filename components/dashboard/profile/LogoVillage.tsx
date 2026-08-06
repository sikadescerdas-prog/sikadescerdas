// components/dashboard/profile/LogoVillage.tsx

"use client";

import ImageUpload from "@/components/shared/media/ImageUpload";

type Props = {
  logoUrl?: string | null;
  previewUrl?: string | null;
  onFileSelect: (file: File) => void;
  onDeleteLogo: () => void;
};

export default function LogoVillage({ logoUrl, previewUrl, onFileSelect, onDeleteLogo }: Props) {
  return (
    <div className="animate-fade-up">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-emerald-500" />
        <h3 className="text-base font-bold text-gray-800">Logo Desa</h3>
      </div>

      <div className="flex flex-col items-start">
        <div className="mb-3 flex items-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Logo</p>
          <span className="ml-1 text-xs font-bold text-red-500">*</span>
        </div>

        <ImageUpload
          ratio="square"
          imageUrl={previewUrl ?? logoUrl}
          label="Logo Desa"
          onUpload={onFileSelect}
          onDelete={onDeleteLogo}
        />
      </div>
    </div>
  );
}