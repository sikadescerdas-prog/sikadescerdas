// components/dashboard/news/form/ThumbnailNews.tsx

"use client";

import ImageUpload from "@/components/shared/media/ImageUpload";

interface Props {
  imageUrl?: string | null;
  previewUrl?: string | null;
  onFileSelect: (file: File) => void;
  onDeleteImage: () => void;
}

export default function ThumbnailNews({
  imageUrl,
  previewUrl,
  onFileSelect,
  onDeleteImage,
}: Props) {
  return (
    <div className="w-full">
      <div>
        <h3 className="mb-2 block text-sm font-medium">Thumbnail Berita</h3>
      </div>
      <ImageUpload
        ratio="landscape"
        className="aspect-video w-full"
        imageUrl={previewUrl ?? imageUrl}
        label="Thumbnail Berita"
        onUpload={onFileSelect}
        onDelete={onDeleteImage}
      />
    </div>
  );
}