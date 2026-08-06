// app/api/dashboard/news/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

type RouteParams = { params: Promise<{ id: string }> };

interface NewsImageInput {
  image_url: string;
  image_public_id?: string | null;
}

interface NewsLinkInput {
  platform: string;
  url: string;
}

// =========================
// GET DETAIL NEWS
// =========================
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const news = await prisma.news.findUnique({
      where: { id: BigInt(id) },
      include: {
        news_images: true,
        news_links: true,
        users: { select: { id: true, username: true, profiles: { select: { fullname: true, avatar_url: true } } } },
      },
    });

    if (!news) {
      return NextResponse.json({ message: "Berita tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(serializeBigInt(news));
  } catch (error) {
    console.error("GET DETAIL NEWS ERROR:", error);
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Gagal mengambil detail berita",
    }, { status: 500 });
  }
}

// =========================
// UPDATE NEWS
// =========================
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const newsId = BigInt(id);
    const body = await request.json();

    const updated = await prisma.$transaction(async (tx) => {
      // Hapus gallery lama
      await tx.news_images.deleteMany({ where: { news_id: newsId } });

      // Hapus link lama
      await tx.news_links.deleteMany({ where: { news_id: newsId } });

      const news = await tx.news.update({
        where: { id: newsId },
        data: {
          category: body.category,
          title: body.title,
          slug: body.slug,
          excerpt: body.excerpt ?? null,
          content: body.content,
          thumbnail_url: body.thumbnail_url,
          thumbnail_public_id: body.thumbnail_public_id ?? null,
          content_date: body.content_date ? new Date(body.content_date) : null,
          content_location: body.content_location ?? null,
          news_images: {
            create: body.images?.map((item: NewsImageInput) => ({
              image_url: item.image_url,
              image_public_id: item.image_public_id ?? null,
            })) ?? [],
          },
          news_links: {
            create: body.links?.map((item: NewsLinkInput) => ({
              platform: item.platform,
              url: item.url,
            })) ?? [],
          },
        },
        include: {
          news_images: true,
          news_links: true,
          users: { select: { id: true, username: true, profiles: { select: { fullname: true, avatar_url: true } } } },
        },
      });

      return news;
    });

    return NextResponse.json(serializeBigInt(updated));
  } catch (error) {
    console.error("UPDATE NEWS ERROR:", error);
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Gagal memperbarui berita",
    }, { status: 500 });
  }
}

// =========================
// DELETE NEWS
// =========================
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const newsId = BigInt(id);

    const news = await prisma.news.findUnique({ where: { id: newsId } });

    if (!news) {
      return NextResponse.json({ message: "Berita tidak ditemukan" }, { status: 404 });
    }

    await prisma.news.delete({ where: { id: newsId } });

    return NextResponse.json({ message: "Berita berhasil dihapus" });
  } catch (error) {
    console.error("DELETE NEWS ERROR:", error);
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Gagal menghapus berita",
    }, { status: 500 });
  }
}

// =========================
// TOGGLE FEATURED NEWS
// =========================
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const newsId = BigInt(id);
    const body = await request.json();
    const { is_featured }: { is_featured: boolean } = body;

    if (typeof is_featured !== "boolean") {
      return NextResponse.json({ message: "Status unggulan tidak valid" }, { status: 400 });
    }

    // Jika mengaktifkan unggulan
    if (is_featured) {
      const totalFeatured = await prisma.news.count({
        where: {
          is_featured: true,
          is_active: true,
          NOT: { id: newsId },
        },
      });

      if (totalFeatured >= 5) {
        return NextResponse.json({ message: "Maksimal hanya 5 berita unggulan" }, { status: 400 });
      }
    }

    const updated = await prisma.news.update({
      where: { id: newsId },
      data: { is_featured },
      include: {
        news_images: true,
        news_links: true,
        users: { select: { id: true, username: true, profiles: { select: { fullname: true, avatar_url: true } } } },
      },
    });

    return NextResponse.json(serializeBigInt(updated));
  } catch (error) {
    console.error("TOGGLE FEATURED ERROR:", error);
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Gagal mengubah berita unggulan",
    }, { status: 500 });
  }
}