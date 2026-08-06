// components/shared/media/ImageUploadGallery.tsx

"use client";

import { Camera, Trash2 } from "lucide-react";
import Image from "next/image";
import { sweet } from "@/shared/utils/sweet";

interface Props {
  imageUrl?: string | null;
  label: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;

export default function ImageUploadGallery({ imageUrl, label, onUpload, onDelete }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      sweet.error({
        title: "Format tidak sesuai",
        text: "Gunakan JPG, PNG, atau WEBP",
      });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      sweet.error({
        title: "Ukuran terlalu besar",
        text: "Ukuran gambar maksimal 2 MB",
      });
      e.target.value = "";
      return;
    }

    onUpload(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col">
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-xl bg-gray-50 ${
          imageUrl ? "border border-gray-200" : "border-2 border-dashed border-gray-300"
        }`}
      >
        {imageUrl ? (
          <>
            <Image src={imageUrl} alt={label} fill sizes="100%" className="object-cover" />

            <button
              type="button"
              onClick={onDelete}
              className="absolute bottom-2 right-2 z-20 rounded-full bg-white p-2 shadow-md transition hover:scale-105"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </>
        ) : (
          <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-gray-400 transition hover:bg-green-50">
            <Camera size={32} className="text-green-600" />

            <span className="mt-2 text-sm font-medium">{label}</span>

            <span className="text-xs text-gray-400">Rasio 16:9</span>

            <span className="mt-1 text-[11px] text-gray-400">JPG, PNG, WEBP • Maks 2 MB</span>

            <input type="file" hidden accept=".jpg,.jpeg,.png,.webp" onChange={handleChange} />
          </label>
        )}
      </div>

      {imageUrl && (
        <label className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-green-50 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100">
          <Camera size={16} />
          Ubah Gambar
          <input type="file" hidden accept=".jpg,.jpeg,.png,.webp" onChange={handleChange} />
        </label>
      )}
    </div>
  );
}