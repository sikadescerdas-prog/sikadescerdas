// modules/dashboard/structure/services/category.service.ts

const API_URL = "/api/dashboard/structure/categories";

export type CategoryType = "government" | "bpd" | "institution";

export interface CreateCategoryPayload {
  name: string;
  type: CategoryType;
  level?: number | null;
}

export interface UpdateCategoryPayload {
  name: string;
  level?: number | null;
}

// =========================
// GET ALL CATEGORIES
// =========================

export async function getCategories() {
  const response = await fetch(API_URL, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal mengambil kategori struktur"
    );
  }

  return result;
}

// =========================
// CREATE CATEGORY
// =========================

export async function createCategory(data: CreateCategoryPayload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal menambahkan kategori struktur"
    );
  }

  return result;
}

// =========================
// UPDATE CATEGORY
// =========================

export async function updateCategory(id: string, data: UpdateCategoryPayload) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal mengubah kategori struktur"
    );
  }

  return result;
}

// =========================
// DELETE CATEGORY
// =========================

export async function deleteCategory(id: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal menghapus kategori struktur"
    );
  }

  return result;
}