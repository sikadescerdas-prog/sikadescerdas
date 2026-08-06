// core/auth/helpers/username.ts

const RESERVED_USERNAMES = new Set([
  "admin",
  "root",
  "system",
  "api",
  "auth",
  "login",
  "register",
  "dashboard",
  "settings",
  "profile",
  "user",
  "null",
  "",
]);

type UsernameValidationResult = {
  ok: boolean;
  error?: string;
};

/* =========================
   VALIDATE USERNAME
========================= */
export function validateUsername(
  username: string | null
): UsernameValidationResult {
  if (!username) {
    return {
      ok: false,
      error: "Username wajib diisi",
    };
  }

  const value = username.trim();

  if (value.length < 3 || value.length > 20) {
    return {
      ok: false,
      error: "Username harus 3-20 karakter",
    };
  }

  if (/[A-Z]/.test(value)) {
    return {
      ok: false,
      error: "Username hanya boleh huruf kecil",
    };
  }

  if (!/^[a-z0-9._]+$/.test(value)) {
    return {
      ok: false,
      error: "Username hanya boleh huruf, angka, titik, dan underscore",
    };
  }

  if (
    value.startsWith(".") ||
    value.endsWith(".") ||
    value.startsWith("_") ||
    value.endsWith("_")
  ) {
    return {
      ok: false,
      error: "Username tidak boleh dimulai/diakhiri titik atau underscore",
    };
  }

  if (
    value.includes("..") ||
    value.includes("__") ||
    value.includes("._") ||
    value.includes("_.")
  ) {
    return {
      ok: false,
      error: "Username mengandung kombinasi karakter tidak valid",
    };
  }

  if (value.includes(".") && value.includes("_")) {
    return {
      ok: false,
      error: "Username tidak boleh mengombinasikan titik dan underscore",
    };
  }

  if (RESERVED_USERNAMES.has(value)) {
    return {
      ok: false,
      error: "Username tidak tersedia",
    };
  }

  return { ok: true };
}

/* =========================
   SANITIZE USERNAME
========================= */
export function sanitizeUsername(username: string): string {
  return username
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._]/g, "");
}