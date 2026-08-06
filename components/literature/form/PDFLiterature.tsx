// components/literature/form/PDFLiterature.tsx

"use client";

import { ExternalLink, FileText, Upload, X } from "lucide-react";

interface Props {
  fileUrl: string | null;
  file: File | null;
  onUpload: (file: File) => void;
  onRemove?: () => void;
}

export default function PDFLiterature({ fileUrl, file, onUpload, onRemove }: Props) {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("File harus berformat PDF.");
      event.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      alert("Ukuran PDF maksimal 10 MB.");
      event.target.value = "";
      return;
    }

    onUpload(selectedFile);
    event.target.value = "";
  }

  const fileName = file?.name ?? (fileUrl ? "File buku PDF" : null);

  return (
    <div className="space-y-4">
      {fileName ? (
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          {/* FILE INFO */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileText size={22} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">{fileName}</p>
              <p className="mt-1 text-xs text-gray-500">{file ? "File baru dipilih" : "File tersimpan"}</p>
            </div>
          </div>

          {/* ACTION */}
          <div className="flex shrink-0 items-center gap-2">
            {fileUrl && !file && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
              >
                <ExternalLink size={14} /> Lihat
              </a>
            )}

            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 ring-1 ring-blue-100 transition hover:bg-blue-100">
              <Upload size={15} /> Ganti PDF
              <input type="file" accept="application/pdf,.pdf" onChange={handleFileChange} className="hidden" />
            </label>

            {file && onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                title="Batalkan file baru"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* EMPTY UPLOAD */
        <label className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Upload size={22} />
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-700">Pilih File PDF</p>
          <p className="mt-1 text-xs text-gray-400">PDF · Maks. 10 MB</p>
          <input type="file" accept="application/pdf,.pdf" onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  );
}