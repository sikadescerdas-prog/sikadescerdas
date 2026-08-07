// app/setup/page.tsx

"use client";

import { useState } from "react";
import {
  ShieldCheck,
  User,
  Mail,
  UserRoundCog,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SetupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!form.password.trim()) {
      alert("Password wajib diisi.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Konfirmasi password tidak sesuai.");
      return;
    }

    try {
      const response = await fetch("/api/setup/create", {
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
        alert(result.message ?? "Setup gagal.");
        return;
      }

      alert(result.message);

      setForm({
        fullname: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });

      window.location.replace("/login");
    } catch (error) {
      console.error("SETUP ERROR:", error);
      alert("Terjadi kesalahan server.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-10 text-center text-white">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
              <ShieldCheck size={42} />
            </div>

            <h1 className="text-3xl font-bold">
              Setup Super Administrator
            </h1>

            <p className="mt-3 text-sm text-green-50 leading-relaxed">
              Buat akun Super Administrator pertama untuk mengelola sistem
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
                  placeholder="Nama lengkap"
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
                  placeholder="admin@email.com"
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
                  placeholder="superadmin"
                  required
                  className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>
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
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
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
                  onClick={() =>
                    setShowConfirmPassword((v) => !v)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-6 text-amber-800">
                <span className="font-semibold">
                  Perhatian:
                </span>
                <br />
                Setup ini hanya dapat dilakukan satu kali. Setelah akun
                Super Administrator berhasil dibuat, halaman setup akan
                dinonaktifkan.
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-green-600 font-semibold text-white transition hover:bg-green-700 active:scale-[0.99]"
            >
              Buat Super Administrator
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}