// components/auth/FormRegister.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import InputGoogle from "@/components/ui/InputGoogle";
import StrengthPass from "@/components/ui/StrengthPass";
import { useRegister } from "@/core/auth/hooks/useRegister";

export default function FormRegister() {
  const { form, errors, strength, isSubmitting, isCheckingUsername, isGoogleLoading, validateFieldUsername, handleChange, handleSubmit, handleGoogleLogin } = useRegister();

  const isDisabled = isSubmitting || !form.agree;

  return (
    <div className="relative mx-auto mb-3 w-full max-w-md">
      {/* CLOSE BUTTON */}
      <Link href="/" className="absolute -top-2 -right-2 rounded-full border border-green-200 p-2 transition-colors hover:bg-green-50">
        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </Link>

      {/* TITLE */}
      <div className="mb-4 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-[#25C95F]">Register</h2>
        <p className="mt-1 text-sm text-slate-500">Buat akun baru untuk mulai menggunakan Sikades Cerdas</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* FULLNAME */}
        <InputGoogle name="fullname" label="Nama Lengkap" type="text" value={form.fullname} onChange={handleChange} error={errors.fullname} placeholder="Contoh: John Doe" />

        {/* USERNAME */}
        <div className="relative">
          <InputGoogle name="username" label="Username" type="text" value={form.username} onChange={handleChange} onBlur={() => validateFieldUsername(form.username)} error={errors.username} placeholder="johndoe" showValidIcon={true} />
          {isCheckingUsername && <span className="absolute top-9 right-3 animate-pulse text-xs text-slate-400">Mengecek...</span>}
        </div>

        {/* EMAIL */}
        <InputGoogle name="email" label="E-mail" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="johndoe@gmail.com" showValidIcon={true} />

        {/* PASSWORD + CONFIRM (SEJAJAR) */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* PASSWORD */}
          <div>
            <InputGoogle name="password" label="Password" type="password" placeholder="********" value={form.password} onChange={handleChange} error={errors.password} />
            {form.password && <StrengthPass score={strength.score} label={strength.label} />}
          </div>

          {/* CONFIRM PASSWORD */}
          <InputGoogle name="confirmPassword" label="Konfirmasi Password" type="password" placeholder="********" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        </div>

        {/* CHECKBOX */}
        <div className="space-y-1">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-500">
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#25C95F]" />
            <span>Saya setuju dengan <span className="font-medium text-[#25C95F]">Terms & Conditions</span></span>
          </label>
          {errors.agree && <span className="block text-xs text-red-500">{errors.agree}</span>}
        </div>

        {/* REGISTER BUTTON */}
        <button type="submit" disabled={isDisabled} className="w-full rounded-xl bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] py-3 font-semibold text-white shadow-md transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? "Loading..." : "Register"}
        </button>

        {/* ERROR GENERAL */}
        {errors.general && <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">{errors.general}</div>}

        {/* OR DIVIDER */}
        <div className="hidden flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        {/* GOOGLE LOGIN */}
        <button type="button" onClick={handleGoogleLogin} disabled={isGoogleLoading} className="hidden flex w-full items-center justify-center gap-3 rounded-xl border border-green-300 bg-white py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-green-50 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70">
          <Image src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} className="h-5 w-5" />
          {isGoogleLoading ? "Loading..." : "Continue with Google"}
        </button>

        {/* LOGIN SPLIT LINE */}
        <div className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-slate-200" />
          <div className="flex items-center gap-1 whitespace-nowrap text-sm text-slate-500">
            <span>Sudah punya akun?</span>
            <Link href="/login" className="font-semibold text-[#25C95F] hover:underline">Login</Link>
          </div>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* DOT DECOR */}
        <div className="flex justify-center gap-2 pt-1">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-100" />
        </div>
      </form>
    </div>
  );
}