// modules/news/hooks/useNews.ts

"use client";

import { useEffect, useState } from "react";
import { getNews } from "../services/news.service";
import type { NewsFilter, NewsResponse } from "../types/news.types";

export function useNews(filter: NewsFilter = {}) {
  const page = filter.page ?? 1;
  const limit = filter.limit ?? 12;
  const category = filter.category ?? "";
  const search = filter.search ?? "";

  const [data, setData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadNews() {
      try {
        setLoading(true);
        setError(null);

        const result = await getNews({
          page,
          limit,
          category,
          search,
        });

        if (active) {
          setData(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil berita"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadNews();

    return () => {
      active = false;
    };
  }, [page, limit, category, search]);

  return {
    data,
    featured: data?.featured ?? [],
    news: data?.data ?? [],
    pagination: data?.pagination,
    loading,
    error,
  };
}