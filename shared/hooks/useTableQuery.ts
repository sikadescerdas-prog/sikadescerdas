// shared/hooks/useTableQuery.ts

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface UseTableQueryOptions { defaultPage?: number; defaultLimit?: number; defaultSearch?: string; defaultCategory?: string; defaultYear?: string; debounce?: number; }

export function useTableQuery(options: UseTableQueryOptions = {}) {
  const { defaultPage = 1, defaultLimit = 10, defaultSearch = "", defaultCategory = "", defaultYear = "", debounce = 500 } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? defaultSearch);
  const [category, setCategory] = useState(searchParams.get("category") ?? defaultCategory);
  const [year, setYear] = useState(searchParams.get("year") ?? defaultYear);
  const [page, setPage] = useState(Number(searchParams.get("page")) || defaultPage);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || defaultLimit);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); }, debounce);
    return () => clearTimeout(timer);
  }, [search, debounce]);

  useEffect(() => {
    setPage(defaultPage);
  }, [debouncedSearch, category, year, limit, defaultPage]);

  const filter = useMemo(() => ({
    search: debouncedSearch || undefined,
    category: category || undefined,
    year: year ? Number(year) : undefined,
    page,
    limit,
  }), [debouncedSearch, category, year, page, limit]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category", category);
    if (year) params.set("year", year);
    if (page > defaultPage) params.set("page", String(page));
    if (limit !== defaultLimit) params.set("limit", String(limit));
    return params.toString();
  }, [debouncedSearch, category, year, page, limit, defaultPage, defaultLimit]);

  useEffect(() => {
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    const currentUrl = pathname + window.location.search;

    if (currentUrl !== nextUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [pathname, queryString, router]);

  function resetFilters() {
    setSearch(defaultSearch);
    setCategory(defaultCategory);
    setYear(defaultYear);
    setPage(defaultPage);
    setLimit(defaultLimit);
  }

  return useMemo(() => ({
    search,
    setSearch,
    category,
    setCategory,
    year,
    setYear,
    page,
    setPage,
    limit,
    setLimit,
    filter,
    queryString,
    resetFilters,
  }), [search, category, year, page, limit, filter, queryString]);
}