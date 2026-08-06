// modules/news/types/news.types.ts

export type NewsCategory = "news" | "announcement" | "event";

export type NewsPlatform = "youtube" | "instagram" | "facebook" | "tiktok" | "x" | "website";

export interface NewsImage {
  id: string;
  image_url: string;
  image_public_id: string | null;
}

export interface NewsLink {
  id: string;
  platform: NewsPlatform;
  url: string;
}

export interface News {
  id: string;
  category: NewsCategory;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string | null;
  content_date: string | null;
  content_location: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  news_images: NewsImage[];
  news_links: NewsLink[];
  users?: {
    username: string;
    profiles?: {
      fullname: string | null;
      avatar_url: string | null;
    } | null;
  } | null;
}

export interface NewsFilter {
  page?: number;
  limit?: number;
  category?: string;
   search?: string;
}

export interface NewsResponse {
  featured: News[];
  data: News[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}