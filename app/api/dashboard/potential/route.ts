// app/api/dashboard/potential/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

// =========================
// GET ALL POTENTIALS
// =========================

export async function GET() {
  try {
    const data = await prisma.village_potentials.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        village_potential_categories: true,
        villages: true,
      },
    });

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error("GET POTENTIAL ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data potensi",
      },
      { status: 500 }
    );
  }
}

// =========================
// CREATE POTENTIAL
// =========================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      village_id,
      category_id,
      name,
      description,
      image_url,
      image_public_id,
      address,
      link_maps,
      website,
    } = body;

    if (!village_id || !category_id || !name) {
      return NextResponse.json(
        { message: "Desa, kategori, dan nama wajib diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.village_potentials.create({
      data: {
        village_id: BigInt(village_id),
        category_id: BigInt(category_id),
        name,
        description,
        image_url,
        image_public_id,
        address,
        link_maps,
        website,
      },
      include: {
        village_potential_categories: true,
        villages: true,
      },
    });

    return NextResponse.json(serializeBigInt(data), { status: 201 });
  } catch (error) {
    console.error("CREATE POTENTIAL ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal membuat potensi",
      },
      { status: 500 }
    );
  }
}