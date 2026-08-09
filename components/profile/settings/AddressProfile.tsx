// components/profile/settings/AddressProfile.tsx

"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

import InputUnderline from "@/components/ui/InputUnderline";
import MapsProfile from "@/components/profile/settings/MapsProfile";
import type { ProfileForm } from "@/core/profile/types/profile.types";

type FieldKey =
  | "detailAddress"
  | "village"
  | "regency"
  | "district"
  | "province";

interface AddressProfileProps {
  form: ProfileForm;
  setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
}

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: "detailAddress", label: "Alamat Lengkap" },
  { key: "village", label: "Desa / Kelurahan" },
  { key: "district", label: "Kecamatan" },
  { key: "regency", label: "Kabupaten / Kota" },
  { key: "province", label: "Provinsi" },
];

export default function AddressProfile({
  form,
  setForm,
}: AddressProfileProps) {
  const [editField, setEditField] = useState<FieldKey | null>(null);

  const handleChange = (key: FieldKey, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const getDisplayValue = (field: FieldKey, value: string) => {
    const trimmed = value.trim();

    switch (field) {
      case "province":
        return trimmed || "Masukkan provinsi";
      case "regency":
        return trimmed || "Masukkan kabupaten / kota";
      case "district":
        return trimmed || "Masukkan kecamatan";
      case "village":
        return trimmed || "Masukkan desa / kelurahan";
      case "detailAddress":
        return trimmed || "Tambahkan alamat lengkap";
      default:
        return trimmed || "Belum diisi";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setEditField(null);
    }
  };

  const renderInput = (key: FieldKey, label: string, value: string) => {
    if (key === "detailAddress") {
      return (
        <textarea
          autoFocus
          value={value}
          placeholder="Masukkan alamat lengkap..."
          rows={3}
          onChange={(e) => handleChange(key, e.target.value)}
          onBlur={() => setEditField(null)}
          className="w-full resize-none border-b border-gray-300 bg-transparent py-2 text-sm text-gray-900 outline-none focus:border-green-600"
        />
      );
    }

    return (
      <InputUnderline
        autoFocus
        value={value}
        placeholder={`Masukkan ${label.toLowerCase()}...`}
        onChange={(e) => handleChange(key, e.target.value)}
        onBlur={() => setEditField(null)}
        onKeyDown={handleKeyDown}
      />
    );
  };

  return (
    <div className="overflow-hidden pt-3">
      {/* HEADER */}
      <div className="px-6">
        <h2 className="text-base font-semibold text-gray-900">Alamat</h2>
      </div>

      {/* ADDRESS FIELDS */}
      <div className="divide-y divide-gray-100 border-b border-gray-100">
        {FIELDS.map((field) => {
          const isEditing = editField === field.key;
          const value = form[field.key]?.toString() ?? "";
          const isEmpty = value.trim() === "";

          return (
            <div
              key={field.key}
              className="grid grid-cols-12 items-start px-6 py-5"
            >
              {/* LABEL */}
              <div className="col-span-4 pt-1">
                <p className="text-sm font-medium leading-6 text-gray-500">
                  {field.label}
                </p>
              </div>

              {/* VALUE / INPUT */}
              <div className="col-span-8 flex flex-col">
                {isEditing ? (
                  renderInput(field.key, field.label, value)
                ) : (
                  <div
                    onClick={() => setEditField(field.key)}
                    className="flex w-full cursor-pointer items-center justify-between py-1 transition hover:text-green-600"
                  >
                    <span
                      className={`text-[15px] ${
                        isEmpty ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {getDisplayValue(field.key, value)}
                    </span>
                    <ChevronRight size={18} className="text-gray-300" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MAPS SECTION */}
      <div className="px-6">
        <MapsProfile
          latitude={form.latitude}
          longitude={form.longitude}
          onSelect={handleLocationSelect}
        />
      </div>
    </div>
  );
}