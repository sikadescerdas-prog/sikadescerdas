// modules/dashboard/potential/services/potential.service.ts

import type {
  Potential,
  PotentialCreatePayload,
} from "../types/potential.types";

const API_URL = "/api/dashboard/potential";

// =========================
// GET ALL
// =========================
export async function getPotentials(): Promise<Potential[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Gagal mengambil data potensi");
  }

  return res.json();
}

// =========================
// GET DETAIL
// =========================
export async function getPotentialById(id: string): Promise<Potential> {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Gagal mengambil detail potensi");
  }

  return res.json();
}

// =========================
// CREATE
// =========================
export async function createPotential(
  data: PotentialCreatePayload
): Promise<Potential> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal menambah potensi");
  }

  return res.json();
}

// =========================
// UPDATE
// =========================
export async function updatePotential(
  id: string,
  data: Partial<PotentialCreatePayload>
): Promise<Potential> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal memperbarui potensi");
  }

  return res.json();
}

// =========================
// DELETE
// =========================
export async function deletePotential(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal menghapus potensi");
  }
}