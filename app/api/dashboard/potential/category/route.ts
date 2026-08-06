// app/api/dashboard/potential/category/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

// =========================
// GET ALL CATEGORY
// =========================

export async function GET() {
  try {
    const data = await prisma.village_potential_categories.findMany({
      where: {
        is_active: true,
      },
      include: {
        village_potentials: {
          where: {
            is_active: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal mengambil kategori potensi" },
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

    const exists = await prisma.village_potential_categories.findUnique({
      where: {
        name: body.name,
      },
    });

    if (exists) {
      return NextResponse.json(
        { message: "Kategori sudah ada" },
        { status: 400 }
      );
    }

    const data = await prisma.village_potential_categories.create({
      data: {
        name: body.name,
        description: body.description ?? null,
      },
    });

    return NextResponse.json(serializeBigInt(data), { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal menambah kategori potensi" },
      { status: 500 }
    );
  }
}