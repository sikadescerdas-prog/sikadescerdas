// components/profile/settings/AvatarProfile.tsx

"use client";

import React from "react";
import Image from "next/image";
import { Camera, Mail, Trash2 } from "lucide-react";
import { getInitials } from "@/core/profile/helpers/getInitials";

interface AvatarProfileProps {
  fullname: string;
  email: string;
  avatarUrl: string | null;
  progress: number;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

export default function AvatarProfile({
  fullname,
  email,
  avatarUrl,
  progress,
  onUpload,
  onDelete,
}: AvatarProfileProps) {
  const initials = getInitials(fullname || "User");

  // Konfigurasi SVG Progress Bar
  const size = 112;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const color =
    progress < 40
      ? "#ef4444"
      : progress < 70
      ? "#f59e0b"
      : "#22c55e";

  const offset = circumference * (1 - progress / 100);
  const isUploading = progress > 0 && progress < 100;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      onUpload(file);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Avatar Wrapper */}
      <div className="relative flex h-[112px] w-[112px] items-center justify-center">
        {/* Progress SVG Overlay */}
        {isUploading && (
          <svg
            className="absolute -inset-1 z-10 -rotate-90 pointer-events-none"
            width={size + 8}
            height={size + 8}
          >
            <circle
              cx={(size + 8) / 2}
              cy={(size + 8) / 2}
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={(size + 8) / 2}
              cy={(size + 8) / 2}
              r={radius}
              stroke={color}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>
        )}

        {/* Avatar Display */}
        <div className="relative h-full w-full overflow-hidden rounded-full bg-gray-100 text-xl font-bold text-gray-600 shadow-md ring-4 ring-green-100 flex items-center justify-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullname || "User"}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* Action Button Overlay (Delete or Camera) */}
        {avatarUrl ? (
          <button
            type="button"
            onClick={onDelete}
            title="Hapus foto"
            className="absolute bottom-0 right-0 z-20 rounded-full bg-white p-2 shadow transition hover:scale-105"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        ) : (
          <label className="absolute bottom-0 right-0 z-20 cursor-pointer rounded-full bg-white p-2 shadow transition hover:scale-105">
            <Camera size={16} className="text-green-600" />
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Upload Progress Status */}
      {isUploading && (
        <p className="mt-2 text-xs font-medium text-gray-500">
          Mengunggah... {progress}%
        </p>
      )}

      {/* Primary Upload Button */}
      <label className="mt-4 cursor-pointer rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100">
        Ubah Foto Profil
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </label>

      {/* Email Info */}
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
        <Mail size={16} className="text-gray-400" />
        <span>{email}</span>
      </div>
    </div>
  );
}