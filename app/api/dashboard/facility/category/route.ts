// app/api/dashboard/facility/category/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

// =========================
// GET ALL CATEGORY
// =========================

export async function GET() {
  try {
    const data = await prisma.village_facility_categories.findMany({
      where: { is_active: true },
      include: {
        village_facility_types: {
          where: { is_active: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil kategori fasilitas" },
      { status: 500 }
    );
  }
}

// =========================
// CREATE CATEGORY
// =========================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { message: "Nama kategori wajib diisi" },
        { status: 400 }
      );
    }

    const exists = await prisma.village_facility_categories.findUnique({
      where: { name: body.name },
    });

    if (exists) {
      return NextResponse.json(
        { message: "Kategori sudah ada" },
        { status: 400 }
      );
    }

    const data = await prisma.village_facility_categories.create({
      data: { name: body.name },
    });

    return NextResponse.json(serializeBigInt(data), { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal menambah kategori" },
      { status: 500 }
    );
  }
}