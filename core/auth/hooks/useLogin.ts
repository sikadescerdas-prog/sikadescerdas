// core/auth/hooks/useLogin.ts

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/core/auth/services/auth.service";
import { redirectByRole } from "@/core/auth/helpers/redirectByRole";
import { sweet } from "@/shared/utils/sweet";
import type { FieldErrors, UserRole } from "@/core/auth/types/user.types";

type LoginState = {
  identifier: string;
  password: string;
  remember: boolean;
};

type LoginUser = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  storeSlug?: string | null;
};

const initialState: LoginState = {
  identifier: "",
  password: "",
  remember: false,
};

function clearError(prev: FieldErrors, key: keyof FieldErrors): FieldErrors {
  return {
    ...prev,
    [key]: undefined,
  };
}

/* =========================
   USE LOGIN HOOK
========================= */
export function useLogin() {
  const router = useRouter();

  const [form, setForm] = useState<LoginState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  /* =========================
     CHANGE HANDLER
  ========================= */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => clearError(prev, name as keyof FieldErrors));
    }
  };

  /* =========================
     FIELD VALIDATIONS
  ========================= */
  const validateFieldIdentifier = (identifier: string) => {
    if (!identifier.trim()) {
      setErrors((prev) => ({
        ...prev,
        identifier: "Email atau Username wajib diisi",
      }));
    } else {
      setErrors((prev) => clearError(prev, "identifier"));
    }
  };

  const validateFieldPassword = (password: string) => {
    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password wajib diisi",
      }));
    } else {
      setErrors((prev) => clearError(prev, "password"));
    }
  };

  /* =========================
     SUBMIT HANDLER
  ========================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.identifier.trim()) {
      setErrors((prev) => ({
        ...prev,
        identifier: "Email atau Username wajib diisi",
      }));

      sweet.error({
        icon: "error",
        title: "Oops...",
        text: "Email atau Username wajib diisi",
      });
      return;
    }

    if (!form.password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password wajib diisi",
      }));

      sweet.error({
        icon: "error",
        title: "Oops...",
        text: "Password wajib diisi",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const user: LoginUser = await authService.loginWithIdentifier(
        form.identifier,
        form.password
      );

      sweet.success({
        title: "Berhasil!",
        text: "Login berhasil",
        timer: 1500,
      });

      const targetPath = redirectByRole(user.role, user.storeSlug);
      router.push(targetPath);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Username/Password salah";

      sweet.error({
        title: "Gagal Login",
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

      sweet.success({
        title: "Berhasil!",
        text: "Login Google berhasil",
      });

      router.push("/");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Login Google gagal";

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
    isSubmitting,
    isGoogleLoading,
    handleChange,
    validateFieldIdentifier,
    validateFieldPassword,
    handleSubmit,
    handleGoogleLogin,
  };
}