// modules/home/services/home.service.ts

import type {
  HomeData,
  HomeResponse,
} from "@/modules/home/types/home.types";

// Fungsi pembantu untuk mendeteksi URL secara dinamis
function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // Jika di sisi client
  
  // Jika di Vercel, gunakan VERCEL_URL secara otomatis
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Jika ada custom NEXT_PUBLIC_APP_URL, gunakan itu
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Fallback default lokal
  return "http://localhost:3000";
}

export async function getHomeData(): Promise<HomeData | null> {
  try {
    const baseUrl = getBaseUrl();
    
    const res = await fetch(`${baseUrl}/api/home`, {
      next: {
        revalidate: 60,
      },
    });

    const json = await res.json() as HomeResponse;

    if (!json.success) {
      return null;
    }

    return json.data;

  } catch (error) {
    console.error("HOME SERVICE ERROR", error);
    return null;
  }
}