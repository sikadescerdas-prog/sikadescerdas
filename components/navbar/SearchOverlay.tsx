// components/navbar/SearchOverlay.tsx

"use client";

import { useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchOverlayProps {
  open: boolean;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  onClear: () => void;
}

export default function SearchOverlay({ open, value, placeholder = "Cari...", onChange, onSubmit, onClose, onClear }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyboard(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") onSubmit();
    }

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [open, onClose, onSubmit]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-0 right-0 top-[20px] z-50 px-3 py-3 sm:px-4">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          {/* SEARCH GROUP */}
          <div className="flex h-11 flex-1 items-center overflow-hidden rounded-xl border border-emerald-300 bg-white shadow-lg transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
            <FaSearch size={14} className="ml-3 text-emerald-500" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit();
                if (e.key === "Escape") onClose();
              }}
              className="flex-1 bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            {value && (
              <button type="button" onClick={onClear} className="mr-2 text-slate-400 hover:text-emerald-600">
                <FaTimes size={12} />
              </button>
            )}
            <button type="button" onClick={onSubmit} className="flex h-full items-center gap-1.5 bg-emerald-500 px-4 text-xs font-semibold text-white hover:bg-emerald-600">
              <FaSearch size={12} />
              <span className="hidden sm:inline">Cari</span>
            </button>
          </div>

          {/* CLOSE BUTTON */}
          <button type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white text-red-500 shadow-lg transition hover:bg-red-50 hover:text-red-600 active:scale-95" title="Tutup">
            <FaTimes size={15} />
          </button>
        </div>
      </div>
    </>
  );
}