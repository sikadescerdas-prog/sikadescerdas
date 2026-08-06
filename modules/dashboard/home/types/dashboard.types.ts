// modules/dashboard/home/types/dashboard.types.ts

export interface DashboardStats {
  users: number;
  active_users: number;
  stores: number;
  products: number;
  news: number;
  literatures: number;
  facilities: number;
  potentials: number;
}

export interface PopulationData {
  total_population: number;
  total_family_cards: number;
  total_male?: number;
  total_female?: number;
}

export interface PopulationComparison {
  current_year: number;
  current_data: PopulationData | null;
  previous_year: number;
  previous_data: PopulationData | null;
  growth: {
    difference: number;
    percentage: string;
    is_increase: boolean;
  };
}

export interface VillageOfficialStaff {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  photo_url: string | null;
  village_structure_positions: {
    name: string;
  };
}

export interface VillageOfficials {
  period_name: string;
  staffs: VillageOfficialStaff[];
}

export interface SchoolFacilityItem {
  id: string;
  name: string;
  address: string | null;
}

export interface RecentProductItem {
  id: string;
  name: string;
  price: number;
  stores: {
    name: string;
  };
  created_at: string;
}

export interface RecentNewsItem {
  id: string;
  title: string;
  category: string;
  created_at: string;
}

export interface TopPotentialItem {
  id: string;
  name: string;
  description: string | null;
}

export interface DashboardLists {
  schools: SchoolFacilityItem[];
  products: RecentProductItem[];
  news: RecentNewsItem[];
  potentials: TopPotentialItem[];
}

export interface DashboardData {
  stats: DashboardStats;
  population_comparison: PopulationComparison;
  village_officials: VillageOfficials;
  lists: DashboardLists;
}

export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}