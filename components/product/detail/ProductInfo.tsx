// components/product/details/ProductInfo.tsx

"use client";

import ProductBreadcrumb from "./ProductBreadcrumb";

interface ProductInfoProps {
  product: any;
  storeSlug: string;
}

export default function ProductInfo({ product, storeSlug }: ProductInfoProps) {
  return (
    <div className="space-y-4">
      <ProductBreadcrumb storeSlug={storeSlug} storeName={product.storeName ?? ""} categoryName={product.category ?? ""} productName={product.name ?? ""} />
      <h1 className="text-xl sm:text-2xl font-extrabold leading-snug tracking-tight text-slate-900 md:text-3xl">{product.name}</h1>
      <div className="-mt-2 text-2xl sm:text-3xl font-black tracking-tight text-emerald-600 md:text-4xl">Rp {Number(product.price ?? 0).toLocaleString("id-ID")}</div>
    </div>
  );
}