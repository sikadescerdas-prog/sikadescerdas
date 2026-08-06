// components/shared/table/SearchInput.tsx

"use client";

import { Search, X } from "lucide-react";

interface Props {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
}

export default function SearchInput({
  value,
  placeholder = "Cari...",
  onChange,
  onSearch = () => {},
}: Props) {
  return (
    <div className="flex w-full max-w-sm gap-2">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-red-500"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onSearch}
        className="flex h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        <Search size={16} />
        Cari
      </button>
    </div>
  );
}