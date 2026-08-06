// components/shared/table/CategoryFilter.tsx

"use client";

interface Option {
  label: string;
  value: string;
}

interface Props {
  value: string;
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function CategoryFilter({
  value,
  options,
  placeholder = "Semua Kategori",
  onChange,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 min-w-[180px] rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}