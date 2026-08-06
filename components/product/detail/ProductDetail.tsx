// components/product/details/ProductDetail.tsx

"use client";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductStore from "./ProductStore";
import ProductDescription from "./ProductDescription";

interface ProductDetailProps {
  product: any;
  storeSlug: string;
}

export default function ProductDetail({ product, storeSlug }: ProductDetailProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* LEFT */}
        <ProductGallery product={product} />

        {/* RIGHT */}
        <div className="space-y-5 px-4">
          <ProductInfo product={product} storeSlug={storeSlug} />
          <ProductStore product={product} storeSlug={storeSlug} />
          <ProductDescription product={product} />
        </div>
      </div>
    </div>
  );
}