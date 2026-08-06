// components/literature/FormLiterature.tsx

"use client";

import { BookOpen, FileText, Lock } from "lucide-react";
import type { LiteratureForm } from "@/modules/literature/types/literature.types";
import FormArticle from "./form/FormArticle";
import FormBook from "./form/FormBook";

interface Props {
  data: LiteratureForm;
  categories: { id: string; name: string }[];
  isEdit?: boolean;
  isSaving?: boolean;
  onChange: (data: LiteratureForm) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function FormLiterature({ data, categories, isEdit = false, isSaving = false, onChange, onSubmit, onBack }: Props) {
  const handleTypeChange = (type: "article" | "book") => {
    if (isEdit || isSaving || type === data.type) return;
    onChange({ ...data, type });
  };

  return (
    <div className="space-y-6">
      {/* TYPE TAB */}
      <div className="p-2">
        <div className="grid grid-cols-2 gap-2">
          {/* ARTIKEL */}
          <button
            type="button"
            onClick={() => handleTypeChange("article")}
            disabled={isEdit || isSaving}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${data.type === "article" ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md shadow-green-200" : "bg-gray-100 text-gray-500 hover:bg-green-50"} ${isEdit ? "cursor-not-allowed opacity-80" : ""}`}
          >
            <FileText size={18} className={data.type === "article" ? "text-white" : "text-green-500"} />
            <span>Artikel</span>
            {isEdit && data.type !== "article" && <Lock size={14} className="text-gray-400" />}
          </button>

          {/* BUKU */}
          <button
            type="button"
            onClick={() => handleTypeChange("book")}
            disabled={isEdit || isSaving}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${data.type === "book" ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200" : "bg-gray-100 text-gray-500 hover:bg-blue-50"} ${isEdit ? "cursor-not-allowed opacity-80" : ""}`}
          >
            <BookOpen size={18} className={data.type === "book" ? "text-white" : "text-blue-500"} />
            <span>Buku</span>
            {isEdit && data.type !== "book" && <Lock size={14} className="text-gray-400" />}
          </button>
        </div>
      </div>

      {/* FORM */}
      {data.type === "book" ? (
        <FormBook data={data} isEdit={isEdit} isSaving={isSaving} onChange={onChange} onSubmit={onSubmit} onBack={onBack} />
      ) : (
        <FormArticle data={data} categories={categories} isEdit={isEdit} isSaving={isSaving} onChange={onChange} onSubmit={onSubmit} onBack={onBack} />
      )}
    </div>
  );
}