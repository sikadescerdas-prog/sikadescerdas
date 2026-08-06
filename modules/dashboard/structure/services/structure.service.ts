// modules/dashboard/structure/services/structure.service.ts

import type { StructureResponse } from "../types/structure.types";

const API_URL = "/api/dashboard/structure";

export async function getStructure(): Promise<StructureResponse> {
  const response = await fetch(API_URL, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil struktur desa");
  }

  return response.json();
}