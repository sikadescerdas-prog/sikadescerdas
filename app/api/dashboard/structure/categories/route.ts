// app/api/dashboard/structure/categories/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET() {
  try {
    const categories = await prisma.village_structure_categories.findMany({
      where: {
        is_active: true,
      },
      orderBy: [
        {
          level: {
            sort: "asc",
            nulls: "last",
          },
        },
        {
          name: "asc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: serializeBigInt(categories),
    });
  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil kategori struktur",
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}