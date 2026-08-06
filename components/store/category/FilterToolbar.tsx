// components/store/category/FilterToolbar.tsx

"use client";

import { useState } from "react";
import { FaSortDown, FaSortUp, FaUndo, FaFilter, FaTimes, FaCheck } from "react-icons/fa";
import type { SortOption } from "@/shared/types/filter.types";

interface FilterToolbarProps {
  mobile?: boolean;
  sort: SortOption;
  hasFilter: boolean;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
}

export default function FilterToolbar({ mobile = false, sort, hasFilter, onSortChange, onReset }: FilterToolbarProps) {
  const [open, setOpen] = useState(false);

  function handleTerbaru() {
    if (sort === "newest") {
      onSortChange("default");
      return;
    }
    onSortChange("newest");
  }

  function handleTerlama() {
    if (sort === "oldest") {
      onSortChange("default");
      return;
    }
    onSortChange("oldest");
  }

  function handleHarga() {
    if (sort === "price-low") {
      onSortChange("price-high");
      return;
    }
    if (sort === "price-high") {
      onSortChange("default");
      return;
    }
    onSortChange("price-low");
  }

  const isTerbaru = sort === "newest";
  const isTerlama = sort === "oldest";
  const isHarga = sort === "price-low" || sort === "price-high";

  /* MOBILE */
  if (mobile) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`relative flex w-10 flex-col items-center justify-center gap-1 text-[7px] font-semibold transition ${hasFilter ? "text-emerald-600" : "text-slate-500"}`}
        >
          <span className="relative">
            <FaFilter size={11} />
            {hasFilter && <span className="absolute -right-2 -top-2 flex h-2 items-center justify-center rounded-full bg-emerald-500 px-1 shadow-sm" />}
          </span>
          <span>Filter</span>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-20 z-50 w-55 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">Filter Produk</h3>
                <button type="button" onClick={() => setOpen(false)} className="text-slate-400">
                  <FaTimes />
                </button>
              </div>

              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase text-slate-400">Urutkan</p>

                <button
                  type="button"
                  onClick={handleTerbaru}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${isTerbaru ? "bg-emerald-50 text-emerald-600" : "text-slate-600"}`}
                >
                  Terbaru
                  {isTerbaru && <FaCheck size={12} />}
                </button>

                <button
                  type="button"
                  onClick={handleTerlama}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${isTerlama ? "bg-emerald-50 text-emerald-600" : "text-slate-600"}`}
                >
                  Terlama
                  {isTerlama && <FaCheck size={12} />}
                </button>

                <button
                  type="button"
                  onClick={handleHarga}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${isHarga ? "bg-emerald-50 text-emerald-600" : "text-slate-600"}`}
                >
                  Harga
                  {sort === "price-low" && <FaSortUp />}
                  {sort === "price-high" && <FaSortDown />}
                </button>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white"
                >
                  <FaCheck size={12} />
                  Terapkan
                </button>

                {hasFilter && (
                  <button
                    type="button"
                    onClick={() => {
                      onReset();
                      setOpen(false);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm text-slate-600"
                  >
                    <FaUndo size={12} />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  /* DESKTOP */
  return (
    <div className="flex flex-col">
      <h2 className="hidden text-sm font-semibold text-emerald-600 md:block md:text-base">Filter Produk</h2>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleTerbaru}
          className={`text-sm font-medium ${isTerbaru ? "text-emerald-600" : "text-slate-500 hover:text-emerald-600"}`}
        >
          Terbaru
        </button>

        <span>|</span>

        <button
          type="button"
          onClick={handleTerlama}
          className={`text-sm font-medium ${isTerlama ? "text-emerald-600" : "text-slate-500 hover:text-emerald-600"}`}
        >
          Terlama
        </button>

        <span>|</span>

        <button
          type="button"
          onClick={handleHarga}
          className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-emerald-600"
        >
          Harga
          {sort === "price-low" && <FaSortUp />}
          {sort === "price-high" && <FaSortDown />}
        </button>

        {hasFilter && (
          <>
            <span>|</span>
            <button
              type="button"
              onClick={onReset}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-200 text-emerald-600"
            >
              <FaUndo size={10} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}