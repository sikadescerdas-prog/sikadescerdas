// components/shared/media/SquareImageUpload.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Trash2 } from "lucide-react";
import { sweet } from "@/shared/utils/sweet";

interface SquareImageUploadProps {
  imageUrl: string | null;
  label?: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;

export default function SquareImageUpload({
  imageUrl,
  label = "Upload Gambar",
  onUpload,
  onDelete,
}: SquareImageUploadProps) {
  const [preview, setPreview] = useState(imageUrl);

  useEffect(() => {
    setPreview(imageUrl);
  }, [imageUrl]);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      sweet.error({
        title: "Format tidak sesuai",
        text: "Gunakan gambar JPG, JPEG, PNG, atau WEBP",
      });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      sweet.error({
        title: "Ukuran terlalu besar",
        text: "Ukuran gambar maksimal 2MB",
      });
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    onUpload(file);
    e.target.value = "";
  }

  function handleDelete() {
    setPreview(null);
    onDelete();
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[200px] w-[200px]">
        <div
          className={`relative flex h-full w-full overflow-hidden rounded-xl bg-gray-50 ${
            preview ? "border border-gray-200" : "border-2 border-dashed border-gray-300"
          }`}
        >
          {preview ? (
            <Image src={preview} alt={label} fill sizes="200px" className="object-cover" />
          ) : (
            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-gray-400 transition hover:bg-green-50">
              <Camera size={28} className="text-green-600" />
              <span className="mt-2 text-xs">{label}</span>
              <input type="file" accept=".jpg,.jpeg,.png,.webp" hidden onChange={handleUpload} />
            </label>
          )}
        </div>

        {preview && (
          <button
            type="button"
            onClick={handleDelete}
            className="absolute bottom-1 right-1 z-20 rounded-full bg-white p-2 shadow-md transition hover:scale-105"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        )}
      </div>

      {preview && (
        <label className="mt-3 w-[200px] cursor-pointer rounded-full bg-green-50 py-2 text-center text-xs font-semibold text-green-700 transition hover:bg-green-100">
          Ubah Foto
          <input type="file" accept=".jpg,.jpeg,.png,.webp" hidden onChange={handleUpload} />
        </label>
      )}
    </div>
  );
}