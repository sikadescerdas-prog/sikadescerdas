// app/api/dashboard/structure/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

// =====================================================
// GET STRUCTURE
// =====================================================

export async function GET() {
  try {
    const village = await prisma.villages.findFirst();

    if (!village) {
      return NextResponse.json(
        {
          success: false,
          message: "Data desa belum tersedia",
        },
        {
          status: 404,
        }
      );
    }

    const [categories, groups, positions, periods, members] = await Promise.all([
      prisma.village_structure_categories.findMany({
        where: {
          is_active: true,
        },
        orderBy: {
          level: "asc",
        },
      }),

      prisma.village_structure_groups.findMany({
        where: {
          is_active: true,
        },
        include: {
          village_structure_categories: true,
        },
        orderBy: {
          id: "asc",
        },
      }),

      prisma.village_structure_positions.findMany({
        where: {
          is_active: true,
        },
        include: {
          village_structure_categories: true,
          village_structure_groups: true,
          village_structure_positions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      }),

      prisma.village_structure_periods.findMany({
        where: {
          is_active: true,
        },
        orderBy: {
          start_year: "desc",
        },
      }),

      prisma.village_structures.findMany({
        where: {
          village_id: village.id,
          is_active: true,
        },
        include: {
          village_structure_positions: {
            include: {
              village_structure_categories: true,
              village_structure_groups: true,
            },
          },
          village_structure_periods: true,
        },
        orderBy: {
          id: "asc",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: serializeBigInt({
        village: {
          id: village.id,
          name: village.name,
        },
        categories,
        groups,
        positions,
        periods,
        members,
      }),
    });
  } catch (error) {
    console.error("STRUCTURE GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil struktur desa",
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}