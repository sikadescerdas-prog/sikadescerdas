// components/dashboard/news/form/GalleryNews.tsx

"use client";

import ImageUploadGallery from "@/components/shared/media/ImageUploadGallery";

interface GalleryItem {
  url: string | null;
  publicId: string | null;
  file: File | null;
}

interface Props {
  gallery: GalleryItem[];
  onAdd: (file: File) => void;
  onUpdate: (index: number, file: File) => void;
  onDelete: (index: number) => void;
}

export default function GalleryNews({
  gallery,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Dokumentasi Berita</h3>
        <p className="mt-1 text-sm text-gray-500">Tambahkan maksimal 5 foto dokumentasi.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {gallery.map((item, index) => (
          <ImageUploadGallery
            key={index}
            imageUrl={item.file ? URL.createObjectURL(item.file) : item.url}
            label={`Foto ${index + 1}`}
            onUpload={(file) => onUpdate(index, file)}
            onDelete={() => onDelete(index)}
          />
        ))}

        {gallery.length < 5 && (
          <ImageUploadGallery
            label="Tambah Foto"
            imageUrl={null}
            onUpload={onAdd}
            onDelete={() => {}}
          />
        )}
      </div>

      <p className="text-xs text-gray-500">{gallery.length}/5 foto dipilih.</p>
    </div>
  );
}