// components/store/category/SearchOverlay.tsx

"use client";

import { useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchOverlayProps {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  onClear: () => void;
}

export default function SearchOverlay({ open, value, onChange, onSubmit, onClose, onClear }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => { inputRef.current?.focus(); }, 100);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" />

      <div className="fixed left-0 right-0 top-3 z-50 flex justify-center px-4">
        <div className="flex w-full max-w-2xl items-center rounded-full border border-slate-200 bg-white px-4 py-2 shadow-2xl">
          <FaSearch size={15} className="mr-3 shrink-0 text-slate-400" />

          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
              if (e.key === "Escape") onClose();
            }}
            placeholder="Cari produk, toko, atau kategori..."
            className="h-10 flex-1 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />

          {value && (
            <button
              type="button"
              onClick={onClear}
              className="mr-2 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <FaTimes size={12} />
            </button>
          )}

          <button
            type="button"
            onClick={onSubmit}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Cari
          </button>
        </div>
      </div>
    </>
  );
}