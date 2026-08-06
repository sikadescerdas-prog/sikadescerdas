// modules/dashboard/potential/services/category.service.ts

"use client";

import type {
  PotentialCategory,
  PotentialCategoryForm,
} from "../types/potential.types";

const API = "/api/dashboard/potential/category";

// =========================
// GET CATEGORY
// =========================

export async function getPotentialCategories(): Promise<PotentialCategory[]> {
  const res = await fetch(API);

  if (!res.ok) {
    throw new Error("Gagal mengambil kategori potensi");
  }

  return res.json();
}

// =========================
// CREATE CATEGORY
// =========================

export async function createPotentialCategory(data: PotentialCategoryForm) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Gagal menambah kategori potensi");
  }

  return res.json();
}

// =========================
// UPDATE CATEGORY
// =========================

export async function updatePotentialCategory(
  id: string,
  data: PotentialCategoryForm
) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Gagal memperbarui kategori potensi");
  }

  return res.json();
}

// =========================
// DELETE CATEGORY
// =========================

export async function deletePotentialCategory(id: string) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Gagal menghapus kategori potensi");
  }

  return res.json();
}