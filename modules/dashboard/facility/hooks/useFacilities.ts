// modules/dashboard/facility/hooks/useFacilities.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  Facility,
  FacilityForm,
  FacilityCreatePayload,
} from "../types/facility.types";

import {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
} from "../services/facility.service";

import { uploadImage, deleteImage } from "@/shared/services/upload.service";
import { sweet } from "@/shared/utils/sweet";

export function useFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [currentVillageId, setCurrentVillageId] = useState<string | null>(
    null
  );

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
  // GET FACILITIES
  // =========================
  const fetchFacilities = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getFacilities();

      setFacilities(data);
    } catch (error) {
      console.error("Fetch facility error:", error);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

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
  // SAVE FACILITY
  // =========================
  async function saveFacility(data: FacilityForm, id?: string) {
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

      // Upload image baru
      if (data.image.file) {
        const slugName = data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const uuid = crypto.randomUUID().split("-")[0];

        const uploaded = await uploadImage(
          data.image.file,
          "village/facility",
          `${slugName}-${uuid}`,
          "banner"
        );

        imageUrl = uploaded.url;
        imagePublicId = uploaded.publicId;
      }

      const payload: FacilityCreatePayload = {
        village_id: currentVillageId,
        type_id: data.type_id,
        name: data.name,
        image_url: removeImage ? null : imageUrl,
        image_public_id: removeImage ? null : imagePublicId,
        address: data.address,
        link_maps: data.link_maps,
      };

      if (id) {
        await updateFacility(id, payload);
      } else {
        await createFacility(payload);
      }

      sweet.close();

      sweet.success({
        title: "Berhasil",
        text: "Data fasilitas berhasil disimpan",
      });

      await fetchFacilities();

      setImagePreview(null);
      setRemoveImage(false);
    } catch (error) {
      sweet.close();

      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan fasilitas",
      });

      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  // =========================
  // DELETE IMAGE
  // =========================
  async function deleteFacilityImage(publicId?: string | null) {
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
  // DELETE FACILITY
  // =========================
  async function removeFacility(id: string) {
    try {
      const facility = await getFacilityById(id);

      if (facility.image_public_id) {
        await deleteImage(facility.image_public_id);
      }

      await deleteFacility(id);

      await fetchFacilities();
    } catch (error) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menghapus fasilitas",
      });

      throw error;
    }
  }

  return {
    facilities,
    loading,
    isSaving,
    imagePreview,
    removeImage,
    updateImage,
    clearPreview,
    deleteFacilityImage,
    saveFacility,
    refresh: fetchFacilities,
    removeFacility,
  };
}