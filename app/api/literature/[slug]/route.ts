// app/api/literature/[slug]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

async function getLiterature(slug: string) {
  return prisma.literatures.findFirst({
    where: { slug },
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
}

/* =========================
GET BY SLUG - PUBLIC
========================= */

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;

    if (!slug?.trim()) {
      return NextResponse.json({ message: "Slug literasi tidak valid" }, { status: 400 });
    }

    const literature = await getLiterature(slug);

    if (!literature) {
      return NextResponse.json({ message: "Literasi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(serializeBigInt(literature), { status: 200 });
  } catch (error) {
    console.error("GET LITERATURE BY SLUG ERROR:", error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Gagal mengambil detail literasi",
      },
      { status: 500 }
    );
  }
}

/* =========================
PUT BY SLUG
========================= */

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;

    if (!slug?.trim()) {
      return NextResponse.json({ message: "Slug literasi tidak valid" }, { status: 400 });
    }

    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.literatures.findFirst({
      where: { slug },
    });

    if (!existing) {
      return NextResponse.json({ message: "Literasi tidak ditemukan" }, { status: 404 });
    }

    const isAdmin = session.role === "admin" || session.role === "superadmin";
    const isMine = existing.author_id === session.id;

    if (!isAdmin && !isMine) {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses untuk mengubah literasi ini." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const type = body.type !== undefined ? String(body.type) : existing.type;

    if (type !== "article" && type !== "book") {
      return NextResponse.json({ message: "Tipe literasi tidak valid" }, { status: 400 });
    }

    const title = body.title !== undefined ? String(body.title).trim() : existing.title;

    if (!title) {
      return NextResponse.json({ message: "Judul wajib diisi" }, { status: 400 });
    }

    let categoryId = existing.category_id;

    if (body.category_id !== undefined) {
      categoryId = body.category_id ? BigInt(body.category_id) : null;
    }

    let content = existing.content;

    if (body.content !== undefined) {
      content = String(body.content ?? "").trim() || null;
    }

    if (type === "article") {
      if (!categoryId) {
        return NextResponse.json({ message: "Kategori artikel wajib dipilih" }, { status: 400 });
      }

      if (!content) {
        return NextResponse.json({ message: "Isi artikel wajib diisi" }, { status: 400 });
      }
    } else {
      categoryId = null;
      content = null;
    }

    const data: Record<string, unknown> = {
      type,
      title,
      category_id: categoryId,
      content,
    };

    if (body.description !== undefined) {
      data.description = String(body.description ?? "").trim() || null;
    }

    if (body.file_url !== undefined) {
      data.file_url = type === "book" ? String(body.file_url ?? "").trim() || null : null;
    }

    if (body.file_public_id !== undefined) {
      data.file_public_id = type === "book" ? String(body.file_public_id ?? "").trim() || null : null;
    }

    if (body.book_url !== undefined) {
      data.book_url = type === "book" ? String(body.book_url ?? "").trim() || null : null;
    }

    if (body.thumbnail_url !== undefined) {
      data.thumbnail_url = String(body.thumbnail_url ?? "").trim() || null;
    }

    if (body.thumbnail_public_id !== undefined) {
      data.thumbnail_public_id = String(body.thumbnail_public_id ?? "").trim() || null;
    }

    if (body.is_active !== undefined) {
      data.is_active = Boolean(body.is_active);
    }

    await prisma.literatures.update({
      where: { id: existing.id },
      data,
    });

    if (body.links !== undefined) {
      await prisma.literature_links.deleteMany({
        where: { literature_id: existing.id },
      });

      if (Array.isArray(body.links)) {
        const links = body.links
          .filter(
            (link: { platform?: string | null; url?: string | null }) =>
              Boolean(link.platform) && Boolean(String(link.url ?? "").trim())
          )
          .map((link: { platform: string; url: string }) => ({
            literature_id: existing.id,
            platform: link.platform,
            url: String(link.url).trim(),
          }));

        if (links.length > 0) {
          await prisma.literature_links.createMany({
            data: links,
          });
        }
      }
    }

    const literature = await getLiterature(slug);

    return NextResponse.json(serializeBigInt(literature), { status: 200 });
  } catch (error) {
    console.error("UPDATE LITERATURE ERROR:", error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Gagal memperbarui literasi",
      },
      { status: 500 }
    );
  }
}

/* =========================
DELETE BY SLUG
========================= */

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;

    if (!slug?.trim()) {
      return NextResponse.json({ message: "Slug literasi tidak valid" }, { status: 400 });
    }

    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const literature = await prisma.literatures.findFirst({
      where: { slug },
    });

    if (!literature) {
      return NextResponse.json({ message: "Literasi tidak ditemukan" }, { status: 404 });
    }

    const isAdmin = session.role === "admin" || session.role === "superadmin";
    const isMine = literature.author_id === session.id;

    if (!isAdmin && !isMine) {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses untuk menghapus literasi ini." },
        { status: 403 }
      );
    }

    await prisma.literatures.delete({
      where: { id: literature.id },
    });

    return NextResponse.json({ message: "Literasi berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("DELETE LITERATURE ERROR:", error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Gagal menghapus literasi",
      },
      { status: 500 }
    );
  }
}