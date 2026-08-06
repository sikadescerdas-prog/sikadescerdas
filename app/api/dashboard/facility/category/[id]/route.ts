// app/api/dashboard/facility/category/[id]/route.ts

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

    const data = await prisma.village_facility_categories.findUnique({
      where: { id: BigInt(id) },
      include: {
        village_facility_types: {
          orderBy: { name: "asc" },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        { message: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil kategori" },
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

    const data = await prisma.village_facility_categories.update({
      where: { id: BigInt(id) },
      data: { name: body.name },
    });

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal update kategori" },
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

    await prisma.village_facility_categories.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}