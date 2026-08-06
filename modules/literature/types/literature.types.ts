// modules/dashboard/literature/types/literature.types.ts

export type LiteratureType = "article" | "book";

export type LiteraturePlatform =
  | "youtube"
  | "tiktok"
  | "instagram"
  | "facebook"
  | "website"
  | "x";

export interface LiteratureCategory {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface LiteratureLink {
  id?: string;
  literature_id?: string;
  platform: LiteraturePlatform | null;
  url: string;
  created_at?: string;
  updated_at?: string;
}

export interface LiteratureAuthor {
  id: string;
  username: string;
  profiles?: {
    fullname: string;
    avatar_url: string | null;
  } | null;
}

export interface Literature {
  id: string;
  author_id: string;
  type: LiteratureType;
  category_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  file_url: string | null;
  file_public_id: string | null;
  book_url: string | null;
  thumbnail_url: string | null;
  thumbnail_public_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  users?: LiteratureAuthor | null;
  literature_categories?: LiteratureCategory | null;
  literature_links?: LiteratureLink[];
}

export interface LiteratureThumbnailForm {
  url: string | null;
  publicId: string | null;
  file: File | null;
}

export interface LiteratureLinkForm {
  platform: LiteraturePlatform | null;
  url: string;
}

export interface LiteratureForm {
  type: LiteratureType;
  title: string;
  description: string | null;
  categoryId: string | null;
  content: string | null;
  thumbnail: LiteratureThumbnailForm;
  fileUrl: string | null;
  filePublicId: string | null;
  file: File | null;
  bookUrl: string | null;
  links: LiteratureLinkForm[];
}

export interface LiteratureCreatePayload {
  type: LiteratureType;
  title: string;
  description: string | null;
  categoryId: string | null;
  content: string | null;
  fileUrl: string | null;
  filePublicId: string | null;
  bookUrl: string | null;
  thumbnailUrl: string | null;
  thumbnailPublicId: string | null;
  is_active: boolean;
  links: {
    platform: LiteraturePlatform | null;
    url: string;
  }[];
}

export type LiteratureUpdatePayload =
  Partial<LiteratureCreatePayload>;

export interface LiteratureFilter {
  search?: string;
  type?: LiteratureType;
}