// app/product/form/page.tsx

import { Suspense } from "react";
import ProductFormPage from "@/components/product/form/ProductFormPage";

function ProductFormLoading() {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Memuat form produk...
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ProductFormLoading />}>
      <ProductFormPage />
    </Suspense>
  );
}