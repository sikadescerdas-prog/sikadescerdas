// app/api/home/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeData(value: unknown): unknown {
  if (typeof value === "bigint") {
    return Number(value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeData(item));
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, serializeData(val)])
    );
  }

  return value;
}

function formatNumber(value: number) {
  if (value >= 1000) {
    return `${Math.floor(value / 1000)}rb+`;
  }
  return value.toString();
}

export async function GET() {
  try {
    const village = await prisma.villages.findFirst({
      select: {
        id: true,
        name: true,
        welcome_message: true,
        logo_url: true,
        address: true,
        province: true,
        regency: true,
        district: true,
        village: true,
        total_hamlets: true,
        total_rt: true,
        total_rw: true,
      },
    });

    const population = await prisma.village_populations.findFirst({
      where: { is_active: true },
      orderBy: { year: "desc" },
      select: {
        year: true,
        total_population: true,
      },
    });

    const [
      umkmCount,
      productCount,
      facilityCount,
      totalBooks,
      totalArticles,
      totalLiteratures,
    ] = await Promise.all([
      prisma.stores.count({ where: { is_active: true } }),
      prisma.products.count({ where: { is_active: true } }),
      prisma.village_facilities.count({ where: { is_active: true } }),
      prisma.literatures.count({ where: { is_active: true, type: "book" } }),
      prisma.literatures.count({ where: { is_active: true, type: "article" } }),
      prisma.literatures.count({ where: { is_active: true } }),
    ]);

    const facilityCategories = await prisma.village_facilities.findMany({
      where: { is_active: true },
      select: {
        village_facility_types: {
          select: { name: true },
        },
      },
      distinct: ["type_id"],
    });

    const products = await prisma.products.findMany({
      where: { is_active: true },
      orderBy: { created_at: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        thumbnail_url: true,
        price: true,
        stock: true,
        stores: {
          select: {
            name: true,
            slug: true,
            logo_url: true,
          },
        },
      },
    });

    const news = await prisma.news.findMany({
      where: { is_active: true },
      orderBy: { created_at: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnail_url: true,
        category: true,
        content_date: true,
        created_at: true,
      },
    });

    const response = {
      village,
      statistics: {
        population: population?.total_population ?? 0,
        populationYear: population?.year ?? null,
        umkm: {
          total: umkmCount,
          products: formatNumber(productCount),
        },
        facilities: {
          total: facilityCount,
          categories: facilityCategories.map(
            (item) => item.village_facility_types.name
          ),
        },
        region: {
          hamlets: village?.total_hamlets ?? 0,
          rt: village?.total_rt ?? 0,
          rw: village?.total_rw ?? 0,
        },
      },
      literatures: {
        total: formatNumber(totalLiteratures),
        books: formatNumber(totalBooks),
        articles: formatNumber(totalArticles),
      },
      products: products.map((product) => ({
        id: Number(product.id),
        name: product.name,
        slug: product.slug,
        thumbnail_url: product.thumbnail_url,
        // FIX DECIMAL PRISMA
        price: Number(product.price.toString()),
        stock: product.stock,
        stores: product.stores,
      })),
      news,
    };

    return NextResponse.json(
      {
        success: true,
        data: serializeData(response),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("HOME API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data homepage",
      },
      { status: 500 }
    );
  }
}