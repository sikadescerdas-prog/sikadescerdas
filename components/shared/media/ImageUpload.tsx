// shared/media/ImageUpload.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Trash2 } from "lucide-react";

import { sweet } from "@/shared/utils/sweet";

interface ImageUploadProps {
  imageUrl?: string | null;
  ratio?: "square" | "landscape";
  label?: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUpload({
  imageUrl = null,
  ratio = "square",
  label = "Upload Gambar",
  onUpload,
  onDelete,
  maxSize = 2 * 1024 * 1024,
  className,
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(imageUrl);

  useEffect(() => {
    setPreview(imageUrl);
  }, [imageUrl]);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

    if (file.size > maxSize) {
      sweet.error({
        title: "Ukuran terlalu besar",
        text: `Ukuran gambar maksimal ${Math.round(maxSize / 1024 / 1024)} MB`,
      });

      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview(url);
    onUpload(file);

    e.target.value = "";
  }

  function handleDelete() {
    setPreview(null);
    onDelete();
  }

  const boxClass = className ?? (ratio === "landscape" ? "aspect-video w-full" : "aspect-square h-[200px] w-[200px]");

  const buttonWidth = ratio === "square" ? "w-[200px]" : "w-full";

  return (
    <div className="flex flex-col">
      <div
        className={`relative overflow-hidden rounded-xl bg-gray-50 ${boxClass} ${
          preview ? "border border-gray-200" : "border-2 border-dashed border-gray-300"
        }`}
      >
        {preview ? (
          <>
            <Image src={preview} alt={label} fill sizes="100%" className="object-cover" />

            {/* Hapus Foto */}
            <button
              type="button"
              disabled={disabled}
              onClick={handleDelete}
              className={`absolute bottom-2 right-2 z-20 rounded-full bg-white p-2 shadow-md transition ${
                disabled ? "cursor-not-allowed opacity-50" : "hover:scale-105"
              }`}
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </>
        ) : (
          <label
            className={`flex h-full w-full flex-col items-center justify-center text-gray-400 transition ${
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-green-50"
            }`}
          >
            <Camera size={32} className="text-green-600" />

            <span className="mt-2 text-sm font-medium">{label}</span>

            <span className="text-xs text-gray-400">{ratio === "square" ? "Rasio 1:1" : "Rasio 16:9"}</span>

            <span className="mt-1 text-[11px] text-gray-400">
              JPG, PNG, WEBP • Maks {Math.round(maxSize / 1024 / 1024)} MB
            </span>

            <input type="file" accept=".jpg,.jpeg,.png,.webp" hidden disabled={disabled} onChange={handleUpload} />
          </label>
        )}
      </div>

      {/* Tombol Ubah Foto */}
      {preview && (
        <label
          className={`mt-3 flex ${buttonWidth} cursor-pointer items-center justify-center gap-2 rounded-full py-2 text-xs font-semibold transition ${
            disabled ? "cursor-not-allowed bg-gray-100 text-gray-400" : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          <Camera size={16} />
          {ratio === "square" ? "Ubah Foto" : "Ubah Gambar"}

          <input type="file" accept=".jpg,.jpeg,.png,.webp" hidden disabled={disabled} onChange={handleUpload} />
        </label>
      )}
    </div>
  );
}