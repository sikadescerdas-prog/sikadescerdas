// app/store/page.tsx

import { Suspense } from "react";
import StorePageClient from "@/components/store/StorePageClient";

function StoreLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-500">
        Memuat marketplace...
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<StoreLoading />}>
      <StorePageClient />
    </Suspense>
  );
}