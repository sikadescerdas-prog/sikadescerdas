// components/dashboard/product/form/GalleryProduct.tsx

"use client";

import ImageUploadGallery from "@/components/shared/media/ImageUploadGallery";

interface ProductImageForm {
  id?: string;
  url: string | null;
  publicId: string | null;
  file: File | null;
}

interface Props {
  images: ProductImageForm[];
  onAdd: (file: File) => void;
  onUpdate: (index: number, file: File) => void;
  onDelete: (index: number) => void;
}

export default function GalleryProduct({
  images,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900">
          Foto Produk
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Tambahkan maksimal 10 foto produk.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((item, index) => (
          <ImageUploadGallery
            key={item.id ?? index}
            imageUrl={item.file ? URL.createObjectURL(item.file) : item.url}
            label={`Foto ${index + 1}`}
            onUpload={(file) => onUpdate(index, file)}
            onDelete={() => onDelete(index)}
          />
        ))}

        {images.length < 10 && (
          <ImageUploadGallery
            label="Tambah Foto"
            imageUrl={null}
            onUpload={onAdd}
            onDelete={() => {}}
          />
        )}
      </div>
    </div>
  );
}