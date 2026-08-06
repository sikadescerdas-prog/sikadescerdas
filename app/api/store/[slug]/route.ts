// app/api/store/[slug]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { code: "STORE_SLUG_REQUIRED", message: "Slug toko wajib diisi." },
        { status: 400 }
      );
    }

    const session = await getCurrentUser();

    const store = await prisma.stores.findUnique({
      where: { slug },
      select: {
        id: true,
        owner_id: true,
        name: true,
        slug: true,
        description: true,
        logo_url: true,
        logo_public_id: true,
        banner_url: true,
        banner_public_id: true,
        phone: true,
        email: true,
        province: true,
        regency: true,
        district: true,
        village: true,
        address: true,
        latitude: true,
        longitude: true,
        is_store_complete: true,
        is_verified: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        users: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
        store_marketplaces: {
          where: { is_active: true },
          select: {
            id: true,
            platform: true,
            url: true,
            is_active: true,
          },
          orderBy: { platform: "asc" },
        },
        products: {
          where: { is_active: true },
          orderBy: { created_at: "desc" },
          select: {
            id: true,
            store_id: true,
            category_id: true,
            name: true,
            slug: true,
            description: true,
            thumbnail_url: true,
            thumbnail_public_id: true,
            price: true,
            stock: true,
            unit: true,
            weight: true,
            is_featured: true,
            is_active: true,
            created_at: true,
            updated_at: true,
            product_categories: {
              select: {
                id: true,
                name: true,
              },
            },
            product_images: {
              orderBy: { created_at: "asc" },
              select: {
                id: true,
                image_url: true,
                image_public_id: true,
              },
            },
          },
        },
      },
    });

    if (!store) {
      return NextResponse.json(
        { code: "STORE_NOT_FOUND", message: "Toko tidak ditemukan." },
        { status: 404 }
      );
    }

    const isOwner = session?.id === store.owner_id;

    const products = store.products.map((product) => ({
      id: product.id.toString(),
      store_id: product.store_id.toString(),
      category_id: product.category_id?.toString() ?? null,
      name: product.name,
      slug: product.slug,
      description: product.description,
      thumbnail_url: product.thumbnail_url,
      thumbnail_public_id: product.thumbnail_public_id,
      price: product.price.toString(),
      stock: product.stock,
      unit: product.unit,
      weight: product.weight?.toString() ?? null,
      is_featured: product.is_featured,
      is_active: product.is_active,
      category: product.product_categories
        ? {
            id: product.product_categories.id.toString(),
            name: product.product_categories.name,
          }
        : null,
      images: product.product_images.map((image) => ({
        id: image.id.toString(),
        url: image.image_url,
        publicId: image.image_public_id,
      })),
      created_at: product.created_at,
      updated_at: product.updated_at,
    }));

    const marketplaces = store.store_marketplaces.map((item) => ({
      id: item.id.toString(),
      platform: item.platform,
      url: item.url,
      is_active: item.is_active,
    }));

    return NextResponse.json({
      code: "STORE_FOUND",
      message: "Detail toko berhasil diambil.",
      store: {
        id: store.id.toString(),
        owner_id: store.owner_id,
        name: store.name,
        slug: store.slug,
        description: store.description,
        logo: store.logo_url
          ? {
              url: store.logo_url,
              publicId: store.logo_public_id,
            }
          : null,
        banner: store.banner_url
          ? {
              url: store.banner_url,
              publicId: store.banner_public_id,
            }
          : null,
        phone: store.phone,
        email: store.email,
        address: {
          province: store.province,
          regency: store.regency,
          district: store.district,
          village: store.village,
          address: store.address,
          latitude: store.latitude?.toString() ?? null,
          longitude: store.longitude?.toString() ?? null,
        },
        owner: store.users
          ? {
              id: store.users.id,
              username: store.users.username,
              role: store.users.role,
            }
          : null,
        marketplaces,
        products,
        is_store_complete: store.is_store_complete,
        is_verified: store.is_verified,
        is_active: store.is_active,
        is_owner: isOwner,
        created_at: store.created_at,
        updated_at: store.updated_at,
      },
    });
  } catch (error) {
    console.error("[STORE_DETAIL_GET_ERROR]:", error);

    return NextResponse.json(
      { code: "STORE_DETAIL_ERROR", message: "Gagal mengambil detail toko." },
      { status: 500 }
    );
  }
}