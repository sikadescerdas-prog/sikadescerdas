// modules/dashboard/literature/hooks/useLiterature.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import {
  deleteImage,
  deletePdf,
  uploadImage,
  uploadPdf,
} from "@/shared/services/upload.service";
import { sweet } from "@/shared/utils/sweet";

import {
  createLiterature,
  deleteLiterature,
  getLiteratureBySlug,
  getLiteratures,
  updateLiterature,
} from "../services/literature.service";

import type {
  Literature,
  LiteratureCreatePayload,
  LiteratureFilter,
  LiteratureForm,
} from "../types/literature.types";

export function useLiterature() {
  const [literatures, setLiteratures] = useState<Literature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) return null;

      const data = await response.json();

      return data.user ?? null;
    } catch (error) {
      console.error("GET CURRENT USER ERROR:", error);
      return null;
    }
  }, []);

  const fetchLiteratures = useCallback(
    async (filter: LiteratureFilter = {}) => {
      try {
        setLoading(true);

        const data = await getLiteratures(filter);

        setLiteratures(data);
      } catch (error) {
        console.error("FETCH LITERATURE ERROR:", error);

        setLiteratures([]);

        sweet.error({
          title: "Gagal",
          text:
            error instanceof Error
              ? error.message
              : "Gagal mengambil data literasi",
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchLiteratures();
  }, [fetchLiteratures]);

  function createSlug(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function saveLiterature(
    data: LiteratureForm,
    slug?: string
  ) {
    try {
      setIsSaving(true);

      sweet.loading({
        title: "Menyimpan...",
        text: "Sedang menyimpan literasi",
      });

      const currentUser = await getCurrentUser();

      if (!currentUser?.id) {
        throw new Error(
          "Sesi pengguna tidak ditemukan. Silakan login kembali."
        );
      }

      let existingLiterature: Literature | null = null;

      if (slug) {
        existingLiterature =
          await getLiteratureBySlug(slug);

        const isAdmin =
          currentUser.role === "admin" ||
          currentUser.role === "superadmin";

        const isMine =
          existingLiterature.author_id ===
          currentUser.id;

        if (!isAdmin && !isMine) {
          throw new Error(
            "Anda tidak memiliki akses untuk mengubah literasi ini."
          );
        }
      }

      if (
        data.type !== "article" &&
        data.type !== "book"
      ) {
        throw new Error(
          "Jenis literasi tidak valid."
        );
      }

      if (!data.title.trim()) {
        throw new Error("Judul wajib diisi.");
      }

      if (data.type === "article") {
        if (!data.categoryId) {
          throw new Error(
            "Kategori artikel wajib dipilih."
          );
        }

        if (!data.content?.trim()) {
          throw new Error(
            "Isi artikel wajib diisi."
          );
        }
      }

      let thumbnailUrl =
        existingLiterature?.thumbnail_url ?? null;

      let thumbnailPublicId =
        existingLiterature?.thumbnail_public_id ??
        null;

      const oldThumbnailPublicId =
        existingLiterature?.thumbnail_public_id ??
        null;

      let newThumbnailUploaded = false;

      if (data.thumbnail?.file) {
        const uuid =
          crypto.randomUUID().split("-")[0];

        const uploaded = await uploadImage(
          data.thumbnail.file,
          "literature/thumbnail",
          `${createSlug(data.title)}-${uuid}`,
          "banner"
        );

        thumbnailUrl =
          uploaded.url ?? null;

        thumbnailPublicId =
          uploaded.publicId ?? null;

        newThumbnailUploaded = true;
      } else if (
        data.thumbnail?.url !== undefined
      ) {
        thumbnailUrl = data.thumbnail.url;

        thumbnailPublicId =
          data.thumbnail.publicId ?? null;
      }

      let fileUrl =
        existingLiterature?.file_url ?? null;

      let filePublicId =
        existingLiterature?.file_public_id ??
        null;

      const oldFilePublicId =
        existingLiterature?.file_public_id ??
        null;

      let newFileUploaded = false;

      if (data.type === "book" && data.file) {
        if (
          data.file.type !==
          "application/pdf"
        ) {
          throw new Error(
            "File buku harus berformat PDF."
          );
        }

        if (
          data.file.size >
          10 * 1024 * 1024
        ) {
          throw new Error(
            "Ukuran PDF maksimal 10 MB."
          );
        }

        const uuid =
          crypto.randomUUID().split("-")[0];

        const uploaded = await uploadPdf(
          data.file,
          "literature/books",
          `${createSlug(data.title)}-${uuid}.pdf`
        );

        fileUrl = uploaded.url ?? null;

        filePublicId =
          uploaded.publicId ?? null;

        newFileUploaded = true;
      }

      if (data.type !== "book") {
        fileUrl = null;
        filePublicId = null;
      }

      const bookUrl =
        data.type === "book"
          ? data.bookUrl?.trim() || null
          : null;

      if (
        data.type === "book" &&
        !fileUrl &&
        !bookUrl
      ) {
        throw new Error(
          "File buku atau link buku wajib diisi."
        );
      }

      const links =
        data.type === "article" &&
        Array.isArray(data.links)
          ? data.links
              .filter(
                (item) =>
                  item.platform &&
                  item.url.trim()
              )
              .map((item) => ({
                platform: item.platform!,
                url: item.url.trim(),
              }))
          : [];

      const payload: LiteratureCreatePayload = {
        type: data.type,
        title: data.title.trim(),
        description:
          data.description?.trim() || null,
        categoryId:
          data.type === "article"
            ? data.categoryId
            : null,
        content:
          data.type === "article"
            ? data.content?.trim() || null
            : null,
        fileUrl:
          data.type === "book"
            ? fileUrl
            : null,
        filePublicId:
          data.type === "book"
            ? filePublicId
            : null,
        bookUrl,
        thumbnailUrl,
        thumbnailPublicId,
        is_active:
          existingLiterature?.is_active ??
          true,
        links,
      };

      if (!slug) {
        await createLiterature(payload);

        sweet.close();

        await sweet.success({
          title: "Berhasil",
          text: "Literasi berhasil ditambahkan",
        });

        await fetchLiteratures();

        return;
      }

      await updateLiterature(
        slug,
        payload
      );

      if (
        newThumbnailUploaded &&
        oldThumbnailPublicId &&
        oldThumbnailPublicId !==
          thumbnailPublicId
      ) {
        try {
          await deleteImage(
            oldThumbnailPublicId
          );
        } catch (error) {
          console.error(
            "DELETE OLD THUMBNAIL ERROR:",
            error
          );
        }
      }

      const shouldDeleteOldPdf =
        !!oldFilePublicId &&
        (newFileUploaded ||
          data.type !== "book") &&
        oldFilePublicId !== filePublicId;

      if (shouldDeleteOldPdf) {
        try {
          await deletePdf(
            oldFilePublicId
          );
        } catch (error) {
          console.error(
            "DELETE OLD PDF ERROR:",
            error
          );
        }
      }

      sweet.close();

      await sweet.success({
        title: "Berhasil",
        text: "Literasi berhasil diperbarui",
      });

      await fetchLiteratures();
    } catch (error) {
      console.error(
        "SAVE LITERATURE ERROR:",
        error
      );

      sweet.close();

      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan literasi",
      });

      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleLiteratureActive(
    slug: string,
    isActive: boolean
  ) {
    try {
      const currentUser =
        await getCurrentUser();

      if (!currentUser?.id) {
        throw new Error(
          "Sesi pengguna tidak ditemukan."
        );
      }

      const literature =
        await getLiteratureBySlug(slug);

      const isAdmin =
        currentUser.role === "admin" ||
        currentUser.role === "superadmin";

      const isMine =
        literature.author_id ===
        currentUser.id;

      if (!isAdmin && !isMine) {
        throw new Error(
          "Anda tidak memiliki akses untuk mengubah status literasi ini."
        );
      }

      
      const confirmed = await sweet.confirm({
  title: isActive
    ? "Tampilkan literasi?"
    : "Sembunyikan literasi?",
  text: isActive
    ? "Literasi akan tampil kembali."
    : "Literasi tidak akan tampil di website.",
  confirmButtonText: "Ya",
  cancelText: "Batal",
});

if (!confirmed) {
  return;
}

sweet.loading({
  title: "Memproses...",
  text: "Mengubah status literasi",
});

await updateLiterature(slug, {
  is_active: isActive,
});

sweet.close();

      

      setLiteratures((current) =>
        current.map((item) =>
          item.slug === slug
            ? {
                ...item,
                is_active: isActive,
              }
            : item
        )
      );

      sweet.toast({
        title: isActive
          ? "Literasi diaktifkan"
          : "Literasi disembunyikan",
      });
    } catch (error) {
      console.error(
        "TOGGLE LITERATURE ACTIVE ERROR:",
        error
      );

      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal mengubah status literasi",
      });

      throw error;
    }
  }

  async function removeLiterature(
    slug: string
  ) {
    try {
      sweet.loading({
        title: "Menghapus...",
        text: "Menghapus data literasi",
      });

      const currentUser =
        await getCurrentUser();

      if (!currentUser?.id) {
        throw new Error(
          "Sesi pengguna tidak ditemukan."
        );
      }

      const literature =
        await getLiteratureBySlug(slug);

      const isAdmin =
        currentUser.role === "admin" ||
        currentUser.role === "superadmin";

      const isMine =
        literature.author_id ===
        currentUser.id;

      if (!isAdmin && !isMine) {
        throw new Error(
          "Anda tidak memiliki akses untuk menghapus literasi ini."
        );
      }

      if (
        literature.thumbnail_public_id
      ) {
        try {
          await deleteImage(
            literature.thumbnail_public_id
          );
        } catch (error) {
          console.error(
            "DELETE THUMBNAIL ERROR:",
            error
          );
        }
      }

      if (
        literature.file_public_id
      ) {
        try {
          await deletePdf(
            literature.file_public_id
          );
        } catch (error) {
          console.error(
            "DELETE PDF ERROR:",
            error
          );
        }
      }

      await deleteLiterature(slug);

      sweet.close();

      await sweet.success({
        title: "Berhasil",
        text: "Literasi berhasil dihapus",
      });

      await fetchLiteratures();
    } catch (error) {
      console.error(
        "DELETE LITERATURE ERROR:",
        error
      );

      sweet.close();

      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menghapus literasi",
      });

      throw error;
    }
  }

  return {
    literatures,
    loading,
    isSaving,
    fetchLiteratures,
    saveLiterature,
    removeLiterature,
    toggleLiteratureActive,
    getLiteratureBySlug,
  };
}