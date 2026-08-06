// app/api/dashboard/population/master/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

export async function GET() {
  try {
    const data = await prisma.population_categories.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        sort_order: "asc",
      },
      include: {
        population_master_items: {
          where: {
            is_active: true,
          },
          orderBy: {
            sort_order: "asc",
          },
        },
      },
    });

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error("GET POPULATION MASTER ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil master penduduk",
      },
      { status: 500 }
    );
  }
}