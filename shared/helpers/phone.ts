// shared/helpers/phone.ts

/**
 * Database (628123456789) -> Display (08123456789)
 */
export function phoneToDisplay(
  phone?: string | null
): string {
  if (!phone) return "";

  const value = phone.replace(/\s+/g, "");

  if (value.startsWith("62")) {
    return `0${value.slice(2)}`;
  }

  return value;
}

/**
 * Display (08123456789) -> Database (628123456789)
 */
export function phoneToDatabase(
  phone?: string | null
): string {
  if (!phone) return "";

  const value = phone.replace(/\s+/g, "");

  if (value.startsWith("08")) {
    return `62${value.slice(1)}`;
  }

  return value;
}

/**
 * Menghapus semua karakter selain angka.
 */
export function phoneOnlyNumber(
  phone?: string | null
): string {
  if (!phone) return "";

  return phone.replace(/\D/g, "");
}

/**
 * Normalisasi nomor telepon ke format database.
 * Contoh:
 * 0812 3456-7890 -> 6281234567890
 * +6281234567890 -> 6281234567890
 */
export function normalizePhone(
  phone?: string | null
): string {
  if (!phone) return "";

  let value = phone.replace(/\D/g, "");

  if (value.startsWith("0")) {
    value = `62${value.slice(1)}`;
  }

  return value;
}

/**
 * Validasi nomor telepon Indonesia.
 */
export function isValidPhone(
  phone?: string | null
): boolean {
  if (!phone) return false;

  const value = normalizePhone(phone);

  return /^62\d{8,15}$/.test(value);
}