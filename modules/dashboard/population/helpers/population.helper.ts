// modules/dashboard/population/helpers/population.helper.ts

import type { PopulationDetailPayload } from "../types/population.types";

// =========================
// HITUNG TOTAL PENDUDUK
// =========================
export function calculateTotalPopulation(male: number, female: number): number {
  return Number(male || 0) + Number(female || 0);
}

// =========================
// FORMAT ANGKA
// =========================
export function formatPopulationNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value || 0);
}

// =========================
// HITUNG PELAJAR OTOMATIS
// =========================
// Pendidikan: Tidak / Belum Sekolah, SD, SMP, SMA
export function calculatePelajar(
  details: PopulationDetailPayload[],
  studentEducationIds: string[]
): number {
  return details
    .filter((item) => studentEducationIds.includes(item.item_id))
    .reduce((total, item) => total + Number(item.total || 0), 0);
}

// =========================
// HITUNG MAHASISWA OTOMATIS
// =========================
// Pendidikan: D3, D4 / S1, S2, S3
export function calculateMahasiswa(
  details: PopulationDetailPayload[],
  collegeEducationIds: string[]
): number {
  return details
    .filter((item) => collegeEducationIds.includes(item.item_id))
    .reduce((total, item) => total + Number(item.total || 0), 0);
}

// =========================
// GENERATE DETAIL KOSONG
// =========================
// Untuk FormPopulation agar semua master muncul
export function generateEmptyDetails(
  items: { id: string; sort_order: number }[]
): PopulationDetailPayload[] {
  return items.map((item) => ({
    item_id: item.id,
    total: 0,
    sort_order: item.sort_order,
  }));
}