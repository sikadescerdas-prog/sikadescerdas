// modules/dashboard/structure/types/structure.types.ts

export type StructureType = "government" | "institution";

export type Gender = "male" | "female";

// =========================================================
// PERIOD
// =========================================================

export interface StructurePeriod {
  id: string;
  start_year: number;
  end_year: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// =========================================================
// CATEGORY
// =========================================================

export interface StructureCategory {
  id: string;
  name: string;
  type: StructureType;
  level?: number | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// =========================================================
// Untuk Lembaga Desa (Contoh: BPD, PKK, Karang Taruna)
// =========================================================

export interface StructureGroup {
  id: string;
  category_id: string;
  name: string;
  is_active: boolean;
  category?: StructureCategory;
  created_at?: string;
  updated_at?: string;
}

// =========================================================
// POSITION
// =========================================================

export interface StructurePosition {
  id: string;
  category_id: string;
  /**
   * Pemerintah Desa:
   * Kepala Desa -> Sekretaris Desa -> Kaur
   *
   * Lembaga Desa:
   * tidak digunakan
   */
  parent_id?: string | null;
  /**
   * Lembaga Desa:
   * BPD -> Ketua, PKK -> Ketua
   */
  group_id?: string | null;
  /**
   * Nama jabatan: Kepala Desa, Sekretaris Desa, Ketua, Anggota
   */
  name: string;
  is_multiple?: boolean;
  is_active?: boolean;
  category?: StructureCategory;
  group?: StructureGroup | null;
  parent?: StructurePosition | null;
  children?: StructurePosition[];
  created_at?: string;
  updated_at?: string;
}

// =========================================================
// MEMBER POSITION RESPONSE
// =========================================================

export interface StructureMemberPosition {
  id: string;
  name: string;
  category?: StructureCategory;
  group?: StructureGroup | null;
}

// =========================================================
// MEMBER
// =========================================================

export interface StructureMember {
  id: string;
  village_id: string;
  period_id: string;
  position_id: string;
  full_name: string;
  gender?: Gender | null;
  photo_url?: string | null;
  photo_public_id?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  is_active: boolean;
  position?: StructureMemberPosition;
  village_structure_periods?: StructurePeriod;
  period?: StructurePeriod;
  created_at?: string;
  updated_at?: string;
}

// =========================================================
// FORM PAYLOADS
// =========================================================

export interface StructurePeriodForm {
  start_year: number;
  end_year: number;
}

export interface StructureCategoryForm {
  name: string;
  type: StructureType;
  level?: number | null;
}

export interface StructurePositionForm {
  category_id: string;
  /**
   * Pemerintah Desa: isi parent_id (Contoh: Sekretaris Desa -> Kepala Desa)
   */
  parent_id?: string | null;
  /**
   * Lembaga Desa: isi group_id (Contoh: Ketua BPD -> group BPD)
   */
  group_id?: string | null;
  name: string;
  is_multiple?: boolean;
}

export interface StructureMemberForm {
  period_id: string;
  position_id: string;
  full_name: string;
  gender?: Gender | null;
  photo: {
    url: string | null;
    publicId: string | null;
    file: File | null;
  };
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface StructureGroupForm {
  category_id: string;
  name: string;
}

// =========================================================
// CREATE MEMBER PAYLOAD
// =========================================================

export interface CreateStructureMember {
  village_id: string;
  period_id: string;
  position_id: string;
  full_name: string;
  gender?: Gender | null;
  photo_url: string | null;
  photo_public_id: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

// =========================================================
// RESPONSE
// =========================================================

export interface StructureResponse {
  village?: {
    id: string;
    name: string;
  };
  categories: StructureCategory[];
  groups: StructureGroup[];
  positions: StructurePosition[];
  periods: StructurePeriod[];
  members: StructureMember[];
}