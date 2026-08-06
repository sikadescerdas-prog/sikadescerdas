// modules/dashboard/facility/services/type.service.ts

import type {
  FacilityType,
  FacilityTypeForm,
} from "../types/facility.types";

const API_URL = "/api/dashboard/facility/type";

// =========================
// GET ALL
// =========================

export async function getFacilityTypes(): Promise<FacilityType[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Gagal mengambil jenis fasilitas");
  }

  return res.json();
}

// =========================
// GET DETAIL
// =========================

export async function getFacilityTypeById(id: string): Promise<FacilityType> {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Gagal mengambil detail jenis fasilitas");
  }

  return res.json();
}

// =========================
// CREATE
// =========================

export async function createFacilityType(
  data: FacilityTypeForm
): Promise<FacilityType> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal membuat jenis fasilitas");
  }

  return res.json();
}

// =========================
// UPDATE
// =========================

export async function updateFacilityType(
  id: string,
  data: FacilityTypeForm
): Promise<FacilityType> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal update jenis fasilitas");
  }

  return res.json();
}

// =========================
// DELETE
// =========================

export async function deleteFacilityType(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal menghapus jenis fasilitas");
  }
}