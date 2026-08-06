// app/api/store/[slug]/toggle/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        {
          code: "UNAUTHORIZED",
          message: "Silakan login terlebih dahulu.",
        },
        { status: 401 }
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          code: "SLUG_REQUIRED",
          message: "Slug toko tidak tersedia.",
        },
        { status: 400 }
      );
    }

    const store = await prisma.stores.findUnique({
      where: { slug },
      select: {
        id: true,
        owner_id: true,
        name: true,
        slug: true,
        is_active: true,
        is_store_complete: true,
        is_verified: true,
      },
    });

    if (!store) {
      return NextResponse.json(
        {
          code: "STORE_NOT_FOUND",
          message: "Toko tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    if (store.owner_id !== session.id) {
      return NextResponse.json(
        {
          code: "FORBIDDEN",
          message: "Anda bukan pemilik toko ini.",
        },
        { status: 403 }
      );
    }

    const newStatus = !store.is_active;

    const updatedStore = await prisma.stores.update({
      where: { id: store.id },
      data: { is_active: newStatus },
      select: {
        id: true,
        owner_id: true,
        name: true,
        slug: true,
        is_active: true,
        is_store_complete: true,
        is_verified: true,
      },
    });

    return NextResponse.json({
      code: "STORE_STATUS_UPDATED",
      message: updatedStore.is_active
        ? "Toko berhasil dibuka."
        : "Toko berhasil ditutup.",
      store: {
        id: updatedStore.id.toString(),
        owner_id: updatedStore.owner_id,
        name: updatedStore.name,
        slug: updatedStore.slug,
        is_active: updatedStore.is_active,
        isActive: updatedStore.is_active,
        is_store_complete: updatedStore.is_store_complete,
        is_verified: updatedStore.is_verified,
      },
    });
  } catch (error) {
    console.error("[STORE_TOGGLE_ERROR]:", error);

    return NextResponse.json(
      {
        code: "STORE_TOGGLE_ERROR",
        message: "Gagal mengubah status toko.",
      },
      { status: 500 }
    );
  }
}