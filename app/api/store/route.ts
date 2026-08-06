// app/api/store/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || "";

    if (slug) {
      const store = await prisma.stores.findFirst({
        where: { slug },
        include: {
          products: {
            where: { is_active: true },
            orderBy: [
              { is_featured: "desc" },
              { is_active: "asc" },
              { created_at: "desc" },
            ],
            take: 3,
          },
        },
      });

      if (!store) {
        return NextResponse.json(
          { message: "Store tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        data: serializeBigInt(store),
      });
    }

    const stores = await prisma.stores.findMany({
      where: { is_active: true },
      orderBy: { created_at: "desc" },
      include: {
        products: {
          where: { is_active: true },
          orderBy: [
            { is_featured: "desc" },
            { is_active: "asc" },
            { created_at: "desc" },
          ],
          take: 3,
          select: {
            id: true,
            name: true,
            slug: true,
            thumbnail_url: true,
            price: true,
            stock: true,
            is_featured: true,
            is_active: true,
            product_categories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const result = stores.map((store) => ({
      id: String(store.id),
      name: store.name,
      slug: store.slug,
      logoUrl: store.logo_url,
      bannerUrl: store.banner_url,
      province: store.province,
      regency: store.regency,
      district: store.district,
      village: store.village,
      address: store.address,
      products: store.products.map((product) => ({
        id: String(product.id),
        name: product.name,
        slug: product.slug,
        thumbnailUrl: product.thumbnail_url,
        price: Number(product.price),
        stock: product.stock,
        isFeatured: product.is_featured,
        isActive: product.is_active,
        category: product.product_categories
          ? {
              id: String(product.product_categories.id),
              name: product.product_categories.name,
            }
          : null,
      })),
    }));

    return NextResponse.json({
      data: result,
    });
  } catch (error) {
    console.error("GET STORE ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data store",
      },
      { status: 500 }
    );
  }
}