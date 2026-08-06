// app/api/store/settings/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";

const MARKETPLACE_PLATFORMS = ["shopee", "tiktok_shop", "tokopedia"] as const;

type MarketplacePlatform = (typeof MARKETPLACE_PLATFORMS)[number];

type StoreMarketplaceData = {
  id: bigint;
  store_id: bigint;
  platform: string;
  url: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

type StoreData = {
  id: bigint;
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
  latitude: unknown;
  longitude: unknown;
  is_store_complete: boolean;
  is_active: boolean;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
  store_marketplaces: StoreMarketplaceData[];
};

function serializeStore(store: StoreData) {
  return {
    id: store.id.toString(),
    owner_id: store.owner_id,
    name: store.name,
    slug: store.slug,
    description: store.description,
    logo_url: store.logo_url,
    logo_public_id: store.logo_public_id,
    banner_url: store.banner_url,
    banner_public_id: store.banner_public_id,
    phone: store.phone,
    email: store.email,
    province: store.province,
    regency: store.regency,
    district: store.district,
    village: store.village,
    address: store.address,
    latitude: store.latitude?.toString() ?? null,
    longitude: store.longitude?.toString() ?? null,
    marketplaces: store.store_marketplaces.map((item: StoreMarketplaceData) => ({
      id: item.id.toString(),
      platform: item.platform as MarketplacePlatform,
      url: item.url,
      is_active: item.is_active,
    })),
    is_store_complete: store.is_store_complete,
    is_active: store.is_active,
    is_verified: store.is_verified,
    created_at: store.created_at.toISOString(),
    updated_at: store.updated_at.toISOString(),
  };
}

async function getStore(ownerId: string) {
  return prisma.stores.findUnique({
    where: { owner_id: ownerId },
    include: { store_marketplaces: true },
  });
}

async function getStoreById(storeId: bigint) {
  return prisma.stores.findUniqueOrThrow({
    where: { id: storeId },
    include: { store_marketplaces: true },
  });
}

export async function GET() {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const store = await getStore(session.id);

    if (!store) {
      return NextResponse.json(
        { code: "STORE_NOT_FOUND", message: "Anda belum memiliki toko." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: "STORE_FOUND",
      message: "Data toko berhasil diambil.",
      store: serializeStore(store as StoreData),
    });
  } catch (error: unknown) {
    console.error("[STORE_SETTINGS_GET_ERROR]:", error);

    return NextResponse.json(
      { code: "STORE_SETTINGS_ERROR", message: "Gagal mengambil data toko." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const store = await getStore(session.id);

    if (!store) {
      return NextResponse.json(
        { code: "STORE_NOT_FOUND", message: "Anda belum memiliki toko." },
        { status: 404 }
      );
    }

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { code: "INVALID_BODY", message: "Data request tidak valid." },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : store.name;

    if (!name) {
      return NextResponse.json(
        { code: "STORE_NAME_REQUIRED", message: "Nama toko wajib diisi." },
        { status: 400 }
      );
    }

    if (name.length < 3) {
      return NextResponse.json(
        { code: "STORE_NAME_TOO_SHORT", message: "Nama toko minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (name.length > 150) {
      return NextResponse.json(
        { code: "STORE_NAME_TOO_LONG", message: "Nama toko maksimal 150 karakter." },
        { status: 400 }
      );
    }

    const description = typeof body.description === "string" ? body.description.trim() || null : store.description;
    const phone = typeof body.phone === "string" ? body.phone.trim() || null : store.phone;
    const email = typeof body.email === "string" ? body.email.trim() || null : store.email;

    const logoUrl = typeof body.logo_url === "string" ? body.logo_url.trim() || null : store.logo_url;
    const logoPublicId = typeof body.logo_public_id === "string" ? body.logo_public_id.trim() || null : store.logo_public_id;

    const bannerUrl = typeof body.banner_url === "string" ? body.banner_url.trim() || null : store.banner_url;
    const bannerPublicId = typeof body.banner_public_id === "string" ? body.banner_public_id.trim() || null : store.banner_public_id;

    const province = typeof body.province === "string" ? body.province.trim() || null : store.province;
    const regency = typeof body.regency === "string" ? body.regency.trim() || null : store.regency;
    const district = typeof body.district === "string" ? body.district.trim() || null : store.district;
    const village = typeof body.village === "string" ? body.village.trim() || null : store.village;
    const address = typeof body.address === "string" ? body.address.trim() || null : store.address;

    const latitude = typeof body.latitude === "string" && body.latitude.trim() ? body.latitude.trim() : store.latitude;
    const longitude = typeof body.longitude === "string" && body.longitude.trim() ? body.longitude.trim() : store.longitude;

    const marketplaceData: {
      platform: MarketplacePlatform;
      value: string;
    }[] = [
      {
        platform: "shopee",
        value: typeof body.shopee === "string" ? body.shopee.trim() : "",
      },
      {
        platform: "tiktok_shop",
        value: typeof body.tiktokShop === "string" ? body.tiktokShop.trim() : "",
      },
      {
        platform: "tokopedia",
        value: typeof body.tokopedia === "string" ? body.tokopedia.trim() : "",
      },
    ];

    const isStoreComplete =
      Boolean(name) &&
      Boolean(description) &&
      Boolean(phone) &&
      Boolean(email) &&
      Boolean(province) &&
      Boolean(regency) &&
      Boolean(district) &&
      Boolean(village) &&
      Boolean(address) &&
      Boolean(latitude) &&
      Boolean(longitude) &&
      Boolean(logoUrl) &&
      Boolean(logoPublicId) &&
      Boolean(bannerUrl) &&
      Boolean(bannerPublicId);

    const isActive = isStoreComplete;

    const updatedStoreId = await prisma.$transaction(async (tx) => {
      const updatedStore = await tx.stores.update({
        where: { id: store.id },
        data: {
          name,
          description,
          phone,
          email,
          logo_url: logoUrl,
          logo_public_id: logoPublicId,
          banner_url: bannerUrl,
          banner_public_id: bannerPublicId,
          province,
          regency,
          district,
          village,
          address,
          latitude,
          longitude,
          is_store_complete: isStoreComplete,
          is_active: isActive,
        },
      });

      for (const marketplace of marketplaceData) {
        if (marketplace.value) {
          await tx.store_marketplaces.upsert({
            where: {
              store_id_platform: {
                store_id: store.id,
                platform: marketplace.platform,
              },
            },
            update: {
              url: marketplace.value,
              is_active: true,
            },
            create: {
              store_id: store.id,
              platform: marketplace.platform,
              url: marketplace.value,
              is_active: true,
            },
          });
        } else {
          await tx.store_marketplaces.deleteMany({
            where: {
              store_id: store.id,
              platform: marketplace.platform,
            },
          });
        }
      }

      return updatedStore.id;
    });

    const finalStore = await getStoreById(updatedStoreId);

    return NextResponse.json({
      code: "STORE_UPDATED",
      message: isStoreComplete
        ? "Data toko berhasil diperbarui dan toko sekarang aktif."
        : "Data toko berhasil diperbarui, tetapi toko belum lengkap.",
      store: serializeStore(finalStore as StoreData),
    });
  } catch (error: unknown) {
    console.error("[STORE_SETTINGS_PUT_ERROR]:", error);

    return NextResponse.json(
      { code: "STORE_UPDATE_ERROR", message: "Gagal memperbarui data toko." },
      { status: 500 }
    );
  }
}