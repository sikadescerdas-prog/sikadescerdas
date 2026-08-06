// components/dashboard/product/form/CategoryProduct.tsx

"use client";

interface ProductCategory {
  id: string;
  name: string;
}

interface Props {
  categoryId: string;
  categories: ProductCategory[];
  onCategoryChange: (value: string) => void;
}

export default function CategoryProduct({
  categoryId,
  categories,
  onCategoryChange,
}: Props) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-base font-semibold text-gray-900">
          Kategori Produk
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Pilih kategori yang sesuai dengan produk.
        </p>
      </div>

      <select
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">Pilih kategori</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}