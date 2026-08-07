// components/auth/AccountSecurity.tsx

"use client";

import { useState } from "react";
import { KeyRound, UserX, AlertTriangle, Loader2, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InputGoogle from "@/components/ui/InputGoogle";
import StrengthPass from "@/components/ui/StrengthPass";
import { useUpdatePassword } from "@/core/auth/hooks/useUpdatePassword";

interface AccountSecurityProps {
  userId: string; // ID user yang sedang aktif/login
}

export default function AccountSecurity({ userId }: AccountSecurityProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
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
  } = useUpdatePassword();

  // Fungsi Hapus Akun yang disinkronkan dengan API Route
  async function handleDeleteAccount() {
    const confirmResult = await Swal.fire({
      title: "Hapus Akun Permanen?",
      text: "Tindakan ini tidak dapat dibatalkan. Semua data dan file Anda akan dihapus dari sistem.",
      icon: "warning",
      input: "password",
      inputPlaceholder: "Masukkan sandi Anda untuk konfirmasi",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus Akun",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
    });

    if (!confirmResult.isConfirmed || !confirmResult.value) return;

    try {
      setIsDeleting(true);

      // Tampilkan loading saat proses hapus berjalan
      Swal.fire({
        title: "Menghapus Akun...",
        text: "Mohon tunggu sebentar, sedang membersihkan data dan file aset.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        // Jika backend Anda memvalidasi password konfirmasi di body, kirimkan di sini:
        // body: JSON.stringify({ password: confirmResult.value }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus akun.");
      }

      await Swal.fire({
        title: "Berhasil!",
        text: "Akun Anda telah berhasil dihapus.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect ke halaman login atau home setelah akun terhapus
      router.push("/login");
      router.refresh();
    } catch (error: any) {
      Swal.fire({
        title: "Gagal!",
        text: error.message || "Terjadi kesalahan saat menghapus akun.",
        icon: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 via-white to-white px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white shadow-xl">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">

          {/* Tombol Kembali */}
          <div className="p-6 pb-0">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-full bg-gray-200/10 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-600"
            >
              <ArrowLeft size={18} />
              <span>Kembali</span>
            </Link>
          </div>

          {/* Header Judul */}
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <KeyRound size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pengaturan Sandi</h2>
                <p className="text-xs text-gray-500">Perbarui sandi akun Anda secara berkala</p>
              </div>
            </div>
          </div>

          {/* FORM UBAH SANDI */}
          <form onSubmit={handleUpdatePassword}>
            <div className="p-6 space-y-4">
              <div>
                <InputGoogle
                  name="currentPassword"
                  label="Sandi Saat Ini"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              {/* PASSWORD BARU & KONFIRMASI */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <InputGoogle
                    name="newPassword"
                    label="Sandi Baru"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {newPassword && (
                    <StrengthPass score={strength.score} label={strength.label} />
                  )}
                </div>

                <div>
                  <InputGoogle
                    name="confirmPassword"
                    label="Konfirmasi Sandi Baru"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={isConfirmMismatch ? "Password tidak sama" : undefined}
                  />
                </div>
              </div>
            </div>

            {/* Tombol Simpan Sandi */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-6 flex justify-end">
              <button
                type="submit"
                disabled={loadingPassword || isConfirmMismatch}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingPassword ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Perubahan Sandi</span>
                )}
              </button>
            </div>
          </form>

          {/* ZONA BERBAHAYA: HAPUS AKUN */}
          <div className="hidden border-t border-red-100 bg-red-50/50 p-6">
            <div className="flex items-center gap-3 border-b border-red-100 pb-4 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Zona Berbahaya</h3>
                <p className="text-xs text-red-600">Hapus akun secara permanen dari sistem</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs leading-relaxed text-gray-600">
                Setelah akun Anda dihapus, semua data sesi dan hak akses akan hilang selamanya dan tidak dapat dikembalikan.
              </p>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-70"
              >
                {isDeleting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <UserX size={18} />
                )}
                <span>{isDeleting ? "Menghapus..." : "Hapus Akun Ini"}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}