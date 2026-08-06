// app/api/dashboard/structure/periods/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =========================
// SERIALIZE BIGINT
// =========================
function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

// =========================
// GET ALL PERIODS
// =========================
export async function GET() {
  try {
    const periods = await prisma.village_structure_periods.findMany({
      orderBy: [
        {
          start_year: "desc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: serializeBigInt(periods),
    });
  } catch (error) {
    console.error("GET PERIOD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil periode struktur",
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// CREATE PERIOD
// =========================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const startYear = Number(body.start_year);
    const endYear = Number(body.end_year);

    if (!Number.isInteger(startYear) || !Number.isInteger(endYear)) {
      return NextResponse.json(
        {
          success: false,
          message: "Tahun harus berupa angka.",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    if (startYear >= endYear) {
      return NextResponse.json(
        {
          success: false,
          message: "Tahun akhir harus lebih besar dari tahun awal.",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const exists = await prisma.village_structure_periods.findUnique({
      where: {
        start_year_end_year: {
          start_year: startYear,
          end_year: endYear,
        },
      },
    });

    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Periode sudah tersedia.",
          data: null,
        },
        {
          status: 409,
        }
      );
    }

    const period = await prisma.village_structure_periods.create({
      data: {
        start_year: startYear,
        end_year: endYear,
        is_active: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Periode berhasil ditambahkan.",
        data: serializeBigInt(period),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE PERIOD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat periode.",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}