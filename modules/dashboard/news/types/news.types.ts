// modules/dashboard/news/types/news.types.ts

export type NewsCategory = "news" | "announcement" | "event";
export type NewsPlatform = "youtube" | "instagram" | "facebook" | "tiktok" | "x" | "website";

export interface NewsThumbnail { url: string | null; publicId: string | null; file: File | null; }
export interface NewsGalleryItem { url: string | null; publicId: string | null; file: File | null; }

export interface NewsLink { id?: string; platform: NewsPlatform | null; url: string; }

export interface NewsForm {
  category: "" | NewsCategory;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: NewsThumbnail;
  gallery: NewsGalleryItem[];
  content_date: string | null;
  content_location: string | null;
  links: NewsLink[];
}

export interface NewsCreateImage { image_url: string; image_public_id: string | null; }

export interface NewsCreatePayload {
  village_id: string;
  author_id: string | null;
  category: NewsCategory;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  thumbnail_public_id: string;
  content_date: string | null;
  content_location: string | null;
  images: NewsCreateImage[];
  links: NewsLink[];
}

export interface NewsImage { id: string; image_url: string; image_public_id: string | null; }

export interface News {
  id: string;
  village_id: string;
  author_id: string | null;
  category: NewsCategory;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string | null;
  thumbnail_public_id: string | null;
  content_date: string | Date | null;
  content_location: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  news_images?: NewsImage[];
  news_links?: NewsLink[];
  users?: { username: string; profiles?: { fullname: string | null; } | null; } | null;
}

export interface NewsFilter { search?: string; category?: string; year?: number; page?: number; limit?: number; }

export interface NewsListResponse {
  data: News[];
  pagination: { page: number; limit: number; total: number; totalPages: number; };
}