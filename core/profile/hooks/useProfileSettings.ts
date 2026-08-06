// core/profile/hooks/useProfileSettings.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import { profileService } from "@/core/profile/services/profile.service";
import type { Profile, ProfileForm } from "@/core/profile/types/profile.types";
import type { AuthUser } from "@/core/auth/types/user.types";

import { phoneToDatabase, phoneToDisplay } from "@/shared/helpers/phone";

import { sweet } from "@/shared/utils/sweet";

type UseProfileSettingsReturn = {
  loading: boolean;
  saving: boolean;
  form: ProfileForm;
  setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
  currentUser: AuthUser | null;
  isCompleted: boolean;
  avatarPreview: string;
  progress: number;
  usernameError?: string;
  fullnameError?: string;
  phoneError?: string;
  usernameAvailable?: boolean;
  checkingUsername: boolean;
  setUsernameFocus: () => void;
  setUsernameBlur: () => Promise<void>;
  setFullnameBlur: () => void;
  setPhoneFocus: () => void;
  setPhoneBlur: () => void;
  handleAvatarUpload: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
  saveProfile: () => Promise<void>;
};

const defaultForm: ProfileForm = {
  username: "",
  fullname: "",
  phone: "",
  bio: "",
  gender: "",
  birthDate: "",
  province: "",
  regency: "",
  district: "",
  village: "",
  detailAddress: "",
  latitude: null,
  longitude: null,
};

export function useProfileSettings(): UseProfileSettingsReturn {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<ProfileForm>(defaultForm);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const progress = 0;
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const [usernameError, setUsernameError] = useState<string>();
  const [fullnameError, setFullnameError] = useState<string>();
  const [phoneError, setPhoneError] = useState<string>();

  const [usernameAvailable, setUsernameAvailable] =
    useState<boolean>();

  const [checkingUsername, setCheckingUsername] =
    useState(false);

  // =========================
  // PROFILE COMPLETION
  // =========================
  const isCompleted =
    Boolean(form.username.trim()) &&
    Boolean(form.fullname.trim()) &&
    Boolean(form.phone.trim()) &&
    Boolean(form.province.trim()) &&
    Boolean(form.regency.trim()) &&
    Boolean(form.district.trim()) &&
    Boolean(form.village.trim()) &&
    Boolean(form.detailAddress.trim()) &&
    form.latitude !== null &&
    form.longitude !== null;

    console.log("PROFILE COMPLETION:", {
    username: form.username,
    fullname: form.fullname,
    phone: form.phone,
    province: form.province,
    regency: form.regency,
    district: form.district,
    village: form.village,
    detailAddress: form.detailAddress,
    latitude: form.latitude,
    longitude: form.longitude,
    isCompleted,
  });

  // =========================
  // LOAD PROFILE
  // =========================
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const data = await profileService.getProfile();

      setCurrentUser(data.user);
      setProfile(data.profile);

      setAvatarPreview(data.profile.avatarUrl ?? "");
      setAvatarFile(null);
      setRemoveAvatar(false);

      setForm({
        username: data.user.username,
        fullname: data.profile.fullname ?? "",
        phone: phoneToDisplay(data.profile.phone),
        bio: data.profile.bio ?? "",
        gender: data.profile.gender ?? "",
        birthDate: data.profile.birthDate ?? "",
        province: data.profile.province ?? "",
        regency: data.profile.regency ?? "",
        district: data.profile.district ?? "",
        village: data.profile.village ?? "",
        detailAddress: data.profile.detailAddress ?? "",
        latitude: data.profile.latitude,
        longitude: data.profile.longitude,
      });
    } catch (error: unknown) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal mengambil profile",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // =========================
  // USERNAME
  // =========================
  const setUsernameFocus = () => {
    setUsernameError(undefined);
  };

  const setUsernameBlur = async () => {
    const username = form.username.trim();

    if (!username) {
      setUsernameError("Username wajib diisi");
      return;
    }

    try {
      setCheckingUsername(true);

      const available =
        await profileService.checkUsername(username);

      setUsernameAvailable(available);

      if (!available) {
        setUsernameError("Username sudah digunakan");
      } else {
        setUsernameError(undefined);
      }
    } catch {
      setUsernameError("Gagal mengecek username");
    } finally {
      setCheckingUsername(false);
    }
  };

  // =========================
  // FULLNAME
  // =========================
  const setFullnameBlur = () => {
    const fullname = form.fullname.trim();

    if (!fullname) {
      setFullnameError("Nama lengkap wajib diisi");
    } else {
      setFullnameError(undefined);
    }
  };

  // =========================
  // PHONE
  // =========================
  const setPhoneFocus = () => {
    setPhoneError(undefined);
  };

  const setPhoneBlur = () => {
    const phone = form.phone.trim();

    if (!phone) {
      setPhoneError("Nomor telepon wajib diisi");
      return;
    }

    if (phone.length < 8 || phone.length > 15) {
      setPhoneError("Nomor telepon harus 8-15 digit");
      return;
    }

    if (!/^(08|62)\d+$/.test(phone)) {
      setPhoneError("Nomor harus mulai dari 08 atau 62");
      return;
    }

    setPhoneError(undefined);
  };

  // =========================
  // UPLOAD AVATAR
  // =========================
  const handleAvatarUpload = async (file: File) => {
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      sweet.error({
        title: "Gagal",
        text: "Ukuran avatar maksimal 2MB",
      });
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      sweet.error({
        title: "Format tidak sesuai",
        text: "Gunakan gambar JPG, PNG, atau WEBP",
      });
      return;
    }

    setRemoveAvatar(false);
    setAvatarFile(file);

    const preview = URL.createObjectURL(file);

    setAvatarPreview(preview);
  };

  // =========================
  // DELETE AVATAR
  // =========================
  const deleteAvatar = async () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setRemoveAvatar(true);
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const saveProfile = async () => {
    if (
      usernameError ||
      fullnameError ||
      phoneError
    ) {
      sweet.error({
        title: "Gagal",
        text: "Periksa data profile",
      });
      return;
    }

    try {
      setSaving(true);

      // Hapus avatar lama jika diminta
      if (removeAvatar) {
        await profileService.deleteAvatar();
      }

      // Upload avatar baru jika ada
      let avatarResult = null;

      if (avatarFile) {
        avatarResult =
          await profileService.uploadAvatar(
            avatarFile
          );
      }

      const payload = {
        ...form,
        phone: phoneToDatabase(form.phone),
      };

      const result =
        await profileService.updateProfile(
          payload
        );

      setCurrentUser(result.user);

      setProfile(
        avatarResult
          ? {
              ...result.profile,
              avatarUrl:
                avatarResult.avatarUrl,
              avatarPublicId:
                avatarResult.avatarPublicId,
            }
          : result.profile
      );

      setAvatarFile(null);
      setRemoveAvatar(false);

      sweet.success({
        title: "Berhasil",
        text: "Profile berhasil disimpan",
      });

      window.location.reload();
    } catch (error: unknown) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan profile",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    form,
    setForm,
    currentUser,
    isCompleted,
    avatarPreview,
    progress,
    usernameError,
    fullnameError,
    phoneError,
    usernameAvailable,
    checkingUsername,
    setUsernameFocus,
    setUsernameBlur,
    setFullnameBlur,
    setPhoneFocus,
    setPhoneBlur,
    handleAvatarUpload,
    deleteAvatar,
    saveProfile,
  };
}