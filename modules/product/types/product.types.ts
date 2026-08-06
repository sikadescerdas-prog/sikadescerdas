// modules/product/types/product.types.ts

export interface ProductCategory { id: string; name: string; }
export interface ProductImage { id: string; url: string; publicId: string | null; }

export interface Product {
  id: string;
  storeId: string;
  categoryId: string | null;
  category: ProductCategory | null;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  thumbnailPublicId: string | null;
  price: number;
  stock: number;
  unit: string | null;
  weight: number | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}

export interface ProductImageForm { id?: string; url: string | null; publicId: string | null; file: File | null; }

export interface ProductForm {
  categoryId: string | null;
  name: string;
  slug: string;
  description: string;
  thumbnail: { url: string | null; publicId: string | null; file: File | null; };
  images: ProductImageForm[];
  price: string;
  stock: string;
  unit: string;
  weight: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface ProductCreatePayload {
  storeId: string;
  categoryId: string | null;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string;
  thumbnailPublicId: string | null;
  price: number;
  stock: number;
  unit: string | null;
  weight: number | null;
  isFeatured: boolean;
  isActive: boolean;
  images: { url: string; publicId: string | null; }[];
}

export interface ProductListResponse {
  data: Product[];
  pagination: { page: number; limit: number; total: number; totalPages: number; };
}

export interface ProductFilter { search?: string; category?: string; page?: number; limit?: number; }