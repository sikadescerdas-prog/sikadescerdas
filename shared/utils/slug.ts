// shared/utils/slug.ts

export function generateRandomSuffix(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export function generateProductSlug(name: string): string {
  const words = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 4);

  if (!words.length) {
    return generateRandomSuffix(8);
  }

  return `${words.join("-")}-${generateRandomSuffix(8)}`;
}