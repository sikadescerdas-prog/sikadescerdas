// components/dashboard/product/form/ThumbnailProduct.tsx

"use client";

import ImageUpload from "@/components/shared/media/ImageUpload";

interface Props {
  imageUrl?: string | null;
  previewUrl?: string | null;
  onFileSelect: (file: File) => void;
  onDeleteImage: () => void;
}

export default function ThumbnailProduct({
  imageUrl,
  previewUrl,
  onFileSelect,
  onDeleteImage,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900">
          Thumbnail Produk
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Tambahkan foto utama untuk produk Anda.
        </p>
      </div>

      <ImageUpload
        ratio="landscape"
        className="aspect-video w-full"
        imageUrl={previewUrl ?? imageUrl}
        label="Thumbnail Produk"
        onUpload={onFileSelect}
        onDelete={onDeleteImage}
      />
    </div>
  );
}