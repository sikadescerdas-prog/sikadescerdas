// app/api/dashboard/news/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

// =========================
// HELPER FUNCTIONS & SELECTS
// =========================
function createSlug(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const selectAuthorProfile = {
  users: { select: { id: true, username: true, profiles: { select: { fullname: true, avatar_url: true } } } },
};

// =========================
// GET ALL NEWS
// =========================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const year = searchParams.get("year") || "";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 50);
    const skip = (page - 1) * limit;

    const where = {
      ...(search && { title: { contains: search, mode: "insensitive" as const } }),
      ...(category && { category }),
      ...(year && { created_at: { gte: new Date(`${year}-01-01`), lt: new Date(`${Number(year) + 1}-01-01`) } }),
    };

    const [data, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
        skip,
        take: limit,
        include: { news_images: true, news_links: true, ...selectAuthorProfile },
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({
      data: serializeBigInt(data),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET NEWS ERROR:", error);
    return NextResponse.json({ message: "Gagal mengambil data berita" }, { status: 500 });
  }
}

// =========================
// CREATE NEWS
// =========================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { village_id, author_id, category, title, excerpt, content, thumbnail_url, thumbnail_public_id, content_date, content_location, images, links } = body;

    if (!village_id || !category || !title || !content || !thumbnail_url || !thumbnail_public_id) {
      return NextResponse.json({ message: "Data berita wajib diisi" }, { status: 400 });
    }

    if (images && images.length > 5) {
      return NextResponse.json({ message: "Maksimal 5 foto berita" }, { status: 400 });
    }

    // 1. Buat record awal
    const created = await prisma.news.create({
      data: {
        village_id: BigInt(village_id),
        author_id: author_id || null,
        category,
        title,
        slug: crypto.randomUUID(), // sementara
        excerpt,
        content,
        thumbnail_url,
        thumbnail_public_id,
        content_date: content_date ? new Date(content_date) : null,
        content_location: content_location || null,
        news_images: {
          create: images?.map((item: { image_url: string; image_public_id: string }) => ({
            image_url: item.image_url,
            image_public_id: item.image_public_id,
          })) ?? [],
        },
        news_links: {
          create: links?.map((item: { platform: "youtube" | "instagram" | "tiktok" | null; url: string }) => ({
            platform: item.platform,
            url: item.url,
          })) ?? [],
        },
      },
    });

    // 2. Update slug dengan ID berita yang baru dibuat
    const finalData = await prisma.news.update({
      where: { id: created.id },
      data: { slug: `${createSlug(title)}-${created.id.toString()}` },
      include: { news_images: true, news_links: true, ...selectAuthorProfile },
    });

    return NextResponse.json(serializeBigInt(finalData), { status: 201 });
  } catch (error) {
    console.error("CREATE NEWS ERROR:", error);
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Gagal membuat berita",
    }, { status: 500 });
  }
}