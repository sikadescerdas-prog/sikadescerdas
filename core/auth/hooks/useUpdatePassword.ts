// core/auth/hooks/useUpdatePassword.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/core/auth/services/auth.service";
import { sweet } from "@/shared/utils/sweet";
import { getPasswordStrength, validatePassword } from "@/core/auth/helpers/password";

export function useUpdatePassword() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  const strength = getPasswordStrength(newPassword);
  const isConfirmMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      await sweet.error({
        title: "Konfirmasi Sandi Gagal",
        text: "Sandi baru dan konfirmasi sandi tidak cocok.",
      });
      return;
    }

    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.ok) {
      await sweet.error({
        title: "Sandi Tidak Valid",
        text: passwordCheck.error,
      });
      return;
    }

    setLoadingPassword(true);

    try {
      // Kirim plaintext ke service, biarkan backend yang memverifikasi & menghashing
      await authService.updatePassword(currentPassword, newPassword);

      await sweet.success({
        title: "Berhasil",
        text: "Sandi berhasil diperbarui.",
        timer: 1500,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.push("/profile");
    } catch (error: any) {
      await sweet.error({
        title: "Gagal Mengubah Sandi",
        text: error.message || "Terjadi kesalahan pada server.",
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loadingPassword,
    strength,
    isConfirmMismatch,
    handleUpdatePassword,
  };
}