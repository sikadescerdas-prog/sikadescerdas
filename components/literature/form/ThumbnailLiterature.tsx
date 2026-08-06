// components/literature/form/ThumbnailLiterature.tsx

"use client";

import ImageUpload from "@/components/shared/media/ImageUpload";

interface Props {
  imageUrl?: string | null;
  previewUrl?: string | null;
  onFileSelect: (file: File) => void;
  onDeleteImage: () => void;
}

export default function ThumbnailLiterature({ imageUrl, previewUrl, onFileSelect, onDeleteImage }: Props) {
  return (
    <div className="w-full">
      <ImageUpload
        ratio="landscape"
        className="aspect-video w-full"
        imageUrl={previewUrl ?? imageUrl}
        label="Thumbnail Literasi"
        onUpload={onFileSelect}
        onDelete={onDeleteImage}
      />
    </div>
  );
}