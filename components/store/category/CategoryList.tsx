// components/store/category/CategoryList.tsx

"use client";

import { useSwipe } from "@/shared/hooks/useSwipe";
import { FaChevronRight } from "react-icons/fa";

interface Category {
  id: string;
  name: string;
}

interface CategoryListProps {
  categories: Category[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export default function CategoryList({ categories, activeCategory, onChange }: CategoryListProps) {
  const scrollRef = useSwipe();

  const isActive = (name: string) => activeCategory === name;

  const itemClass = (active: boolean) =>
    `group relative whitespace-nowrap py-2 text-sm font-medium transition-all duration-300 sm:text-base ${
      active ? "text-emerald-600" : "text-slate-500 hover:text-emerald-600"
    }`;

  return (
    <div className="md:block">
      <div className="flex items-center gap-3 md:block">
        <h2 className="mb-0 shrink-0 text-sm font-semibold leading-none text-emerald-600 md:text-base">
          <span className="hidden md:inline">Kategori Produk</span>
        </h2>

        <div className="relative min-w-0 flex-1 md:flex-none">
          <div
            ref={scrollRef}
            className="category-scroll overflow-x-auto overflow-y-hidden cursor-grab select-none touch-pan-x active:cursor-grabbing"
          >
            <div className="flex w-max items-center gap-4 pr-8">
              <button
                type="button"
                onClick={() => onChange("semua")}
                className={itemClass(isActive("semua"))}
              >
                Semua
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${
                    isActive("semua") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onChange(category.name)}
                  className={itemClass(isActive(category.name))}
                >
                  {category.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${
                      isActive(category.name) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute right-0 top-1/2 flex -translate-y-1/2 items-center bg-gradient-to-l from-white via-white/80 to-transparent pl-4 md:hidden">
            <FaChevronRight size={14} className="text-emerald-500" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .category-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-x: contain;
        }

        .category-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}