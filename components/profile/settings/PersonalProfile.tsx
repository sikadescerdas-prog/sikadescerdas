// components/profile/settings/PersonalProfile.tsx

"use client";

import React, { useState } from "react";
import { ChevronRight, CheckCircle, XCircle, Loader2 } from "lucide-react";

import { formatDate } from "@/shared/utils/formatDate";
import InputUnderline from "@/components/ui/InputUnderline";
import SelectUnderline from "@/components/ui/SelectUnderline";

import type { ProfileForm, Gender } from "@/core/profile/types/profile.types";

type FieldKey =
  | "username"
  | "fullname"
  | "bio"
  | "phone"
  | "gender"
  | "birthDate";

interface PersonalProfileProps {
  form: ProfileForm;
  setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;

  usernameError?: string;
  fullnameError?: string;
  phoneError?: string;

  usernameAvailable?: boolean;
  checkingUsername?: boolean;
  currentUsername?: string;

  onUsernameFocus?: () => void;
  onUsernameBlur?: () => void;

  onFullnameBlur?: () => void;

  onPhoneFocus?: () => void;
  onPhoneBlur?: (value?: string) => void;
}

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: "username", label: "Username" },
  { key: "fullname", label: "Nama Lengkap" },
  { key: "bio", label: "Bio" },
  { key: "phone", label: "Nomor Telepon" },
  { key: "gender", label: "Jenis Kelamin" },
  { key: "birthDate", label: "Tanggal Lahir" },
];

export default function PersonalProfile({
  form,
  setForm,
  usernameError,
  fullnameError,
  phoneError,
  usernameAvailable,
  checkingUsername,
  currentUsername,
  onFullnameBlur,
  onUsernameFocus,
  onUsernameBlur,
  onPhoneFocus,
  onPhoneBlur,
}: PersonalProfileProps) {
  const [editField, setEditField] = useState<FieldKey | null>(null);

  const handleChange = (key: FieldKey, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "phone" ? value.replace(/\D/g, "") : value,
    }));
  };

  const getDisplayValue = (field: FieldKey, value: string) => {
    const trimmed = value.trim();

    switch (field) {
      case "username":
        return trimmed || "Buat username";
      case "fullname":
        return trimmed || "Tambahkan nama lengkap";
      case "bio":
        return trimmed || "Tambahkan bio";
      case "phone":
        return trimmed || "Tambahkan nomor telepon";
      case "gender":
        return trimmed === "male"
          ? "Laki-laki"
          : trimmed === "female"
          ? "Perempuan"
          : "Belum dipilih";
      case "birthDate":
        return trimmed ? formatDate(trimmed) : "Belum dipilih";
      default:
        return trimmed || "Belum diisi";
    }
  };

  const getError = (field: FieldKey) => {
    switch (field) {
      case "username":
        return usernameError;
      case "fullname":
        return fullnameError;
      case "phone":
        return phoneError;
      default:
        return undefined;
    }
  };

  const isOwnerUsername = form.username === currentUsername;

  const handleKeyDown = (
    e: React.KeyboardEvent,
    onBlurAction?: () => void
  ) => {
    if (e.key === "Enter") {
      setEditField(null);
      onBlurAction?.();
    }

    if (e.key === "Escape") {
      setEditField(null);
    }
  };

  const renderInput = (key: FieldKey, value: string) => {
    switch (key) {
      case "birthDate":
        return (
          <InputUnderline
            type="date"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            onBlur={() => setEditField(null)}
          />
        );

      case "gender":
        return (
          <SelectUnderline
            value={value}
            onChange={(e) => handleChange(key, e.target.value as Gender)}
            onBlur={() => setEditField(null)}
          >
            <option value="">Pilih jenis kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </SelectUnderline>
        );

      case "username":
        return (
          <div className="relative w-full">
            <InputUnderline
              autoFocus
              value={value}
              placeholder="Username"
              onChange={(e) => handleChange(key, e.target.value)}
              onFocus={onUsernameFocus}
              onBlur={() => {
                setEditField(null);
                onUsernameBlur?.();
              }}
              onKeyDown={(e) => handleKeyDown(e, onUsernameBlur)}
            />

            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
              {checkingUsername && (
                <Loader2 size={18} className="animate-spin text-gray-400" />
              )}

              {isOwnerUsername && (
                <CheckCircle size={18} className="text-blue-500" />
              )}

              {usernameAvailable === true && !isOwnerUsername && (
                <CheckCircle size={18} className="text-green-500" />
              )}

              {usernameAvailable === false && !isOwnerUsername && (
                <XCircle size={18} className="text-red-500" />
              )}
            </div>
          </div>
        );

      case "fullname":
        return (
          <InputUnderline
            autoFocus
            value={value}
            placeholder="Nama lengkap"
            onChange={(e) => handleChange(key, e.target.value)}
            onBlur={() => {
              setEditField(null);
              onFullnameBlur?.();
            }}
            onKeyDown={(e) => handleKeyDown(e, onFullnameBlur)}
          />
        );

      case "bio":
        return (
          <InputUnderline
            autoFocus
            value={value}
            placeholder="Tulis bio singkat..."
            onChange={(e) => handleChange(key, e.target.value)}
            onBlur={() => setEditField(null)}
            onKeyDown={handleKeyDown}
          />
        );

      case "phone":
        return (
          <InputUnderline
            autoFocus
            value={value}
            placeholder="081234567890"
            onChange={(e) => handleChange(key, e.target.value)}
            onFocus={onPhoneFocus}
            onBlur={(e) => {
              setEditField(null);
              onPhoneBlur?.(e.target.value);
            }}
            onKeyDown={(e) =>
              handleKeyDown(e, () => onPhoneBlur?.(form.phone))
            }
          />
        );

      default:
        return (
          <InputUnderline
            autoFocus
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            onBlur={() => setEditField(null)}
            onKeyDown={handleKeyDown}
          />
        );
    }
  };

  return (
    <div className="overflow-hidden pt-3">
      {/* HEADER */}
      <div className="px-6">
        <h2 className="text-base font-semibold text-gray-900">
          Informasi Pribadi
        </h2>
      </div>

      {/* FIELDS */}
      <div className="divide-y divide-gray-100 border-b border-gray-100">
        {FIELDS.map((field) => {
          const isEditing = editField === field.key;
          const value = form[field.key]?.toString() ?? "";
          const isEmpty = value.trim() === "";
          const fieldError = getError(field.key);

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
                  renderInput(field.key, value)
                ) : (
                  <div
                    onClick={() => setEditField(field.key)}
                    className="flex cursor-pointer items-center justify-between py-1 transition-colors hover:text-green-600"
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

                {/* ERROR MESSAGE */}
                {fieldError && (
                  <p className="mt-2 text-xs text-red-500">{fieldError}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}