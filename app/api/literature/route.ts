// app/api/literature/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

/* =========================
GET ALL
========================= */

export async function GET(request: Request) {
  try {
    const session = await getCurrentUser();
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type");
    const search = searchParams.get("search")?.trim() ?? "";

    const isAdmin = session?.role === "admin" || session?.role === "superadmin";

    const where = {
      ...(type === "article" || type === "book" ? { type } : {}),
      ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
      ...(isAdmin
        ? {}
        : session
        ? {
            OR: [
              { is_active: true },
              { author_id: session.id },
            ],
          }
        : { is_active: true }),
    };

    const literatures = await prisma.literatures.findMany({
      where,
      include: {
        literature_categories: true,
        literature_links: true,
        users: {
          select: {
            id: true,
            username: true,
            profiles: {
              select: {
                fullname: true,
                avatar_url: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(serializeBigInt(literatures), { status: 200 });
  } catch (error) {
    console.error("GET LITERATURE ERROR:", error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Gagal mengambil data literasi",
      },
      { status: 500 }
    );
  }
}

/* =========================
POST CREATE
========================= */

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const type = body.type;
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim() || null;
    const content = String(body.content ?? "").trim() || null;
    const categoryId = body.category_id ? BigInt(body.category_id) : null;
    const bookUrl = String(body.book_url ?? "").trim() || null;
    const fileUrl = String(body.file_url ?? "").trim() || null;
    const filePublicId = String(body.file_public_id ?? "").trim() || null;
    const thumbnailUrl = String(body.thumbnail_url ?? "").trim() || null;
    const thumbnailPublicId = String(body.thumbnail_public_id ?? "").trim() || null;

    /* =========================
       VALIDATION
    ========================= */

    if (type !== "article" && type !== "book") {
      return NextResponse.json({ message: "Tipe literasi tidak valid" }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ message: "Judul wajib diisi" }, { status: 400 });
    }

    if (type === "article") {
      if (!categoryId) {
        return NextResponse.json({ message: "Kategori artikel wajib dipilih" }, { status: 400 });
      }

      if (!content) {
        return NextResponse.json({ message: "Isi artikel wajib diisi" }, { status: 400 });
      }
    }

    if (type === "book" && !bookUrl && !fileUrl) {
      return NextResponse.json({ message: "Link atau file buku wajib diisi" }, { status: 400 });
    }

    /* =========================
       SLUG
    ========================= */

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const slug = `${baseSlug}-${crypto.randomUUID().split("-")[0]}`;

    /* =========================
       CREATE
    ========================= */

    const literature = await prisma.literatures.create({
      data: {
        author_id: session.id,
        type,
        category_id: type === "article" ? categoryId : null,
        title,
        slug,
        description,
        content: type === "article" ? content : null,
        file_url: type === "book" ? fileUrl : null,
        file_public_id: type === "book" ? filePublicId : null,
        book_url: type === "book" ? bookUrl : null,
        thumbnail_url: thumbnailUrl,
        thumbnail_public_id: thumbnailPublicId,
        is_active: true,
        literature_links: {
          create: Array.isArray(body.links)
            ? body.links
                .filter(
                  (link: { platform?: string | null; url?: string | null }) =>
                    Boolean(link.platform) && Boolean(String(link.url ?? "").trim())
                )
                .map((link: { platform: string; url: string }) => ({
                  platform: link.platform,
                  url: String(link.url).trim(),
                }))
            : [],
        },
      },
      include: {
        literature_categories: true,
        literature_links: true,
        users: {
          select: {
            id: true,
            username: true,
            profiles: {
              select: {
                fullname: true,
                avatar_url: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(serializeBigInt(literature), { status: 201 });
  } catch (error) {
    console.error("CREATE LITERATURE ERROR:", error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Gagal menambahkan literasi",
      },
      { status: 500 }
    );
  }
}