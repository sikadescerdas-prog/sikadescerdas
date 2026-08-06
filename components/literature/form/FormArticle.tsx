// components/literature/form/FormArticle.tsx

"use client";

import { useState } from "react";
import { FaFacebook, FaInstagram, FaPlus, FaTrash, FaTwitter, FaTiktok, FaYoutube } from "react-icons/fa";
import { Globe } from "lucide-react";
import InputGoogle from "@/components/ui/InputGoogle";
import ThumbnailLiterature from "./ThumbnailLiterature";
import type { LiteratureForm, LiteratureLinkForm, LiteraturePlatform } from "@/modules/literature/types/literature.types";

interface Props {
  data: LiteratureForm;
  categories: { id: string; name: string }[];
  isEdit?: boolean;
  isSaving?: boolean;
  onChange: (data: LiteratureForm) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const platforms: { value: LiteraturePlatform; label: string }[] = [
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "website", label: "Website" },
  { value: "x", label: "X" },
];

function PlatformIcon({ platform }: { platform: LiteraturePlatform | null }) {
  switch (platform) {
    case "youtube": return <FaYoutube size={16} />;
    case "tiktok": return <FaTiktok size={16} />;
    case "instagram": return <FaInstagram size={16} />;
    case "facebook": return <FaFacebook size={16} />;
    case "x": return <FaTwitter size={16} />;
    case "website":
    default: return <Globe size={16} />;
  }
}

export default function FormArticle({ data, categories, isEdit = false, isSaving = false, onChange, onSubmit, onBack }: Props) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(data.thumbnail?.url ?? null);

  const handleChange = (field: keyof LiteratureForm, value: LiteratureForm[keyof LiteratureForm]) => {
    onChange({ ...data, [field]: value });
  };

  const handleThumbnailUpload = (file: File) => {
    const preview = URL.createObjectURL(file);
    setThumbnailPreview(preview);
    onChange({ ...data, thumbnail: { ...data.thumbnail, file } });
  };

  const handleThumbnailDelete = () => {
    setThumbnailPreview(null);
    onChange({ ...data, thumbnail: { ...data.thumbnail, url: null, file: null, publicId: null } });
  };

  const addLink = () => {
    const newLink: LiteratureLinkForm = { platform: null, url: "" };
    onChange({ ...data, links: [...(data.links ?? []), newLink] });
  };

  const updateLink = (index: number, field: keyof LiteratureLinkForm, value: string | LiteraturePlatform | null) => {
    const links = [...(data.links ?? [])];
    links[index] = { ...links[index], [field]: value };
    onChange({ ...data, links });
  };

  const removeLink = (index: number) => {
    const links = [...(data.links ?? [])];
    links.splice(index, 1);
    onChange({ ...data, links });
  };

  return (
    <div className="space-y-6">
      {/* INFORMASI ARTIKEL */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT */}
        <div className="space-y-5 lg:col-span-7">
          {/* CATEGORY */}
          <div className="relative">
            <select
              value={data.categoryId ?? ""}
              onChange={(event) => handleChange("categoryId", event.target.value || null)}
              disabled={isSaving}
              className="h-[50px] w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:bg-gray-50"
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <label className="pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs text-gray-500">Kategori</label>
          </div>

          {/* TITLE */}
          <InputGoogle
            label="Judul Artikel"
            name="title"
            value={data.title}
            placeholder="Masukkan judul artikel"
            disabled={isSaving}
            onChange={(event) => handleChange("title", event.target.value)}
            showValidIcon
          />

          {/* DESCRIPTION */}
          <InputGoogle
            label="Deskripsi"
            name="description"
            value={data.description ?? ""}
            placeholder="Masukkan deskripsi singkat artikel"
            disabled={isSaving}
            onChange={(event) => handleChange("description", event.target.value || null)}
          />
        </div>

        {/* RIGHT THUMBNAIL */}
        <div className="lg:col-span-5">
          <ThumbnailLiterature
            imageUrl={data.thumbnail?.url}
            previewUrl={thumbnailPreview}
            onFileSelect={handleThumbnailUpload}
            onDeleteImage={handleThumbnailDelete}
          />
        </div>
      </div>

      {/* ISI ARTIKEL */}
      <div className="relative">
        <textarea
          value={data.content ?? ""}
          onChange={(event) => handleChange("content", event.target.value || null)}
          disabled={isSaving}
          rows={10}
          placeholder="Tulis isi artikel..."
          className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:bg-gray-50"
        />
        <label className="pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs text-gray-500">Isi Artikel</label>
      </div>

      {/* LINK TAMBAHAN */}
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800">Link Tambahan</h3>
            <p className="text-sm text-gray-500">Tambahkan media sosial atau website.</p>
          </div>
          <button
            type="button"
            onClick={addLink}
            disabled={isSaving}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaPlus size={13} /> Tambah Link
          </button>
        </div>

        {/* LINK LIST */}
        <div className="space-y-3">
          {(data.links ?? []).map((link, index) => (
            <div key={index} className="flex flex-col gap-3 rounded-xl border border-gray-200 p-3 md:flex-row">
              {/* PLATFORM */}
              <div className="relative md:w-48">
                <select
                  value={link.platform ?? ""}
                  onChange={(event) => updateLink(index, "platform", event.target.value ? (event.target.value as LiteraturePlatform) : null)}
                  disabled={isSaving}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 text-sm outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:bg-gray-50"
                >
                  <option value="">Pilih platform</option>
                  {platforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>{platform.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <PlatformIcon platform={link.platform} />
                </div>
              </div>

              {/* URL */}
              <input
                type="url"
                value={link.url}
                onChange={(event) => updateLink(index, "url", event.target.value)}
                disabled={isSaving}
                placeholder="https://..."
                className="h-11 min-w-0 flex-1 rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:bg-gray-50"
              />

              {/* DELETE */}
              <button
                type="button"
                onClick={() => removeLink(index)}
                disabled={isSaving}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Hapus link"
              >
                <FaTrash size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSaving}
          className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Artikel"}
        </button>
      </div>
    </div>
  );
}