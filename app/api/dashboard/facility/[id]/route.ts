// app/api/dashboard/facility/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

type RouteParams = { params: Promise<{ id: string }> };

// =========================
// GET DETAIL
// =========================

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const data = await prisma.village_facilities.findUnique({
      where: { id: BigInt(id) },
      include: {
        villages: {
          select: {
            id: true,
            name: true,
          },
        },
        village_facility_types: {
          include: {
            village_facility_categories: true,
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        { message: "Fasilitas tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil detail fasilitas" },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE
// =========================

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data = await prisma.village_facilities.update({
      where: { id: BigInt(id) },
      data: {
        type_id: body.type_id ? BigInt(body.type_id) : undefined,
        name: body.name,
        image_url: body.image_url ?? null,
        image_public_id: body.image_public_id ?? null,
        address: body.address ?? null,
        link_maps: body.link_maps ?? null,
        is_active: body.is_active ?? true,
      },
    });

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal memperbarui fasilitas" },
      { status: 500 }
    );
  }
}

// =========================
// DELETE
// =========================

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.village_facilities.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({
      message: "Fasilitas berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal menghapus fasilitas" },
      { status: 500 }
    );
  }
}