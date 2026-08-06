// modules/dashboard/types/village.types.ts

// =========================
// VILLAGE PROFILE
// =========================

export type VillageProfile = {
  id: string;

  name?: string | null;

  history?: string | null;
  vision?: string | null;
  mission?: string | null;
  welcomeMessage?: string | null;

  logoUrl?: string | null;
  logoPublicId?: string | null;

  email?: string | null;
  phone?: string | null;
  website?: string | null;

  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  youtube?: string | null;

  address?: string | null;

  rt?: string | null;
  rw?: string | null;

  village?: string | null;
  district?: string | null;
  regency?: string | null;
  province?: string | null;
  postalCode?: string | null;

  // =========================
  // WILAYAH DESA
  // =========================

  totalHamlets?: number | null; // jumlah dusun
  totalRw?: number | null;      // jumlah RW
  totalRt?: number | null;      // jumlah RT

  areaSize?: number | string | null;
  foundedYear?: number | null;

  // =========================
  // MAPS
  // =========================

  mapEmbed?: string | null;

  // =========================
  // BATAS WILAYAH
  // =========================

  northBoundary?: string | null;
  southBoundary?: string | null;
  eastBoundary?: string | null;
  westBoundary?: string | null;

  createdAt: string;
  updatedAt: string;
};

// =========================
// FORM DASHBOARD
// =========================

export type VillageProfileForm = {
  // =========================
  // IDENTITAS
  // =========================

  name: string;

  history: string;
  vision: string;
  mission: string;
  welcomeMessage: string;

  // =========================
  // WILAYAH DESA
  // =========================

  totalHamlets: string;
  totalRw: string;
  totalRt: string;

  // =========================
  // GEOGRAFIS
  // =========================

  foundedYear: string;
  areaSize: string;

  // =========================
  // KONTAK
  // =========================

  email: string;
  phone: string;
  website: string;

  // =========================
  // LOGO
  // =========================

  logo: {
    url: string | null;
    publicId: string | null;
    file: File | null;
  };

  // =========================
  // ALAMAT
  // =========================

  address: {
    detailAddress: string;

    rt: string;
    rw: string;

    village: string;
    district: string;
    regency: string;
    province: string;

    postalCode: string;

    // =========================
    // BATAS WILAYAH
    // =========================

    north: string;
    south: string;
    east: string;
    west: string;
  };

  // =========================
  // SOCIAL MEDIA
  // =========================

  socialMedia: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
  };

  // =========================
  // GOOGLE MAPS
  // =========================

  mapEmbed: string;
};

// =========================
// UPDATE PAYLOAD
// =========================

export type UpdateVillageProfilePayload = {
  name?: string | null;

  history?: string | null;
  vision?: string | null;
  mission?: string | null;
  welcomeMessage?: string | null;

  // =========================
  // LOGO
  // =========================

  logoUrl?: string | null;
  logoPublicId?: string | null;

  // =========================
  // KONTAK
  // =========================

  email?: string | null;
  phone?: string | null;
  website?: string | null;

  // =========================
  // SOCIAL MEDIA
  // =========================

  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  youtube?: string | null;

  // =========================
  // WILAYAH DESA
  // =========================

  totalHamlets?: number | null;
  totalRw?: number | null;
  totalRt?: number | null;

  // =========================
  // GEOGRAFIS
  // =========================

  areaSize?: number | null;
  foundedYear?: number | null;

  // =========================
  // ALAMAT
  // =========================

  address?: string | null;

  rt?: string | null;
  rw?: string | null;

  village?: string | null;
  district?: string | null;
  regency?: string | null;
  province?: string | null;
  postalCode?: string | null;

  // =========================
  // MAPS
  // =========================

  mapEmbed?: string | null;

  // =========================
  // BATAS WILAYAH
  // =========================

  northBoundary?: string | null;
  southBoundary?: string | null;
  eastBoundary?: string | null;
  westBoundary?: string | null;
};

// =========================
// API RESPONSE
// =========================

export type VillageProfileResponse = {
  success: boolean;
  data?: VillageProfile;
  message?: string;
};