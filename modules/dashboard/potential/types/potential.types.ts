// modules/dashboard/potential/types/potential.types.ts

// =========================
// CATEGORY
// =========================

export interface PotentialCategory {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  village_potentials?: Potential[];
}

// =========================
// POTENTIAL
// =========================

export interface Potential {
  id: string;
  village_id: string;
  category_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  address: string | null;
  link_maps: string | null;
  website: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  village_potential_categories: PotentialCategory;
}

// =========================
// IMAGE FORM
// =========================

export interface PotentialImage {
  url: string | null;
  publicId: string | null;
  file: File | null;
}

// =========================
// FORM POTENTIAL
// =========================

export interface PotentialForm {
  category_id: string;
  name: string;
  description: string | null;
  image: PotentialImage;
  address: string | null;
  link_maps: string | null;
  website: string | null;
}

// =========================
// FORM CATEGORY
// =========================

export interface PotentialCategoryForm {
  name: string;
  description: string | null;
}

// =========================
// CREATE PAYLOAD
// =========================

export interface PotentialCreatePayload {
  village_id: string;
  category_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  address: string | null;
  link_maps: string | null;
  website: string | null;
}