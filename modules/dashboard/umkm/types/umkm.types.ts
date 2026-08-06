// modules/dashboard/types/umkm.types.ts

export type Store = {
  ownerUid: string;
  nameStore?: string;
  addressStore?: {
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  logo?: { url?: string };
  isActive?: boolean;
  isVerified?: boolean
};

export type UMKMProduct = {
  id: string;
  ownerUid: string;
  name?: string;
  category?: string;
  price?: number;
  image?: { url?: string };
};

export type UMKMDataResponse = {
  stores: Store[];
  products: UMKMProduct[];
};