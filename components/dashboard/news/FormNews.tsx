// components/dashboard/news/FormNews.tsx

"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import HeaderNews from "./form/HeaderNews";
import ThumbnailNews from "./form/ThumbnailNews";
import GeneralNews from "./form/GeneralNews";
import TitleNews from "./form/TitleNews";
import GalleryNews from "./form/GalleryNews";
import LinksNews from "./form/LinksNews";
import SaveNews from "./form/SaveNews";

import type { News, NewsForm } from "@/modules/dashboard/news/types/news.types";

interface Props {
  initialData?: News;
  onBack: () => void;
  onSubmit: (data: NewsForm) => Promise<void>;
}

const initialForm: NewsForm = {
  category: "",
  title: "",
  excerpt: "",
  content: "",
  thumbnail: {
    url: null,
    publicId: null,
    file: null,
  },
  gallery: [],
  content_date: null,
  content_location: null,
  links: [],
};

export default function FormNews({ initialData, onBack, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [form, setForm] = useState<NewsForm>(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        category: initialData.category,
        title: initialData.title,
        excerpt: initialData.excerpt,
        content: initialData.content,
        thumbnail: {
          url: initialData.thumbnail_url,
          publicId: initialData.thumbnail_public_id,
          file: null,
        },
        gallery: initialData.news_images?.map((item) => ({
          url: item.image_url,
          publicId: item.image_public_id,
          file: null,
        })) ?? [],
        content_date: initialData.content_date ? String(initialData.content_date).slice(0, 10) : null,
        content_location: initialData.content_location,
        links: initialData.news_links?.map((item) => ({
          platform: item.platform,
          url: item.url,
        })) ?? [],
      });

      setThumbnailPreview(initialData.thumbnail_url);
    } else {
      setForm(initialForm);
      setThumbnailPreview(null);
    }
  }, [initialData]);

  function updateField(field: keyof NewsForm, value: any) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleThumbnail(file: File) {
    setThumbnailPreview(URL.createObjectURL(file));
    setForm((prev) => ({
      ...prev,
      thumbnail: {
        ...prev.thumbnail,
        file,
      },
    }));
  }

  function removeThumbnail() {
    setThumbnailPreview(null);
    setForm((prev) => ({
      ...prev,
      thumbnail: {
        url: null,
        publicId: null,
        file: null,
      },
    }));
  }

  function addGallery(file: File) {
    if (form.gallery.length >= 5) {
      Swal.fire({
        icon: "warning",
        title: "Maksimal 5 foto dokumentasi",
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          url: URL.createObjectURL(file),
          publicId: null,
          file,
        },
      ],
    }));
  }

  function updateGallery(index: number, file: File) {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.map((item, i) =>
        i === index
          ? {
              ...item,
              file,
              url: URL.createObjectURL(file),
              publicId: null,
            }
          : item
      ),
    }));
  }

  function removeGallery(index: number) {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  }

  function addLink() {
    setForm((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        {
          platform: null,
          url: "",
        },
      ],
    }));
  }

  function updateLink(index: number, key: "platform" | "url", value: string) {
    setForm((prev) => ({
      ...prev,
      links: prev.links.map((item, i) =>
        i === index
          ? {
              ...item,
              [key]: key === "platform" ? value || null : value,
            }
          : item
      ),
    }));
  }

  function removeLink(index: number) {
    setForm((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.category ||
      !form.title.trim() ||
      !form.content.trim() ||
      (!form.thumbnail.file && !form.thumbnail.url)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Kategori, judul, isi, dan thumbnail wajib diisi",
      });
      return;
    }

    const payload: NewsForm = {
      ...form,
      links: form.links.filter((item) => item.url.trim() !== ""),
    };

    try {
      setLoading(true);
      await onSubmit(payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white">
      <HeaderNews isEdit={!!initialData} onBack={onBack} />

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Thumbnail + General */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ThumbnailNews
              imageUrl={form.thumbnail.url}
              previewUrl={thumbnailPreview}
              onFileSelect={handleThumbnail}
              onDeleteImage={removeThumbnail}
            />
          </div>

          <div className="lg:col-span-2">
            <GeneralNews
              category={form.category}
              contentDate={form.content_date}
              contentLocation={form.content_location}
              onCategoryChange={(value) => updateField("category", value)}
              onContentDateChange={(value) => updateField("content_date", value)}
              onContentLocationChange={(value) => updateField("content_location", value)}
            />
          </div>
        </div>

        {/* Judul */}
        <TitleNews
          title={form.title}
          excerpt={form.excerpt}
          content={form.content}
          onTitleChange={(value) => updateField("title", value)}
          onExcerptChange={(value) => updateField("excerpt", value)}
          onContentChange={(value) => updateField("content", value)}
        />

        <GalleryNews
          gallery={form.gallery}
          onAdd={addGallery}
          onUpdate={updateGallery}
          onDelete={removeGallery}
        />

        <LinksNews
          links={form.links}
          onAdd={addLink}
          onUpdate={updateLink}
          onDelete={removeLink}
        />

        <SaveNews loading={loading} editMode={!!initialData} />
      </form>
    </div>
  );
}