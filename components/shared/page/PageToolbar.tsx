// components/shared/page/PageToolbar.tsx

"use client";

import { useRef, useState } from "react";
import { RotateCcw, BookOpen, type LucideIcon } from "lucide-react";
import { useSwipe } from "@/shared/hooks/useSwipe";

interface FilterItem {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface Props {
  title: string;
  filters: FilterItem[];
  activeFilter: string;
  search: string;
  onFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onReset?: () => void;
  onAdd?: () => void;
}

export default function PageToolbar({
  title,
  filters,
  activeFilter,
  search,
  onFilterChange,
  onReset,
}: Props) {
  const [searchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const swipeRef =
    useSwipe(1.2) as React.RefObject<HTMLDivElement | null>;

  const handleReset = () => {
    onReset?.();
  };

  return (
    <>
      {/* TOOLBAR */}
      <div className="sticky top-0 z-30 py-2">
        <div className="border border-gray-200/70 bg-white/80 p-3 shadow-sm backdrop-blur-md">
          <div className="flex w-full items-center justify-between gap-4">
            {/* LEFT TITLE */}
            <div className="hidden shrink-0 items-center gap-3 md:flex">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 text-white shadow-lg shadow-green-200">
                <BookOpen size={24} strokeWidth={2.2} />

                <div className="absolute -right-3 -top-3 h-9 w-9 rounded-full bg-white/20" />
              </div>

              <div>
                <h2 className="text-base font-bold tracking-tight text-gray-900">
                  {title}
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  List artikel dan buku {title.toLowerCase()}
                </p>
              </div>
            </div>

            {/* RIGHT AREA */}
            <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
              {/* CATEGORY */}
              <div className="flex min-w-0 items-center">
                <span className="mr-2 hidden text-[10px] font-semibold uppercase tracking-wider text-gray-400 lg:block">
                  Category
                </span>

                <div
                  ref={swipeRef}
                  className="
                    flex min-w-0 items-center gap-1.5
                    overflow-x-auto scrollbar-hide
                    cursor-grab active:cursor-grabbing
                    select-none touch-pan-x
                  "
                >
                  {filters.map((filter) => {
                    const active = activeFilter === filter.value;
                    const Icon = filter.icon;

                    return (
                      <button
                        key={filter.value}
                        type="button"
                        onClick={() => onFilterChange(filter.value)}
                        className={`flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-medium transition-all ${
                          active
                            ? "bg-green-50 text-green-600 shadow-sm"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {Icon && <Icon size={15} />}
                        <span>{filter.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ACTION */}
              <div className="flex shrink-0 items-center gap-2 border-l border-gray-200 pl-3">
                {search && (
                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Reset pencarian"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-green-600 text-green-600 transition hover:bg-green-50"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}