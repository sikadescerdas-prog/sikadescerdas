// modules/dashboard/home/services/dashboard.service.ts

import { DashboardApiResponse } from "../types/dashboard.types";

/**
 * Mengambil data lengkap dashboard SIKADES Danasari dari API backend.
 * Menggunakan opsi cache: "no-store" agar data selalu diperbarui secara real-time.
 */
export async function getDashboardData(): Promise<DashboardApiResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/dashboard`, {
      cache: "no-store", // SSR murni tanpa cache statis
    });

    if (!res.ok) {
      console.error(`Gagal memuat dashboard. Status: ${res.status}`);
      return null;
    }

    const json: DashboardApiResponse = await res.json();
    return json;
  } catch (error) {
    console.error("Terjadi kesalahan saat fetching data dashboard:", error);
    return null;
  }
}