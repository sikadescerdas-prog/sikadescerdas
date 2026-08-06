// modules/dashboard/facility/types/facility.types.ts

// =========================
// CATEGORY
// =========================
export interface FacilityCategory {
  id: string;
  name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  village_facility_types?: FacilityType[];
}

// =========================
// TYPE
// =========================
export interface FacilityType {
  id: string;
  category_id: string;
  name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  village_facility_categories: FacilityCategory;
  village_facilities?: Facility[];
}

// =========================
// FACILITY
// =========================
export interface Facility {
  id: string;
  village_id: string;
  type_id: string;
  name: string;
  image_url: string | null;
  image_public_id: string | null;
  address: string | null;
  link_maps: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  village_facility_types: FacilityType;
}

// =========================
// IMAGE FORM
// =========================
export interface FacilityImage {
  url: string | null;
  publicId: string | null;
  file: File | null;
}

// =========================
// FORM FACILITY
// =========================
export interface FacilityForm {
  type_id: string;
  name: string;
  image: FacilityImage;
  address: string | null;
  link_maps: string | null;
}

// =========================
// FORM CATEGORY
// =========================

export interface FacilityCategoryForm {
  name: string;
}

// =========================
// FORM TYPE
// =========================

export interface FacilityTypeForm {
  category_id: string;
  name: string;
}

// =========================
// CREATE PAYLOAD
// =========================
export interface FacilityCreatePayload {
  village_id: string;
  type_id: string;
  name: string;
  image_url: string | null;
  image_public_id: string | null;
  address: string | null;
  link_maps: string | null;
}