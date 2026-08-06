// core/auth/helpers/password.ts

const COMMON_PASSWORDS = new Set([
  "password",
  "admin",
  "qwerty",
  "123456",
  "12345678",
]);

type PasswordValidationResult = {
  ok: boolean;
  score: number;
  label: string;
  error?: string;
};

type PasswordStrengthResult = {
  score: number;
  label: string;
};

const STRENGTH_LABELS: Record<number, string> = {
  0: "Terlalu pendek",
  1: "Sangat lemah",
  2: "Lemah",
  3: "Cukup",
  4: "Kuat",
  5: "Sangat kuat",
};

/* =========================
   VALIDATE PASSWORD
========================= */
export function validatePassword(password: string): PasswordValidationResult {
  if (!password) {
    return {
      ok: false,
      score: 0,
      label: "",
      error: "Password wajib diisi",
    };
  }

  const value = password.trim();

  if (value.length < 8) {
    return {
      ok: false,
      score: 0,
      label: STRENGTH_LABELS[0],
      error: "Password minimal 8 karakter",
    };
  }

  // Check Common & Repeated Passwords
  const normalizedPassword = value.toLowerCase();
  const isCommon = COMMON_PASSWORDS.has(normalizedPassword);
  const isRepeated = /^(.)\1+$/.test(value);

  // Character Type Check
  const hasLower = /[a-z]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[^a-zA-Z0-9]/.test(value);

  const typesCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  // Calculate Score
  let score = typesCount;

  if (isCommon) {
    score = Math.min(score, 2);
  }

  if (isRepeated) {
    score = 1;
  }

  if (typesCount === 4 && value.length >= 12) {
    score = 5;
  }

  const label = STRENGTH_LABELS[score] ?? "";

  return {
    ok: score >= 3,
    score,
    label,
    error: score < 3 ? label : undefined,
  };
}

/* =========================
   GET PASSWORD STRENGTH
========================= */
export function getPasswordStrength(password: string | null): PasswordStrengthResult {
  if (!password) {
    return {
      score: 0,
      label: "",
    };
  }

  const result = validatePassword(password);

  return {
    score: result.score,
    label: result.label,
  };
}