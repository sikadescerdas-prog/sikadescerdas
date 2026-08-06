// modules/dashboard/facility/services/facility.service.ts

import type {
  Facility,
  FacilityCreatePayload,
} from "../types/facility.types";

const API_URL = "/api/dashboard/facility";

// =========================
// GET ALL
// =========================
export async function getFacilities(): Promise<Facility[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Gagal mengambil data fasilitas");
  }

  return res.json();
}

// =========================
// GET DETAIL
// =========================
export async function getFacilityById(id: string): Promise<Facility> {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Gagal mengambil detail fasilitas");
  }

  return res.json();
}

// =========================
// CREATE
// =========================
export async function createFacility(
  data: FacilityCreatePayload
): Promise<Facility> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal menambah fasilitas");
  }

  return res.json();
}

// =========================
// UPDATE
// =========================
export async function updateFacility(
  id: string,
  data: Partial<FacilityCreatePayload>
): Promise<Facility> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal update fasilitas");
  }

  return res.json();
}

// =========================
// DELETE
// =========================
export async function deleteFacility(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal menghapus fasilitas");
  }
}