// components/product/form/GeneralProduct.tsx

"use client";

import { formatRibuan } from "@/shared/utils/formatRibuan";

interface ProductCategory {
  id: string;
  name: string;
}

interface Props {
  name: string;
  slug: string;
  categoryId: string | null;
  categories: ProductCategory[];
  price: string;
  stock: string;
  unit: string;
  weight: string;
  description: string;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onStockChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const units = [
  { value: "pcs", label: "Pcs" },
  { value: "pack", label: "Pack" },
  { value: "box", label: "Box" },
  { value: "botol", label: "Botol" },
  { value: "bungkus", label: "Bungkus" },
  { value: "lusin", label: "Lusin" },
  { value: "unit", label: "Unit" },
];

export default function GeneralProduct({
  name,
  slug,
  categoryId,
  categories,
  price,
  stock,
  unit,
  weight,
  description,
  onNameChange,
  onCategoryChange,
  onPriceChange,
  onStockChange,
  onUnitChange,
  onWeightChange,
  onDescriptionChange,
}: Props) {
  const priceNumber = String(price ?? "").replace(/\D/g, "");
  const stockNumber = String(stock ?? "").replace(/\D/g, "");
  const weightNumber = String(weight ?? "").replace(/[^\d,]/g, "");

  return (
    <div className="space-y-5">
      {/* NAMA */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Nama Produk <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          value={name ?? ""}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Contoh: Keripik Kentang Manis"
          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        {slug && (
          <p className="mt-1 text-xs text-gray-400">
            Slug: <span className="text-gray-500">{slug}</span>
          </p>
        )}
      </div>

      {/* KATEGORI */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Kategori <span className="text-red-500">*</span>
        </label>

        <select
          value={categoryId ?? ""}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="">Pilih kategori produk</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* DESKRIPSI */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Deskripsi Produk
        </label>

        <textarea
          value={description ?? ""}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={8}
          placeholder="Jelaskan informasi penting mengenai produk..."
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* HARGA + STOK + SATUAN + BERAT */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* HARGA */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Harga <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              Rp
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={priceNumber ? formatRibuan(priceNumber) : ""}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="0"
              className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* STOK */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Stok <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            inputMode="numeric"
            value={stockNumber}
            onChange={(e) => onStockChange(e.target.value)}
            placeholder="0"
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* SATUAN */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Satuan Produk
          </label>

          <select
            value={unit ?? ""}
            onChange={(e) => onUnitChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Pilih satuan</option>

            {units.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* BERAT */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Berat
          </label>

          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={weightNumber}
              onChange={(e) => onWeightChange(e.target.value)}
              placeholder="Contoh: 200,75"
              className="h-10 w-full rounded-lg border border-gray-300 px-3 pr-14 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              gram
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}