// modules/store/types/store.types.ts

export type StoreMarketplace = { id: string; platform: "shopee" | "tiktok_shop" | "tokopedia"; url: string; is_active: boolean; };

export type Store = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  logo_public_id: string | null;
  banner_url: string | null;
  banner_public_id: string | null;
  phone: string | null;
  email: string | null;
  province: string | null;
  regency: string | null;
  district: string | null;
  village: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  marketplaces: StoreMarketplace[];
  is_store_complete: boolean;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type StoreForm = {
  name: string;
  description: string;
  phone: string;
  email: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  address: string;
  latitude: string;
  longitude: string;
  shopee: string;
  tiktokShop: string;
  tokopedia: string;
};

export type CreateStoreResponse = { code: string; message: string; store?: Store; };
export type GetStoreResponse = { code: string; message: string; store?: Store; };

export type UpdateStorePayload = {
  name?: string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  province?: string | null;
  regency?: string | null;
  district?: string | null;
  village?: string | null;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  logo_url?: string | null;
  logo_public_id?: string | null;
  banner_url?: string | null;
  banner_public_id?: string | null;
  shopee?: string | null;
  tiktokShop?: string | null;
  tokopedia?: string | null;
};

export type UpdateStoreResponse = { code: string; message: string; store?: Store; };