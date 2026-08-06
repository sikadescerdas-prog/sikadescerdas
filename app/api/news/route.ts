// app/api/news/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

const selectAuthorProfile = {
  users: {
    select: {
      username: true,
      profiles: {
        select: {
          fullname: true,
          avatar_url: true,
        },
      },
    },
  },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 12);
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";

    console.log("NEWS SEARCH:", search);

    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { excerpt: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const where = {
      is_active: true,
      ...(category && { category }),
      ...searchFilter,
    };

    const [featured, data, total] = await Promise.all([
      // Featured
      prisma.news.findMany({
        where: {
          is_active: true,
          is_featured: true,
          ...searchFilter,
        },
        orderBy: { created_at: "desc" },
        take: 5,
        include: {
          news_images: true,
          news_links: true,
          ...selectAuthorProfile,
        },
      }),

      // List
      prisma.news.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: {
          news_images: true,
          news_links: true,
          ...selectAuthorProfile,
        },
      }),

      // Count
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({
      featured: serializeBigInt(featured),
      data: serializeBigInt(data),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("PUBLIC NEWS ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil berita" },
      { status: 500 }
    );
  }
}