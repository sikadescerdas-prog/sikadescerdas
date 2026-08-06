// components/store/settings/StoreLogo.tsx

"use client";

import ImageUpload from "@/components/shared/media/ImageUpload";

type StoreLogoProps = { logoUrl?: string | null; bannerUrl?: string | null; onLogoUpload: (file: File) => void; onLogoDelete: () => void; onBannerUpload: (file: File) => void; onBannerDelete: () => void; disabled?: boolean; };

export default function StoreLogo({ logoUrl = null, bannerUrl = null, onLogoUpload, onLogoDelete, onBannerUpload, onBannerDelete, disabled = false }: StoreLogoProps) {
  return (
    <section className="mb-6">
      <div className="mb-3">
        <h2 className="text-md font-semibold text-gray-800">Logo & Banner Toko</h2>
        <p className="mt-1 text-xs text-gray-500">Gunakan gambar yang jelas agar tampilan toko terlihat baik.</p>
      </div>

      <div className="grid grid-cols-2 items-start gap-3 sm:gap-5">
        {/* LOGO */}
        <div className="min-w-0">
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700">Logo <span className="text-red-500">*</span></p>
            <p className="text-xs text-gray-400">Rasio 1:1</p>
          </div>

          <ImageUpload
            imageUrl={logoUrl}
            ratio="square"
            label="Upload Logo"
            onUpload={onLogoUpload}
            onDelete={onLogoDelete}
            disabled={disabled}
            className="aspect-[4/3] w-full max-w-[200px]"
          />
        </div>

        {/* BANNER */}
        <div className="min-w-0">
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700">Banner <span className="text-red-500">*</span></p>
            <p className="text-xs text-gray-400">Upload 16:9</p>
          </div>

          <ImageUpload
            imageUrl={bannerUrl}
            ratio="landscape"
            label="Upload Banner"
            onUpload={onBannerUpload}
            onDelete={onBannerDelete}
            disabled={disabled}
            className="aspect-[4/3] w-full max-w-[200px]"
          />
        </div>
      </div>
    </section>
  );
}