// modules/dashboard/news/services/news.service.ts

import type { News, NewsCreatePayload, NewsFilter, NewsListResponse } from "../types/news.types";

const API_URL = "/api/dashboard/news";

// =========================
// GET ALL
// =========================
export async function getNews(filter: NewsFilter = {}): Promise<NewsListResponse> {
  const params = new URLSearchParams();

  if (filter.search) params.set("search", filter.search);
  if (filter.category) params.set("category", filter.category);
  if (filter.year) params.set("year", String(filter.year));

  params.set("page", String(filter.page ?? 1));
  params.set("limit", String(filter.limit ?? 10));

  const res = await fetch(`${API_URL}?${params.toString()}`, { cache: "no-store" });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Gagal mengambil data berita");
  }

  return res.json();
}

// =========================
// GET DETAIL
// =========================
export async function getNewsById(id: string): Promise<News> {
  const res = await fetch(`${API_URL}/${id}`, { cache: "no-store" });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Gagal mengambil detail berita");
  }

  return res.json();
}

// =========================
// CREATE
// =========================
export async function createNews(data: NewsCreatePayload): Promise<News> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Gagal menambah berita");
  }

  return res.json();
}

// =========================
// UPDATE
// =========================
export async function updateNews(id: string, data: Partial<NewsCreatePayload>): Promise<News> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Gagal memperbarui berita");
  }

  return res.json();
}

// =========================
// DELETE
// =========================
export async function deleteNews(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Gagal menghapus berita");
  }
}

// =========================
// TOGGLE FEATURED
// =========================
export async function toggleFeatured(id: string, is_featured: boolean): Promise<News> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_featured }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Gagal mengubah berita unggulan");
  }

  return res.json();
}