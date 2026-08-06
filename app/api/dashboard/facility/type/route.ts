// app/api/dashboard/facility/type/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

// =========================
// GET ALL TYPE
// =========================

export async function GET() {
  try {
    const data = await prisma.village_facility_types.findMany({
      where: { is_active: true },
      include: {
        village_facility_categories: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil jenis fasilitas" },
      { status: 500 }
    );
  }
}

// =========================
// CREATE TYPE
// =========================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();

    if (!body.category_id || !name) {
      return NextResponse.json(
        { message: "Kategori dan nama jenis wajib diisi" },
        { status: 400 }
      );
    }

    const exists = await prisma.village_facility_types.findFirst({
      where: {
        category_id: BigInt(body.category_id),
        name,
      },
    });

    if (exists) {
      return NextResponse.json(
        { message: "Jenis fasilitas sudah ada" },
        { status: 400 }
      );
    }

    const data = await prisma.village_facility_types.create({
      data: {
        category_id: BigInt(body.category_id),
        name,
      },
    });

    return NextResponse.json(serializeBigInt(data), { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal menambah jenis fasilitas" },
      { status: 500 }
    );
  }
}