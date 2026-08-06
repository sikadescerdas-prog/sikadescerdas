// app/api/store/create/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        username: true,
        role: true,
        profiles: { select: { is_completed: true } },
        stores: {
          select: {
            id: true,
            owner_id: true,
            name: true,
            slug: true,
            is_store_complete: true,
            is_active: true,
            is_verified: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { code: "USER_NOT_FOUND", message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    if (user.role === "admin" || user.role === "superadmin") {
      return NextResponse.json(
        { code: "ADMIN_CANNOT_CREATE_STORE", message: "Admin tidak dapat membuka toko." },
        { status: 403 }
      );
    }

    if (!user.username) {
      return NextResponse.json(
        { code: "USERNAME_REQUIRED", message: "Username belum tersedia." },
        { status: 400 }
      );
    }

    if (!user.profiles?.is_completed) {
      return NextResponse.json(
        { code: "PROFILE_NOT_COMPLETED", message: "Mohon lengkapi profile terlebih dahulu." },
        { status: 400 }
      );
    }

    if (user.stores) {
      return NextResponse.json(
        {
          code: "STORE_ALREADY_EXISTS",
          message: "Anda sudah memiliki toko.",
          store: {
            ...user.stores,
            id: user.stores.id.toString(),
          },
        },
        { status: 409 }
      );
    }

    let body: { name?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { code: "INVALID_BODY", message: "Data request tidak valid." },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";

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

    const slug = user.username;

    const store = await prisma.$transaction(async (tx) => {
      const createdStore = await tx.stores.create({
        data: {
          owner_id: user.id,
          name,
          slug,
          description: null,
          logo_url: null,
          logo_public_id: null,
          banner_url: null,
          banner_public_id: null,
          phone: null,
          email: null,
          province: null,
          regency: null,
          district: null,
          village: null,
          address: null,
          latitude: null,
          longitude: null,
          is_store_complete: false,
          is_active: false,
          is_verified: true,
        },
      });

      await tx.users.update({
        where: { id: user.id },
        data: { role: "seller" },
      });

      return createdStore;
    });

    return NextResponse.json(
      {
        code: "STORE_CREATED",
        message: "Toko berhasil dibuat.",
        store: {
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
          marketplaces: [],
          is_store_complete: store.is_store_complete,
          is_active: store.is_active,
          is_verified: store.is_verified,
          created_at: store.created_at.toISOString(),
          updated_at: store.updated_at.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[STORE_CREATE_ERROR]:", error);

    return NextResponse.json(
      { code: "STORE_CREATE_ERROR", message: "Gagal membuat toko." },
      { status: 500 }
    );
  }
}