// modules/dashboard/services/village.service.ts

import type {
  VillageProfile,
  UpdateVillageProfilePayload,
} from "../types/village.types";

const API_URL = "/api/dashboard/village";

// =========================
// GET VILLAGE PROFILE
// =========================
export async function getVillageProfile(): Promise<VillageProfile> {
  const response = await fetch(API_URL, {
    method: "GET",
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ?? "Gagal mengambil profil desa"
    );
  }

  return result.data;
}

// =========================
// UPDATE VILLAGE PROFILE
// =========================
export async function updateVillageProfile(
  payload: UpdateVillageProfilePayload
): Promise<VillageProfile> {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ?? "Gagal memperbarui profil desa"
    );
  }

  return result.data;
}