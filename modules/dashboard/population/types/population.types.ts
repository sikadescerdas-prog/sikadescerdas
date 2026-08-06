// modules/dashboard/population/types/population.types.ts

// =========================
// MASTER CATEGORY
// =========================
export interface PopulationCategory {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  population_master_items: PopulationMasterItem[];
}

// =========================
// MASTER ITEM
// =========================
export interface PopulationMasterItem {
  id: string;
  category_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  population_categories?: PopulationCategory;
}

// =========================
// POPULATION DETAIL
// =========================
export interface PopulationDetail {
  id: string;
  population_id: string;
  item_id: string;
  total: number;
  sort_order: number;
  population_master_items: PopulationMasterItem;
}

// =========================
// VILLAGE POPULATION
// =========================
export interface Population {
  id: string;
  village_id: string;
  year: number;

  // Data Umum
  total_family_cards: number;
  total_male: number;
  total_female: number;
  total_population: number;

  is_active: boolean;
  created_at: string;
  updated_at: string;
  village_population_details: PopulationDetail[];
}

// =========================
// CREATE
// =========================
export interface CreatePopulationPayload {
  village_id: string;
  year: number;
  total_family_cards: number;
  total_male: number;
  total_female: number;
  details: PopulationDetailPayload[];
}

// =========================
// UPDATE
// =========================
export interface UpdatePopulationPayload {
  year?: number;
  total_family_cards?: number;
  total_male?: number;
  total_female?: number;
  details?: PopulationDetailPayload[];
}

// =========================
// DETAIL PAYLOAD
// =========================
export interface PopulationDetailPayload {
  item_id: string;
  total: number;
  sort_order?: number;
}

// =========================
// FILTER
// =========================
export interface PopulationFilter {
  year?: number;
}