// app/news/page.tsx

import { Suspense } from "react";
import NewsPage from "@/components/news/NewsPage";

function NewsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-sm text-slate-500">
        Memuat berita...
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<NewsLoading />}>
      <NewsPage />
    </Suspense>
  );
}