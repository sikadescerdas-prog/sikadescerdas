// modules/dashboard/structure/services/position.service.ts

import type {
  StructurePosition,
  StructurePositionForm,
} from "../types/structure.types";

const API_URL = "/api/dashboard/structure/positions";

// =========================
// GET ALL POSITIONS
// =========================

export async function getPositions(): Promise<StructurePosition[]> {
  const response = await fetch(API_URL, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal mengambil jabatan struktur"
    );
  }

  return result.data ?? [];
}

// =========================
// GET BY CATEGORY
// =========================

export async function getPositionsByCategory(
  categoryId: string
): Promise<StructurePosition[]> {
  const response = await fetch(`${API_URL}?category_id=${categoryId}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal mengambil jabatan kategori"
    );
  }

  return result.data ?? [];
}

// =========================
// CREATE POSITION
// =========================

export async function createPosition(
  data: StructurePositionForm
): Promise<StructurePosition> {
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
      result.message || "Gagal menambahkan jabatan"
    );
  }

  return result.data;
}

// =========================
// UPDATE POSITION
// =========================

export async function updatePosition(
  id: string,
  data: StructurePositionForm
): Promise<StructurePosition> {
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
      result.message || "Gagal mengubah jabatan"
    );
  }

  return result.data;
}

// =========================
// DELETE POSITION
// =========================

export async function deletePosition(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal menghapus jabatan"
    );
  }
}