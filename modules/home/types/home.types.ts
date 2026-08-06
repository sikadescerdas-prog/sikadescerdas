// modules/home/types/home.types.ts

export interface HomeResponse {
  success: boolean;
  data: HomeData;
  message?: string;
}

export interface HomeData {
  village: HomeVillage | null;

  statistics: HomeStatistics;

  literatures: HomeLiteratures;

  products: HomeProduct[];

  news: HomeNews[];
}

export interface HomeVillage {
  id: number;
  name: string | null;
  welcome_message: string | null;
  logo_url: string | null;
  address: string | null;

  province: string | null;
  regency: string | null;
  district: string | null;
  village: string | null;

  total_hamlets: number;
  total_rt: number;
  total_rw: number;
}

export interface HomeStatistics {
  population: number;

  populationYear: number | null;

  umkm: {
    total: number;
    products: string;
  };

  facilities: {
    total: number;
    categories: string[];
  };

  region: {
    hamlets: number;
    rt: number;
    rw: number;
  };
}

export interface HomeLiteratures {
  total: string;
  books: string;
  articles: string;
}

export interface HomeProduct {
  id: number;

  name: string;

  slug: string;

  thumbnail_url: string;

  price: number;

  stock: number;

  stores: {
    name: string;
    slug: string;
    logo_url: string | null;
  };
}

export interface HomeNews {
  id: number;

  title: string;

  slug: string;

  excerpt: string;

  thumbnail_url: string;

  category: string;

  content_date: string | null;

  created_at: string;
}