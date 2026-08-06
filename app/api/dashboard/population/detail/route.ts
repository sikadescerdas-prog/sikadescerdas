// app/api/dashboard/population/detail/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

// =========================
// GET DETAIL BY POPULATION
// =========================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const population_id = searchParams.get("population_id");

    if (!population_id) {
      return NextResponse.json(
        { message: "Population id wajib diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.village_population_details.findMany({
      where: {
        population_id: BigInt(population_id),
      },
      orderBy: {
        sort_order: "asc",
      },
      include: {
        population_master_items: {
          include: {
            population_categories: true,
          },
        },
      },
    });

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error("GET POPULATION DETAIL ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil detail penduduk" },
      { status: 500 }
    );
  }
}

// =========================
// SAVE DETAIL
// =========================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { population_id, details } = body;

    if (!population_id) {
      return NextResponse.json(
        { message: "Population wajib diisi" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.village_population_details.deleteMany({
        where: {
          population_id: BigInt(population_id),
        },
      }),

      prisma.village_population_details.createMany({
        data:
          details?.map(
            (item: {
              item_id: string;
              total: number;
              sort_order?: number;
            }) => ({
              population_id: BigInt(population_id),
              item_id: BigInt(item.item_id),
              total: Number(item.total || 0),
              sort_order: Number(item.sort_order || 0),
            })
          ) || [],
      }),
    ]);

    const data = await prisma.village_population_details.findMany({
      where: {
        population_id: BigInt(population_id),
      },
      include: {
        population_master_items: true,
      },
    });

    return NextResponse.json(serializeBigInt(data), { status: 201 });
  } catch (error) {
    console.error("SAVE POPULATION DETAIL ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal simpan detail",
      },
      { status: 500 }
    );
  }
}