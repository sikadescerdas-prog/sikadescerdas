// modules/dashboard/facility/services/category.service.ts

import type {
  FacilityCategory,
  FacilityCategoryForm,
} from "../types/facility.types";

const API_URL = "/api/dashboard/facility/category";

// =========================
// GET ALL
// =========================

export async function getFacilityCategories(): Promise<FacilityCategory[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Gagal mengambil kategori");
  }

  return res.json();
}

// =========================
// GET DETAIL
// =========================

export async function getFacilityCategoryById(
  id: string
): Promise<FacilityCategory> {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Gagal mengambil detail kategori");
  }

  return res.json();
}

// =========================
// CREATE
// =========================

export async function createFacilityCategory(
  data: FacilityCategoryForm
): Promise<FacilityCategory> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal membuat kategori");
  }

  return res.json();
}

// =========================
// UPDATE
// =========================

export async function updateFacilityCategory(
  id: string,
  data: FacilityCategoryForm
): Promise<FacilityCategory> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal update kategori");
  }

  return res.json();
}

// =========================
// DELETE
// =========================

export async function deleteFacilityCategory(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal menghapus kategori");
  }
}