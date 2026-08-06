// modules/dashboard/news/hooks/useNews.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import type { News, NewsForm, NewsCreatePayload, NewsFilter } from "../types/news.types";
import { getNews, getNewsById, createNews, updateNews, deleteNews, toggleFeatured } from "../services/news.service";
import { uploadImage, deleteImage } from "@/shared/services/upload.service";
import { sweet } from "@/shared/utils/sweet";
import { useTableQuery } from "@/shared/hooks/useTableQuery";
import { usePagination } from "@/shared/hooks/usePagination";

export function useNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentVillageId, setCurrentVillageId] = useState<string | null>(null);

  const table = useTableQuery({ defaultSearch: "", defaultCategory: "", defaultYear: "", defaultPage: 1, defaultLimit: 10 });
  const pagination = usePagination({ page: 1, limit: 10 });

  // =========================
  // AUTHOR SESSION
  // =========================
  async function getCurrentAuthorId() {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) return null;
      const json = await res.json();
      return json.user?.id ?? null;
    } catch (error) {
      console.error("GET AUTHOR ERROR:", error);
      return null;
    }
  }

  // =========================
  // GET VILLAGE
  // =========================
  useEffect(() => {
    async function fetchVillage() {
      try {
        const res = await fetch("/api/dashboard/village", { cache: "no-store" });
        const json = await res.json();
        if (json.data?.id) setCurrentVillageId(String(json.data.id));
      } catch (error) {
        console.error("FETCH VILLAGE ERROR:", error);
      }
    }
    fetchVillage();
  }, []);

  // =========================
  // GET NEWS
  // =========================
  const fetchNews = useCallback(async (customFilter?: Partial<NewsFilter>) => {
    try {
      setLoading(true);
      const params: NewsFilter = {
        search: table.search,
        category: table.category || undefined,
        year: table.year ? Number(table.year) : undefined,
        page: customFilter?.page ?? table.page,
        limit: table.limit,
      };

      const result = await getNews(params);
      setNews(result.data);
      pagination.setPagination(result.pagination);
    } catch (error) {
      console.error("FETCH NEWS ERROR:", error);
      setNews([]);
      pagination.resetPagination();
    } finally {
      setLoading(false);
    }
  }, [table.search, table.category, table.year, table.page, table.limit, pagination.setPagination, pagination.resetPagination]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // =========================
  // SLUG
  // =========================
  function createSlug(value: string) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  // =========================
  // SAVE NEWS
  // =========================
  async function saveNews(data: NewsForm, id?: string) {
    try {
      if (!currentVillageId) throw new Error("Desa belum dipilih");
      setIsSaving(true);
      sweet.loading({ title: "Menyimpan...", text: "Upload gambar dan menyimpan berita" });

      const authorId = await getCurrentAuthorId();
      let existingNews: News | null = null;
      if (id) existingNews = await getNewsById(id);

      const oldThumbnailPublicId = existingNews?.thumbnail_public_id ?? null;
      const oldGalleryPublicIds = existingNews?.news_images?.map((image) => image.image_public_id).filter((publicId): publicId is string => Boolean(publicId)) ?? [];

      let thumbnailUrl = data.thumbnail.url;
      let thumbnailPublicId = data.thumbnail.publicId;
      let newThumbnailUploaded = false;

      if (data.thumbnail.file) {
        const uuid = crypto.randomUUID().split("-")[0];
        const uploaded = await uploadImage(data.thumbnail.file, "village/news/thumbnail", `${createSlug(data.title)}-${uuid}`, "banner");
        thumbnailUrl = uploaded.url;
        thumbnailPublicId = uploaded.publicId;
        newThumbnailUploaded = true;
      }

      if (!thumbnailUrl || !thumbnailPublicId) throw new Error("Thumbnail berita wajib diunggah");
      if (data.gallery.length > 5) throw new Error("Maksimal 5 foto berita");

      const images: NewsCreatePayload["images"] = [];
      for (const item of data.gallery) {
        if (item.file) {
          const uuid = crypto.randomUUID().split("-")[0];
          const uploaded = await uploadImage(item.file, "village/news/gallery", `${createSlug(data.title)}-${uuid}`, "banner");
          images.push({ image_url: uploaded.url, image_public_id: uploaded.publicId });
          continue;
        }
        if (item.url) {
          images.push({ image_url: item.url, image_public_id: item.publicId });
        }
      }

      const newGalleryPublicIds = images.map((image) => image.image_public_id).filter((publicId): publicId is string => Boolean(publicId));
      const deletedGalleryPublicIds = oldGalleryPublicIds.filter((oldPublicId) => !newGalleryPublicIds.includes(oldPublicId));

      const slug = id ? undefined : `${createSlug(data.title)}-${crypto.randomUUID().split("-")[0]}`;
      const payload: Partial<NewsCreatePayload> = {
        village_id: currentVillageId,
        author_id: authorId,
        category: data.category as "news" | "announcement" | "event",
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        thumbnail_url: thumbnailUrl,
        thumbnail_public_id: thumbnailPublicId,
        content_date: data.content_date,
        content_location: data.content_location,
        images,
        links: data.links.map((item) => ({ platform: item.platform, url: item.url })),
      };

      if (!id) {
        await createNews(payload as NewsCreatePayload);
        sweet.close();
        sweet.success({ title: "Berhasil", text: "Berita berhasil ditambahkan" });
        await fetchNews({ page: pagination.pagination.page });
        return;
      }

      await updateNews(id, payload);

      if (newThumbnailUploaded && oldThumbnailPublicId && oldThumbnailPublicId !== thumbnailPublicId) {
        try {
          await deleteImage(oldThumbnailPublicId);
        } catch (error) {
          console.error("DELETE OLD THUMBNAIL ERROR:", error);
        }
      }

      for (const publicId of deletedGalleryPublicIds) {
        try {
          await deleteImage(publicId);
        } catch (error) {
          console.error("DELETE OLD GALLERY ERROR:", publicId, error);
        }
      }

      sweet.close();
      sweet.success({ title: "Berhasil", text: "Berita berhasil diperbarui" });
      await fetchNews({ page: pagination.pagination.page });
    } catch (error) {
      console.error("SAVE NEWS ERROR:", error);
      sweet.close();
      sweet.error({ title: "Gagal", text: error instanceof Error ? error.message : "Gagal menyimpan berita" });
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  // =========================
  // DELETE NEWS
  // =========================
  async function removeNews(id: string) {
    try {
      sweet.loading({ title: "Menghapus...", text: "Menghapus berita dan gambar" });
      const item = await getNewsById(id);

      try {
        if (item.thumbnail_public_id) await deleteImage(item.thumbnail_public_id);
        if (item.news_images) {
          for (const image of item.news_images) {
            if (image.image_public_id) await deleteImage(image.image_public_id);
          }
        }
      } catch (error) {
        console.error("DELETE IMAGE ERROR:", error);
      }

      await deleteNews(id);
      sweet.success({ title: "Berhasil", text: "Berita berhasil dihapus" });
      await fetchNews({ page: pagination.pagination.page });
    } catch (error) {
      console.error("DELETE NEWS ERROR:", error);
      sweet.error({ title: "Gagal", text: error instanceof Error ? error.message : "Gagal menghapus berita" });
    }
  }

  // =========================
  // TOGGLE FEATURED
  // =========================
  async function toggleNewsFeatured(id: string, value: boolean) {
    try {
      await toggleFeatured(id, value);
      await fetchNews({ page: pagination.pagination.page });
    } catch (error) {
      console.error("TOGGLE FEATURED ERROR:", error);
      throw error;
    }
  }

  // =========================
  // RETURN
  // =========================
  return {
    news,
    loading,
    isSaving,
    currentVillageId,
    table,
    pagination,
    saveNews,
    removeNews,
    toggleNewsFeatured,
    refresh: fetchNews,
  };
}