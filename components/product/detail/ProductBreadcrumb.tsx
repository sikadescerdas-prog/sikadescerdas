// components/product/details/ProductBreadcrumb.tsx

"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface ProductBreadcrumbProps {
  storeSlug: string;
  storeName: string;
  categoryName: string;
  productName: string;
}

export default function ProductBreadcrumb({ storeSlug, storeName, categoryName, productName }: ProductBreadcrumbProps) {
  return (
    <nav className="mb-3 flex flex-wrap items-center gap-x-1 gap-y-2 break-words text-sm text-slate-500">
      <Link href="/" className="flex shrink-0 items-center gap-1 transition hover:text-emerald-600">
        <Home className="h-4 w-4" />
        <span>Beranda</span>
      </Link>
      <ChevronRight className="h-4 w-4 shrink-0" />
      <Link href="/store" className="shrink-0 transition hover:text-emerald-600">Marketplace</Link>
      <ChevronRight className="h-4 w-4 shrink-0" />
      <Link href={`/store/${storeSlug}`} className="max-w-full break-words transition hover:text-emerald-600">{storeName}</Link>
      <ChevronRight className="h-4 w-4 shrink-0" />
      <span className="max-w-full break-words">{categoryName}</span>
      <ChevronRight className="h-4 w-4 shrink-0" />
      <span className="max-w-full break-words font-medium text-slate-800">{productName}</span>
    </nav>
  );
}