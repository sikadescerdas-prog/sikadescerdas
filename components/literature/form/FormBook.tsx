// components/literature/form/FormBook.tsx

"use client";

import { Link as LinkIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import InputGoogle from "@/components/ui/InputGoogle";
import type { LiteratureForm } from "@/modules/literature/types/literature.types";
import ThumbnailLiterature from "./ThumbnailLiterature";
import PDFLiterature from "./PDFLiterature";

interface Props {
  data: LiteratureForm;
  isEdit?: boolean;
  isSaving?: boolean;
  onChange: (data: LiteratureForm) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function FormBook({ data, isEdit = false, isSaving = false, onChange, onSubmit, onBack }: Props) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(data.thumbnail?.url ?? null);

  useEffect(() => {
    if (!data.thumbnail?.file) {
      setThumbnailPreview(data.thumbnail?.url ?? null);
      return;
    }

    const url = URL.createObjectURL(data.thumbnail.file);
    setThumbnailPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [data.thumbnail?.file, data.thumbnail?.url]);

  function updateField<K extends keyof LiteratureForm>(field: K, value: LiteratureForm[K]) {
    onChange({ ...data, [field]: value });
  }

  function handleThumbnailUpload(file: File) {
    onChange({ ...data, thumbnail: { url: data.thumbnail?.url ?? null, publicId: data.thumbnail?.publicId ?? null, file } });
  }

  function handleThumbnailDelete() {
    onChange({ ...data, thumbnail: { url: null, publicId: null, file: null } });
  }

  function handlePDFUpload(file: File) {
    onChange({ ...data, bookUrl: null, file, fileUrl: null, filePublicId: null });
  }

  function handlePDFRemove() {
    onChange({ ...data, file: null, fileUrl: null, filePublicId: null });
  }

  function handleBookUrlChange(value: string) {
    onChange({ ...data, bookUrl: value || null, file: value ? null : data.file, fileUrl: value ? null : data.fileUrl, filePublicId: value ? null : data.filePublicId });
  }

  function handleBookUrlDelete() {
    onChange({ ...data, bookUrl: null });
  }

  const hasFile = !!data.file || !!data.fileUrl;
  const hasBookUrl = !!data.bookUrl?.trim();

  return (
    <div className="space-y-6">
      {/* INFORMASI BUKU */}
      <div className="space-y-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Thumbnail</h2>
        </div>

        <div className="w-full sm:w-[360px]">
          <ThumbnailLiterature imageUrl={thumbnailPreview} onFileSelect={handleThumbnailUpload} onDeleteImage={handleThumbnailDelete} />
        </div>

        <InputGoogle label="Judul Buku" name="title" value={data.title} placeholder="Masukkan judul buku" disabled={isSaving} showValidIcon onChange={(e) => updateField("title", e.target.value)} />
        <InputGoogle label="Deskripsi" name="description" value={data.description ?? ""} placeholder="Masukkan deskripsi singkat buku" disabled={isSaving} onChange={(e) => updateField("description", e.target.value)} />
      </div>

      {/* SUMBER BUKU */}
      {!hasFile && !hasBookUrl && (
        <p className="text-xs text-red-500">*Pilih salah satu sumber buku: upload file PDF atau gunakan link buku.</p>
      )}

      {/* PDF BUKU */}
      {!hasBookUrl && (
        <div>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">File Buku</h2>
            <p className="mt-1 text-sm text-gray-500">Upload file buku dalam format PDF.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <PDFLiterature fileUrl={data.fileUrl} file={data.file} onUpload={handlePDFUpload} onRemove={handlePDFRemove} />
          </div>
        </div>
      )}

      {/* PEMISAH */}
      {!hasFile && !hasBookUrl && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-medium text-gray-400">ATAU</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
      )}

      {/* LINK BUKU */}
      {!hasFile && (
        <div>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">Link Buku</h2>
            <p className="mt-1 text-sm text-gray-500">Masukkan link untuk membaca atau mengunduh buku.</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <LinkIcon size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-semibold text-gray-500">Link Buku</p>
                  <input
                    type="url"
                    value={data.bookUrl ?? ""}
                    disabled={isSaving}
                    onChange={(e) => handleBookUrlChange(e.target.value)}
                    className="w-full border-0 bg-transparent p-0 text-sm font-medium text-blue-600 outline-none placeholder:text-blue-400 focus:ring-0"
                    placeholder="Klik di sini untuk memasukkan link buku..."
                  />
                  {!hasBookUrl && <p className="mt-1 text-[11px] text-gray-400">Contoh: https://...</p>}
                </div>
              </div>

              {hasBookUrl && (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleBookUrlDelete}
                  className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={16} /> Hapus Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACTION */}
      <div className="flex justify-end border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className="mr-3 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
        >
          Batal
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSaving}
          className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Buku"}
        </button>
      </div>
    </div>
  );
}