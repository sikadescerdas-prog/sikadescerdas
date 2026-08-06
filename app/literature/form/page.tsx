// app/literature/form/page.tsx

import { Suspense } from "react";
import LiteratureFormPage from "@/components/literature/form/LiteratureFormPage";

function LoadingLiteratureForm() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />

        <p className="text-sm text-gray-500">
          Memuat halaman...
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingLiteratureForm />}>
      <LiteratureFormPage />
    </Suspense>
  );
}