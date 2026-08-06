// modules/dashboard/population/services/population.service.ts

import type {
  Population,
  PopulationCategory,
  PopulationDetail,
  CreatePopulationPayload,
  UpdatePopulationPayload,
  PopulationDetailPayload,
} from "../types/population.types";

const API_URL = "/api/dashboard/population";

// =========================
// GET ALL POPULATION
// =========================
export async function getPopulations(): Promise<Population[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Gagal mengambil data penduduk");
  }

  return response.json();
}

// =========================
// CREATE POPULATION
// =========================
export async function createPopulation(
  payload: CreatePopulationPayload
): Promise<Population> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal menambahkan data penduduk");
  }

  return response.json();
}

// =========================
// GET DETAIL POPULATION
// =========================
export async function getPopulationById(id: string): Promise<Population> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Data penduduk tidak ditemukan");
  }

  return response.json();
}

// =========================
// UPDATE POPULATION
// =========================
export async function updatePopulation(
  id: string,
  payload: UpdatePopulationPayload
): Promise<Population> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal update data penduduk");
  }

  return response.json();
}

// =========================
// DELETE POPULATION
// =========================
export async function deletePopulation(
  id: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal menghapus data penduduk");
  }

  return response.json();
}

// =========================
// GET MASTER
// =========================
export async function getPopulationMaster(): Promise<PopulationCategory[]> {
  const response = await fetch(`${API_URL}/master`);

  if (!response.ok) {
    const error = await response.json();
    console.error("GET MASTER POPULATION ERROR:", error);
    throw new Error(error.message || "Gagal mengambil master penduduk");
  }

  return response.json();
}

// =========================
// GET DETAIL ITEM
// =========================
export async function getPopulationDetail(
  populationId: string
): Promise<PopulationDetail[]> {
  const response = await fetch(
    `${API_URL}/detail?population_id=${populationId}`
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil detail penduduk");
  }

  return response.json();
}

// =========================
// SAVE DETAIL
// =========================
export async function savePopulationDetail(
  populationId: string,
  details: PopulationDetailPayload[]
): Promise<PopulationDetail[]> {
  const response = await fetch(`${API_URL}/detail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      population_id: populationId,
      details,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal menyimpan detail penduduk");
  }

  return response.json();
}