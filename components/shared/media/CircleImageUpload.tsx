// components/shared/media/CircleImageUpload.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Trash2 } from "lucide-react";
import { sweet } from "@/shared/utils/sweet";

interface CircleImageUploadProps {
  imageUrl?: string | null;
  label?: string;
  alt?: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
  maxSize?: number;
  disabled?: boolean;
  size?: number;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function CircleImageUpload({
  imageUrl = null,
  label = "Upload Foto",
  alt = "Gambar",
  onUpload,
  onDelete,
  maxSize = 2 * 1024 * 1024,
  disabled = false,
  size = 112,
}: CircleImageUploadProps) {
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
        text: "Gunakan gambar JPG, PNG, atau WEBP",
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

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);

    // Hanya mengirim file ke parent.
    // Upload dilakukan saat tombol Simpan.
    onUpload(file);

    e.target.value = "";
  }

  function handleDelete() {
    if (disabled) return;

    setPreview(null);
    onDelete();
  }

  return (
    <div className="flex flex-col items-center">
      {/* Avatar / Logo */}
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <div
          className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-400 shadow-sm ring-4 ring-green-50 ${
            preview
              ? "border border-gray-200"
              : "border-2 border-dashed border-gray-300"
          }`}
        >
          {preview ? (
            <Image
              src={preview}
              alt={alt}
              fill
              sizes={`${size}px`}
              className="object-cover"
            />
          ) : (
            <label
              className={`flex h-full w-full flex-col items-center justify-center ${
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-green-50"
              }`}
            >
              <Camera size={28} className="text-green-600" />

              <span className="mt-1 text-[11px] font-medium text-gray-500">
                {label}
              </span>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                hidden
                disabled={disabled}
                onChange={handleUpload}
              />
            </label>
          )}
        </div>

        {/* Tombol Kamera / Hapus */}
        {preview ? (
          <button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            title="Hapus gambar"
            className={`absolute bottom-0 right-0 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white shadow-md transition ${
              disabled
                ? "cursor-not-allowed opacity-50"
                : "hover:scale-105"
            }`}
          >
            <Trash2 size={15} className="text-red-500" />
          </button>
        ) : null}

        {/* Camera */}
        {preview && (
          <label
            title="Ubah gambar"
            className={`absolute bottom-0 right-0 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-600 shadow-md transition ${
              disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:scale-105 hover:bg-green-700"
            }`}
          >
            <Camera size={15} className="text-white" />

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              hidden
              disabled={disabled}
              onChange={handleUpload}
            />
          </label>
        )}
      </div>

      {/* Tombol Ubah */}
      {preview && (
        <label
          className={`mt-4 flex w-[180px] items-center justify-center gap-2 rounded-full py-2 text-xs font-semibold transition ${
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "cursor-pointer bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          <Camera size={15} />
          {label}

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            hidden
            disabled={disabled}
            onChange={handleUpload}
          />
        </label>
      )}

      {/* Info */}
      <p className="mt-2 text-[10px] text-gray-400">
        JPG, PNG, WEBP • Maks {Math.round(maxSize / 1024 / 1024)} MB
      </p>
    </div>
  );
}