// core/profile/types/profile.types.ts

export type Gender = "male" | "female" | "";

/* =========================
   USER PROFILE DATA MODEL
========================= */
export interface Profile {
  // Informasi Diri
  fullname: string;
  phone: string | null;
  bio: string | null;
  gender: Gender;
  birthDate: string | null;

  // Status Kelengkapan Profile
  isCompleted: boolean;

  // Media
  avatarUrl: string | null;
  avatarPublicId: string | null;

  // Wilayah & Alamat
  province: string | null;
  regency: string | null;
  district: string | null;
  village: string | null;
  detailAddress: string | null;

  // Koordinat Geospasial
  latitude: number | null;
  longitude: number | null;
}

/* =========================
   PROFILE FORM STATE MODEL
========================= */
export interface ProfileForm {
  username: string;
  fullname: string;
  phone: string;
  bio: string;
  gender: Gender;
  birthDate: string;

  // Wilayah & Alamat
  province: string;
  regency: string;
  district: string;
  village: string;
  detailAddress: string;

  // Koordinat Geospasial
  latitude: number | null;
  longitude: number | null;
}