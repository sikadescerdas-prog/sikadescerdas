// modules/village/types/village.types.ts

export interface VillageContact {
  phone: string | null;
  email: string | null;
  website: string | null;
  workingHours: string;
}

export interface VillageSocialMedia {
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
}

export interface VillageAddress {
  address: string | null;
  rt: string | null;
  rw: string | null;
  village: string | null;
  district: string | null;
  regency: string | null;
  province: string | null;
  postalCode: string | null;
  fullAddress: string;
}

export interface VillageBoundary {
  north: string | null;
  south: string | null;
  east: string | null;
  west: string | null;
}

export interface VillageStatistics {
  totalRT: number;
  totalRW: number;
  totalHamlets: number;
}

export interface VillagePopulationItem {
  id: string;
  name: string;
}

export interface VillagePopulationCategory {
  id: string;
  name: string;
}

export interface VillagePopulationDetail {
  id: string;
  total: number;
  sortOrder: number;

  item: VillagePopulationItem;

  category: VillagePopulationCategory;
}

export interface VillagePopulation {
  year: number;

  male: number;

  female: number;

  total: number;

  familyCards: number;

  details: VillagePopulationDetail[];
}

export interface VillageHeadPeriod {
  id: string;
  startYear: number;
  endYear: number;
  text: string;
}

export interface VillageHead {
  id: string;

  name: string;

  title: string;

  gender: string | null;

  photo: string | null;

  phone: string | null;

  email: string | null;

  address: string | null;

  period: VillageHeadPeriod | null;
}

export interface VillageStructurePeriod {
  id: string;

  startYear: number;

  endYear: number;

  isActive: boolean | null;
}

export interface VillageStructure {
  id: string;

  fullName: string;

  gender: string | null;

  photo: string | null;

  phone: string | null;

  email: string | null;

  address: string | null;

  position: string;

  category: string;

  group: string | null;

  period: VillageStructurePeriod | null;
}

export interface VillageFacilityType {
  id: string;
  name: string;
}

export interface VillageFacilityCategory {
  id: string;
  name: string;
}

export interface VillageFacility {
  id: string;

  name: string;

  image: string | null;

  address: string | null;

  maps: string | null;

  type: VillageFacilityType;

  category: VillageFacilityCategory;
}

export interface VillagePotentialCategory {
  id: string;
  name: string;
}

export interface VillagePotential {
  id: string;

  name: string;

  description: string | null;

  image: string | null;

  address: string | null;

  maps: string | null;

  website: string | null;

  category: VillagePotentialCategory;
}

export interface VillageNews {
  id: string;

  title: string;

  slug: string;

  category: string;

  thumbnail: string | null;

  createdAt: string;
}

export interface VillageCounts {
  structures: number;

  facilities: number;

  potentials: number;

  populations: number;

  news: number;
}

export interface VillageResponse {
  id: string;

  name: string | null;

  history: string | null;

  vision: string | null;

  mission: string | null;

  welcomeMessage: string | null;

  foundedYear: number | null;

  areaSize: number | null;

  logo: string | null;

  mapEmbed: string | null;

  contact: VillageContact;

  socialMedia: VillageSocialMedia;

  address: VillageAddress;

  boundary: VillageBoundary;

  statistics: VillageStatistics;

  population: VillagePopulation | null;

  head: VillageHead | null;

  structures: VillageStructure[];

  facilities: VillageFacility[];

  potentials: VillagePotential[];

  potentialSummary: Record<string, number>;

  latestNews: VillageNews[];

  counts: VillageCounts;

  createdAt: string;

  updatedAt: string;
}