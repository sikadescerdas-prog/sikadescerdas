// modules/news/services/news.service.ts

import type { NewsResponse, NewsFilter } from "../types/news.types";

const API_URL = "/api/news";

export async function getNews(
  filter: NewsFilter = {}
): Promise<NewsResponse> {
  const params = new URLSearchParams();

  params.set("page", String(filter.page ?? 1));
  params.set("limit", String(filter.limit ?? 12));

  if (filter.category) {
    params.set("category", filter.category);
  }

  if (filter.search) {
    params.set("search", filter.search);
  }

  const res = await fetch(
    `${API_URL}?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Gagal mengambil berita");
  }

  return res.json();
}