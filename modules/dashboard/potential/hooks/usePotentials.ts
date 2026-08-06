// modules/dashboard/potential/hooks/usePotentials.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  Potential,
  PotentialForm,
  PotentialCreatePayload,
} from "../types/potential.types";

import {
  getPotentials,
  getPotentialById,
  createPotential,
  updatePotential,
  deletePotential,
} from "../services/potential.service";

import {
  uploadImage,
  deleteImage,
} from "@/shared/services/upload.service";

import { sweet } from "@/shared/utils/sweet";

export function usePotentials() {
  const [potentials, setPotentials] = useState<Potential[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [currentVillageId, setCurrentVillageId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  // =========================
  // GET CURRENT VILLAGE
  // =========================

  useEffect(() => {
    async function fetchVillage() {
      try {
        const res = await fetch("/api/dashboard/village");
        const json = await res.json();

        if (json.data?.id) {
          setCurrentVillageId(json.data.id);
        }
      } catch (error) {
        console.error("Fetch village error:", error);
      }
    }

    fetchVillage();
  }, []);

  // =========================
  // GET DATA
  // =========================

  const fetchPotentials = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getPotentials();

      setPotentials(data);
    } catch (error) {
      console.error("Fetch potential error:", error);
      setPotentials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPotentials();
  }, [fetchPotentials]);

  // =========================
  // IMAGE PREVIEW
  // =========================

  function updateImage(file: File) {
    const preview = URL.createObjectURL(file);

    setImagePreview(preview);
    setRemoveImage(false);
  }

  function clearPreview() {
    setImagePreview(null);
  }

  // =========================
  // SAVE
  // =========================

  async function savePotential(data: PotentialForm, id?: string) {
    try {
      if (!currentVillageId) {
        throw new Error("Desa belum dipilih");
      }

      setIsSaving(true);

      sweet.loading({
        title: "Menyimpan...",
        text: "Upload gambar dan menyimpan data",
      });

      let imageUrl = data.image.url;
      let imagePublicId = data.image.publicId;

      if (data.image.file) {
        const slugName = data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const uuid = crypto.randomUUID().split("-")[0];

        const uploaded = await uploadImage(
          data.image.file,
          "village/potential",
          `${slugName}-${uuid}`,
          "banner"
        );

        imageUrl = uploaded.url;
        imagePublicId = uploaded.publicId;
      }

      const payload: PotentialCreatePayload = {
        village_id: currentVillageId,
        category_id: data.category_id,
        name: data.name,
        description: data.description,
        image_url: removeImage ? null : imageUrl,
        image_public_id: removeImage ? null : imagePublicId,
        address: data.address,
        link_maps: data.link_maps,
        website: data.website,
      };

      if (id) {
        await updatePotential(id, payload);
      } else {
        await createPotential(payload);
      }

      sweet.close();

      sweet.success({
        title: "Berhasil",
        text: "Data potensi berhasil disimpan",
      });

      await fetchPotentials();

      setImagePreview(null);
      setRemoveImage(false);
    } catch (error) {
      sweet.close();

      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan potensi",
      });

      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  // =========================
  // DELETE IMAGE
  // =========================

  async function deletePotentialImage(publicId?: string | null) {
    try {
      if (publicId) {
        await deleteImage(publicId);
      }

      setImagePreview(null);
      setRemoveImage(true);
    } catch (error) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menghapus gambar",
      });
    }
  }

  // =========================
  // DELETE DATA
  // =========================

  async function removePotential(id: string) {
    try {
      const potential = await getPotentialById(id);

      if (potential.image_public_id) {
        await deleteImage(potential.image_public_id);
      }

      await deletePotential(id);

      await fetchPotentials();
    } catch (error) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menghapus potensi",
      });

      throw error;
    }
  }

  return {
    potentials,
    loading,
    isSaving,
    imagePreview,
    removeImage,
    updateImage,
    clearPreview,
    savePotential,
    deletePotentialImage,
    removePotential,
    refresh: fetchPotentials,
  };
}