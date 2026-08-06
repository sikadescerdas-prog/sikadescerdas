// core/profile/helpers/getInitials.ts

/* =========================
   GET INITIALS HELPER
========================= */
export function getInitials(name?: string | null): string {
  if (!name || typeof name !== "string") {
    return "U";
  }

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "U";
  }

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  const [firstWord, secondWord] = words;
  return (firstWord.charAt(0) + secondWord.charAt(0)).toUpperCase();
}