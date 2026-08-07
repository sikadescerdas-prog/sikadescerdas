// app/dashboard/users/form/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  User,
  Mail,
  UserRoundCog,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function CreateAdminDesaPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.password.trim()) {
      alert("Password wajib diisi.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Konfirmasi password tidak sesuai.");
      return;
    }

    setSubmitting(true);

    try {
      // Disesuaikan ke endpoint /api/users/create
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: form.fullname,
          email: form.email,
          username: form.username,
          password: form.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Gagal membuat Admin Desa.");
      }

      alert("Admin Desa berhasil dibuat!");
      router.push("/dashboard/users");
      router.refresh();
    } catch (error: any) {
      console.error("CREATE ADMIN ERROR:", error);
      alert(error.message || "Terjadi kesalahan server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-12">
      <div className="mx-auto max-w-lg">
        {/* Tombol Kembali */}
        <div className="mb-6">
          <Link
            href="/dashboard/users"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Manajemen Users</span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-10 text-center text-white">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
              <ShieldCheck size={42} />
            </div>

            <h1 className="text-3xl font-bold">
              Buat Admin Desa
            </h1>

            <p className="mt-3 text-sm text-green-50 leading-relaxed">
              Tambahkan akun pengurus atau Admin Desa baru untuk sistem
              <br />
              <span className="font-semibold">
                SIKADES CERDAS
              </span>
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-8"
          >
            {/* Nama */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Nama Lengkap
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  placeholder="Nama lengkap admin"
                  required
                  className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin.desa@email.com"
                  required
                  className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Username
              </label>

              <div className="relative">
                <UserRoundCog
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="admindesa"
                  required
                  className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Role (Readonly / Diset otomatis ke Admin) */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Role Akses
              </label>
              <select
                name="role"
                value={form.role}
                disabled
                className="h-12 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 text-gray-600 outline-none cursor-not-allowed"
              >
                <option value="admin">Admin Desa</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Akun ini otomatis diatur dengan hak akses tingkat Admin.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter"
                  required
                  className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-12 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Konfirmasi Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  required
                  className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-12 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 font-semibold text-white transition hover:bg-green-700 active:scale-[0.99] disabled:opacity-50"
            >
              {submitting && <Loader2 className="animate-spin" size={18} />}
              <span>Simpan Admin Desa</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}