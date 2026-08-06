// modules/dashboard/structure/services/period.service.ts

import type {
  StructurePeriod,
  StructurePeriodForm,
} from "../types/structure.types";

const API_URL = "/api/dashboard/structure/periods";

// =========================================================
// API RESPONSE TYPE
// =========================================================

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

// =========================================================
// PARSE RESPONSE SAFE
// =========================================================

async function parseResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  const text = await response.text();

  if (!text) {
    return {} as ApiResponse<T>;
  }

  try {
    return JSON.parse(text);
  } catch {
    return {} as ApiResponse<T>;
  }
}

// =========================================================
// GET ALL PERIODS
// =========================================================

export async function getPeriods(): Promise<StructurePeriod[]> {
  const response = await fetch(API_URL, {
    method: "GET",
    cache: "no-store",
  });

  const result = await parseResponse<StructurePeriod[]>(response);

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil data periode");
  }

  return result.data ?? [];
}

// =========================================================
// GET DETAIL PERIOD
// =========================================================

export async function getPeriod(id: string): Promise<StructurePeriod> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const result = await parseResponse<StructurePeriod>(response);

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil detail periode");
  }

  return result.data;
}

// =========================================================
// CREATE PERIOD
// =========================================================

export async function createPeriod(
  payload: StructurePeriodForm
): Promise<StructurePeriod> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await parseResponse<StructurePeriod>(response);

  if (!response.ok) {
    throw new Error(result.message || "Gagal menambahkan periode");
  }

  return result.data;
}

// =========================================================
// UPDATE PERIOD
// =========================================================

export async function updatePeriod(
  id: string,
  payload: StructurePeriodForm
): Promise<StructurePeriod> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await parseResponse<StructurePeriod>(response);

  if (!response.ok) {
    throw new Error(result.message || "Gagal memperbarui periode");
  }

  return result.data;
}

// =========================================================
// DELETE PERIOD
// =========================================================

export async function deletePeriod(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await parseResponse<null>(response);

  if (!response.ok) {
    throw new Error(result.message || "Gagal menghapus periode");
  }
}