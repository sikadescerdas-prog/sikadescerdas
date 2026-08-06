// modules/dashboard/hooks/useVillage.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import type { VillageProfileForm } from "../types/village.types";
import {
  getVillageProfile,
  updateVillageProfile,
} from "../services/village.service";
import { formatRibuan, parseRibuan } from "@/shared/utils/formatRibuan";
import { uploadImage, deleteImage } from "@/shared/services/upload.service";
import { phoneToDatabase, phoneToDisplay } from "@/shared/helpers/phone";
import { sweet } from "@/shared/utils/sweet";

const initialForm: VillageProfileForm = {
  name: "",
  history: "",
  vision: "",
  mission: "",
  welcomeMessage: "",
  foundedYear: "",
  areaSize: "",
  email: "",
  phone: "",
  website: "",

  totalHamlets: "",
  totalRw: "",
  totalRt: "",

  logo: {
    url: null,
    publicId: null,
    file: null,
  },

  address: {
    detailAddress: "",
    rt: "",
    rw: "",
    village: "",
    district: "",
    regency: "",
    province: "",
    postalCode: "",
    north: "",
    south: "",
    east: "",
    west: "",
  },

  socialMedia: {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  },

  mapEmbed: "",
};

export function useVillage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<VillageProfileForm>(initialForm);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);

  // =========================
  // GET DATA
  // =========================
  const fetchVillage = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getVillageProfile();

      setFormData({
        name: data.name ?? "",
        history: data.history ?? "",
        vision: data.vision ?? "",
        mission: data.mission ?? "",
        welcomeMessage: data.welcomeMessage ?? "",

        foundedYear:
          data.foundedYear != null ? String(data.foundedYear) : "",

        areaSize:
          data.areaSize != null ? formatRibuan(data.areaSize) : "",

        email: data.email ?? "",
        phone: phoneToDisplay(data.phone),
        website: data.website ?? "",

        totalHamlets:
          data.totalHamlets != null ? String(data.totalHamlets) : "",

        totalRw: data.totalRw != null ? String(data.totalRw) : "",

        totalRt: data.totalRt != null ? String(data.totalRt) : "",

        logo: {
          url: data.logoUrl ?? null,
          publicId: data.logoPublicId ?? null,
          file: null,
        },

        address: {
          detailAddress: data.address ?? "",
          rt: data.rt ?? "",
          rw: data.rw ?? "",
          village: data.village ?? "",
          district: data.district ?? "",
          regency: data.regency ?? "",
          province: data.province ?? "",
          postalCode: data.postalCode ?? "",
          north: data.northBoundary ?? "",
          south: data.southBoundary ?? "",
          east: data.eastBoundary ?? "",
          west: data.westBoundary ?? "",
        },

        socialMedia: {
          facebook: data.facebook ?? "",
          instagram: data.instagram ?? "",
          tiktok: data.tiktok ?? "",
          youtube: data.youtube ?? "",
        },

        mapEmbed: data.mapEmbed ?? "",
      });

      setLogoPreview(data.logoUrl ?? null);
      setRemoveLogo(false);
    } catch (error) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data desa",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVillage();
  }, [fetchVillage]);

  // =========================
  // UPDATE FIELD
  // =========================
  function updateField(field: string, value: any) {
    setFormData((prev) => {
      if (field.startsWith("address.")) {
        const key = field.replace(
          "address.",
          ""
        ) as keyof VillageProfileForm["address"];

        return {
          ...prev,
          address: {
            ...prev.address,
            [key]: value,
          },
        };
      }

      if (field.startsWith("socialMedia.")) {
        const key = field.replace(
          "socialMedia.",
          ""
        ) as keyof VillageProfileForm["socialMedia"];

        return {
          ...prev,
          socialMedia: {
            ...prev.socialMedia,
            [key]: value,
          },
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  }

  // =========================
  // SELECT LOGO (BELUM UPLOAD)
  // =========================
  function updateLogo(file: File) {
    const preview = URL.createObjectURL(file);

    setRemoveLogo(false);
    setLogoPreview(preview);

    setFormData((prev) => ({
      ...prev,
      logo: {
        ...prev.logo,
        url: preview,
        file,
      },
    }));
  }

  // =========================
  // DELETE LOGO
  // =========================
  async function deleteLogo() {
    try {
      const publicId = formData.logo.publicId;

      // 1. HAPUS FILE DI CLOUDINARY
      if (publicId) {
        await deleteImage(publicId);
      }

      // 2. BARU HAPUS DATA DI STATE
      setRemoveLogo(true);
      setLogoPreview(null);

      setFormData((prev) => ({
        ...prev,
        logo: {
          url: null,
          publicId: null,
          file: null,
        },
      }));
    } catch (error) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menghapus logo",
      });
    }
  }

  // =========================
  // SAVE
  // =========================
  async function saveVillage() {
    try {
      setIsSaving(true);

      sweet.loading({
        title: "Menyimpan...",
        text: "Mengunggah logo dan memperbarui data desa",
      });

      let logoUrl = formData.logo.url;
      let logoPublicId = formData.logo.publicId;

      // =========================
      // UPLOAD LOGO CLOUDINARY
      // =========================
      if (formData.logo.file) {
        const uploaded = await uploadImage(
          formData.logo.file,
          "village",
          "logo-desa",
          "logo"
        );

        logoUrl = uploaded.url;
        logoPublicId = uploaded.publicId;
      }

      await updateVillageProfile({
        name: formData.name,
        history: formData.history || null,
        vision: formData.vision || null,
        mission: formData.mission || null,
        welcomeMessage: formData.welcomeMessage || null,
        email: formData.email || null,
        phone: formData.phone
          ? phoneToDatabase(formData.phone)
          : null,
        website: formData.website || null,

        totalHamlets: formData.totalHamlets
          ? Number(formData.totalHamlets)
          : null,

        totalRw: formData.totalRw ? Number(formData.totalRw) : null,

        totalRt: formData.totalRt ? Number(formData.totalRt) : null,

        facebook: formData.socialMedia.facebook || null,
        instagram: formData.socialMedia.instagram || null,
        tiktok: formData.socialMedia.tiktok || null,
        youtube: formData.socialMedia.youtube || null,

        foundedYear: formData.foundedYear
          ? Number(formData.foundedYear)
          : null,

        areaSize: formData.areaSize
          ? parseRibuan(formData.areaSize)
          : null,

        logoUrl: removeLogo ? null : logoUrl,
        logoPublicId: removeLogo ? null : logoPublicId,

        address: formData.address.detailAddress || null,
        rt: formData.address.rt || null,
        rw: formData.address.rw || null,
        village: formData.address.village || null,
        district: formData.address.district || null,
        regency: formData.address.regency || null,
        province: formData.address.province || null,
        postalCode: formData.address.postalCode || null,

        mapEmbed: formData.mapEmbed || null,

        northBoundary: formData.address.north || null,
        southBoundary: formData.address.south || null,
        eastBoundary: formData.address.east || null,
        westBoundary: formData.address.west || null,
      });

      sweet.close();

      sweet.success({
        title: "Berhasil",
        text: "Profil desa berhasil disimpan",
      });

      await fetchVillage();
    } catch (error) {
      sweet.close();

      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan profil desa",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return {
    formData,
    setFormData,
    loading,
    isSaving,
    logoPreview,
    removeLogo,
    updateField,
    updateLogo,
    deleteLogo,
    fetchVillage,
    saveVillage,
  };
}