// app/literature/form/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormLiterature from "@/components/literature/FormLiterature";
import FormHeaderLiterature from "@/components/literature/form/FormHeader";
import { useLiterature } from "@/modules/literature/hooks/useLiterature";
import type {
  LiteratureCategory,
  LiteratureForm,
} from "@/modules/literature/types/literature.types";

const initialForm: LiteratureForm = {
  type: "article",
  title: "",
  description: null,
  categoryId: null,
  content: null,
  thumbnail: {
    url: null,
    publicId: null,
    file: null,
  },
  fileUrl: null,
  filePublicId: null,
  file: null,
  bookUrl: null,
  links: [],
};

export default function LiteratureFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editSlug = searchParams.get("edit");
  const isEdit = Boolean(editSlug);

  const { saveLiterature, getLiteratureBySlug, isSaving } = useLiterature();

  const [data, setData] = useState<LiteratureForm>(initialForm);
  const [categories, setCategories] = useState<LiteratureCategory[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/literature/categories", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil kategori");
        }

        const result = await response.json();
        setCategories(
          Array.isArray(result) ? result : result.data ?? []
        );
      } catch (error) {
        console.error("LOAD CATEGORIES ERROR:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    if (!editSlug) {
      setData(initialForm);
      setIsLoading(false);
      return;
    }

    const slug = editSlug;

    async function loadLiterature() {
      try {
        setIsLoading(true);
        const literature = await getLiteratureBySlug(slug);

        setData({
          type: literature.type === "book" ? "book" : "article",
          title: literature.title ?? "",
          description: literature.description ?? null,
          categoryId: literature.category_id ? String(literature.category_id) : null,
          content: literature.content ?? null,
          thumbnail: {
            url: literature.thumbnail_url ?? null,
            publicId: literature.thumbnail_public_id ?? null,
            file: null,
          },
          fileUrl: literature.file_url ?? null,
          filePublicId: literature.file_public_id ?? null,
          file: null,
          bookUrl: literature.book_url ?? null,
          links: Array.isArray(literature.literature_links)
            ? literature.literature_links.map((link) => ({
                platform: link.platform,
                url: link.url ?? "",
              }))
            : [],
        });
      } catch (error) {
        console.error("LOAD LITERATURE ERROR:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLiterature();
  }, [editSlug, getLiteratureBySlug]);

  function handleChange(value: LiteratureForm) {
    setData(value);
  }

  async function handleSubmit() {
    try {
      await saveLiterature(data, editSlug ?? undefined);
      router.push("/literature");
    } catch (error) {
      console.error("SUBMIT LITERATURE ERROR:", error);
    }
  }

  function handleBack() {
    router.back();
  }

  if (isLoading || isLoadingCategories) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
          <p className="text-sm text-gray-500">
            {isEdit ? "Memuat data literasi..." : "Memuat kategori..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <FormHeaderLiterature
          isEdit={isEdit}
          type={data.type}
          onBack={handleBack}
        />

        <div className="p-6">
          <FormLiterature
            data={data}
            categories={categories}
            isEdit={isEdit}
            isSaving={isSaving}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        </div>
      </div>
    </div>
  );
}