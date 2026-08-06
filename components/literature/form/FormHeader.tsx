// components/literature/form/FormHeader.tsx

"use client";

import { ArrowLeft } from "lucide-react";

interface Props {
  isEdit?: boolean;
  type: "article" | "book";
  onBack: () => void;
}

export default function FormHeaderLiterature({ isEdit = false, type, onBack }: Props) {
  const title = type === "article" ? "Artikel Literasi" : "Buku Literasi";
  const description = type === "article" ? "Kelola artikel dan informasi literasi" : "Kelola koleksi buku dan bahan bacaan";

  return (
    <div className="rounded-t-2xl border-b border-gray-300 bg-white px-8 py-6">
      <div className="flex items-center gap-4">
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-800"
          title="Kembali"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-800">
            {isEdit ? `Edit ${title}` : `Tambah ${title}`}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}