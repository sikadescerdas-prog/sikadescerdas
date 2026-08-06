// core/auth/hooks/useRegister.ts

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/core/auth/services/auth.service";
import { sweet } from "@/shared/utils/sweet";
import { validateUsername } from "@/core/auth/helpers/username";
import { validateEmail } from "@/core/auth/helpers/email";
import { getPasswordStrength } from "@/core/auth/helpers/password";
import type { FieldErrors } from "@/core/auth/types/user.types";

/* =========================
   INITIAL STATE
========================= */
const initialState = {
  username: "",
  fullname: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
};

function clearError(prev: FieldErrors, key: keyof FieldErrors): FieldErrors {
  return {
    ...prev,
    [key]: undefined,
  };
}

/* =========================
   USE REGISTER HOOK
========================= */
export function useRegister() {
  const router = useRouter();

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [strength, setStrength] = useState({ score: 0, label: "" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  /* =========================
     CHANGE HANDLER
  ========================= */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (name === "username") {
      if (value.length >= 3) {
        validateFieldUsername(value);
      } else {
        setErrors((prev) => ({
          ...prev,
          username: "Username minimal 3 karakter",
        }));
      }
    }

    if (name === "password") {
      setStrength(getPasswordStrength(value));
    }

    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => clearError(prev, name as keyof FieldErrors));
    }
  };

  /* =========================
     FIELD VALIDATIONS
  ========================= */
  const validateFieldUsername = async (username: string) => {
    const result = validateUsername(username);

    if (!result.ok) {
      setErrors((prev) => ({
        ...prev,
        username: result.error,
      }));
      return;
    }

    setIsCheckingUsername(true);

    try {
      const res = await fetch("/api/auth/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (data.exists) {
        setErrors((prev) => ({
          ...prev,
          username: "Username sudah dipakai",
        }));
      } else {
        setErrors((prev) => clearError(prev, "username"));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        username: "Gagal mengecek username",
      }));
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const validateFieldFullname = (fullname: string) => {
    if (!fullname.trim()) {
      setErrors((prev) => ({
        ...prev,
        fullname: "Nama lengkap wajib diisi",
      }));
    } else if (fullname.trim().length < 3) {
      setErrors((prev) => ({
        ...prev,
        fullname: "Nama minimal 3 karakter",
      }));
    } else {
      setErrors((prev) => clearError(prev, "fullname"));
    }
  };

  const validateFieldEmail = (email: string) => {
    const result = validateEmail(email);

    if (!result.ok) {
      setErrors((prev) => ({
        ...prev,
        email: result.error,
      }));
    } else {
      setErrors((prev) => clearError(prev, "email"));
    }
  };

  const validateFieldPassword = (password: string) => {
    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password wajib diisi",
      }));
    } else if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password minimal 8 karakter",
      }));
    } else {
      setErrors((prev) => clearError(prev, "password"));
    }
  };

  const validateFieldConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    if (!confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Konfirmasi password wajib diisi",
      }));
    } else if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Password tidak sama",
      }));
    } else {
      setErrors((prev) => clearError(prev, "confirmPassword"));
    }
  };

  /* =========================
     FORM VALIDATION CHECK
  ========================= */
  const validateAllFields = (): boolean => {
    if (!form.fullname.trim()) {
      setErrors((prev) => ({ ...prev, fullname: "Nama lengkap wajib diisi" }));
      sweet.error({ icon: "error", title: "Oops...", text: "Nama lengkap wajib diisi" });
      return false;
    }

    if (!form.username.trim()) {
      setErrors((prev) => ({ ...prev, username: "Username wajib diisi" }));
      sweet.error({ icon: "error", title: "Oops...", text: "Username wajib diisi" });
      return false;
    }

    const usernameValid = validateUsername(form.username);
    if (!usernameValid.ok) {
      setErrors((prev) => ({ ...prev, username: usernameValid.error }));
      sweet.error({ icon: "error", title: "Oops...", text: usernameValid.error });
      return false;
    }

    const emailValid = validateEmail(form.email);
    if (!emailValid.ok) {
      setErrors((prev) => ({ ...prev, email: emailValid.error }));
      sweet.error({ icon: "error", title: "Oops...", text: emailValid.error });
      return false;
    }

    if (!form.password) {
      setErrors((prev) => ({ ...prev, password: "Password wajib diisi" }));
      sweet.error({ icon: "error", title: "Oops...", text: "Password wajib diisi" });
      return false;
    }

    if (form.password.length < 8) {
      setErrors((prev) => ({ ...prev, password: "Password minimal 8 karakter" }));
      sweet.error({ icon: "error", title: "Oops...", text: "Password minimal 8 karakter" });
      return false;
    }

    if (!form.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Konfirmasi password wajib diisi" }));
      sweet.error({ icon: "error", title: "Oops...", text: "Konfirmasi password wajib diisi" });
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Password tidak sama" }));
      sweet.error({ icon: "error", title: "Oops...", text: "Password tidak sama" });
      return false;
    }

    if (!form.agree) {
      setErrors((prev) => ({ ...prev, agree: "Anda harus menyetujui Terms & Conditions" }));
      sweet.error({ icon: "error", title: "Oops...", text: "Silahkan setujui Terms & Conditions." });
      return false;
    }

    return true;
  };

  /* =========================
     SUBMIT HANDLER
  ========================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) return;

    setIsSubmitting(true);

    try {
      await authService.registerWithEmail({
        fullname: form.fullname,
        username: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      sweet.success({
        title: "Berhasil!",
        text: "Akun berhasil dibuat, silahkan login.",
        timer: 2000,
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";

      sweet.error({
        title: "Gagal",
        text: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     GOOGLE LOGIN HANDLER
  ========================= */
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    try {
      await authService.loginWithGoogle();
      router.push("/");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Google login gagal";

      sweet.error({
        title: "Gagal",
        text: message,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return {
    form,
    errors,
    strength,
    isSubmitting,
    isCheckingUsername,
    isGoogleLoading,
    handleChange,
    validateFieldFullname,
    validateFieldUsername,
    validateFieldEmail,
    validateFieldPassword,
    validateFieldConfirmPassword,
    handleSubmit,
    handleGoogleLogin,
  };
}