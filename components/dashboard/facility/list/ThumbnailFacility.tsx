// components/dashboard/facility/list/ThumbnailFacility.tsx

"use client";

import ImageUpload from "@/components/shared/media/ImageUpload";

interface Props {
  imageUrl?: string | null;
  previewUrl?: string | null;
  onFileSelect: (file: File) => void;
  onDeleteImage: () => void;
}

export default function ThumbnailFacility({
  imageUrl,
  previewUrl,
  onFileSelect,
  onDeleteImage,
}: Props) {
  return (
    <div className="w-full">
      <ImageUpload
        ratio="landscape"
        className="aspect-video w-full"
        imageUrl={previewUrl ?? imageUrl}
        label="Foto Fasilitas"
        onUpload={onFileSelect}
        onDelete={onDeleteImage}
      />
    </div>
  );
}