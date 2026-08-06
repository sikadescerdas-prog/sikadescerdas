// app/news/page.tsx

"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HeaderNews from "@/components/news/HeaderNews";
import ListNews from "@/components/news/ListNews";
import CategoryNews from "@/components/news/CategoryNews";
import NewsSkeleton from "@/components/news/NewsSkeleton";
import FeaturedNews from "@/components/news/FeaturedNews";
import { useNews } from "@/modules/news/hooks/useNews";

export default function NewsPage() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  const { featured, news, loading, error } = useNews({
    page: 1,
    limit: 12,
    category,
    search,
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <HeaderNews />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 md:px-6">
        {search && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-3 text-sm text-slate-600">
            Hasil pencarian:
            <span className="ml-1 font-semibold text-emerald-700">
              {search}
            </span>
          </div>
        )}

        {!search && !category && !loading && featured.length > 0 && (
          <FeaturedNews news={featured} />
        )}

        <CategoryNews
          active={category}
          onChange={(value) => {
            startTransition(() => {
              setCategory(value);
            });
          }}
        />

        {error && (
          <div className="rounded-xl bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {loading || isPending ? (
          <NewsSkeleton />
        ) : news.length > 0 ? (
          <ListNews news={news} />
        ) : (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-white text-center">
            <h2 className="text-xl font-bold text-slate-800">
              Belum Ada Berita
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Belum ada berita yang tersedia.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}