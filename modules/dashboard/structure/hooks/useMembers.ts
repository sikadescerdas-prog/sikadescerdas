// modules/dashboard/structure/hooks/useMembers.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from "../services/member.service";
import type {
  StructureMember,
  StructureMemberForm,
  CreateStructureMember,
} from "../types/structure.types";
import { uploadImage, deleteImage } from "@/shared/services/upload.service";
import { sweet } from "@/shared/utils/sweet";

interface UseMembersParams {
  period_id?: string;
  position_id?: string;
}

interface VillageInfo {
  id: string;
  name: string;
}

export function useMembers(params?: UseMembersParams) {
  const [village, setVillage] = useState<VillageInfo | null>(null);
  const [members, setMembers] = useState<StructureMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  // =========================
  // GET MEMBERS
  // =========================
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMembers({
        period_id: params?.period_id,
        position_id: params?.position_id,
      });

      console.log("MEMBERS RESPONSE:", response);
      setVillage(response.village ?? null);
      setMembers(response.data ?? []);
    } catch (error) {
      console.error("LOAD MEMBERS ERROR:", error);
      setVillage(null);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [params?.period_id, params?.position_id]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // =========================
  // PHOTO SELECT
  // =========================
  function updatePhoto(file: File) {
    const preview = URL.createObjectURL(file);
    setRemovePhoto(false);
    setPhotoPreview(preview);
  }

  // =========================
  // DELETE PHOTO
  // =========================
  async function deletePhoto(publicId?: string | null) {
    try {
      if (publicId) {
        await deleteImage(publicId);
      }
      setPhotoPreview(null);
      setRemovePhoto(true);
    } catch (error) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menghapus foto",
      });
    }
  }

  // =========================
  // SAVE MEMBER
  // =========================
  async function saveMember(
    data: StructureMemberForm,
    villageId: string,
    id?: string
  ) {
    try {
      setIsSaving(true);
      sweet.loading({
        title: "Menyimpan...",
        text: "Mengunggah foto dan menyimpan data",
      });

      let photoUrl = data.photo.url;
      let photoPublicId = data.photo.publicId;

      // UPLOAD CLOUDINARY
      if (data.photo.file) {
        const memberUid = data.photo.publicId
          ? data.photo.publicId.split("member-")[1]
          : crypto.randomUUID();

        const uploaded = await uploadImage(
          data.photo.file,
          "village/structure",
          `member-${memberUid}`,
          "logo"
        );

        photoUrl = uploaded.url;
        photoPublicId = uploaded.publicId;
      }

      const payload: CreateStructureMember = {
        village_id: villageId,
        period_id: data.period_id,
        position_id: data.position_id,
        full_name: data.full_name,
        gender: data.gender,
        photo_url: removePhoto ? null : photoUrl,
        photo_public_id: removePhoto ? null : photoPublicId,
        phone: data.phone,
        email: data.email,
        address: data.address,
      };

      if (id) {
        await updateMember(id, payload);
      } else {
        await createMember(payload);
      }

      sweet.close();
      sweet.success({
        title: "Berhasil",
        text: "Data pejabat berhasil disimpan",
      });

      await fetchMembers();
      setPhotoPreview(null);
      setRemovePhoto(false);
    } catch (error) {
      sweet.close();
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan data",
      });
    } finally {
      setIsSaving(false);
    }
  }

  // =========================
  // DELETE MEMBER
  // =========================
  async function removeMember(id: string) {
    try {
      // AMBIL DATA MEMBER
      const member = await getMemberById(id);
      console.log("DELETE MEMBER:", member);

      // HAPUS FOTO CLOUDINARY DULU
      if (member?.photo_public_id) {
        await deleteImage(member.photo_public_id);
      }

      // BARU HAPUS DATABASE
      const response = await deleteMember(id);
      await fetchMembers();
      return response;
    } catch (error) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menghapus data",
      });
      throw error;
    }
  }

  // =========================
  // DETAIL MEMBER
  // =========================
  async function detailMember(id: string) {
    return getMemberById(id);
  }

  return {
    village,
    members,
    loading,
    isSaving,
    photoPreview,
    removePhoto,
    updatePhoto,
    deletePhoto,
    saveMember,
    reload: fetchMembers,
    removeMember,
    detailMember,
  };
}