// app/api/dashboard/structure/members/route.ts

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
// GET MEMBERS
// =========================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const period_id = searchParams.get("period_id");
    const position_id = searchParams.get("position_id");

    const members = await prisma.village_structures.findMany({
      where: {
        ...(period_id && {
          period_id: BigInt(period_id),
        }),
        ...(position_id && {
          position_id: BigInt(position_id),
        }),
        is_active: true,
      },
      include: {
        village_structure_periods: {
          select: {
            id: true,
            start_year: true,
            end_year: true,
          },
        },
        village_structure_positions: {
          select: {
            id: true,
            name: true,
            village_structure_categories: {
              select: {
                id: true,
                name: true,
                type: true,
                level: true,
              },
            },
            village_structure_groups: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });

    const result = members.map((item) => ({
      id: item.id,
      village_id: item.village_id,
      period_id: item.period_id,
      position_id: item.position_id,
      full_name: item.full_name,
      gender: item.gender,
      photo_url: item.photo_url,
      photo_public_id: item.photo_public_id,
      phone: item.phone,
      email: item.email,
      address: item.address,
      is_active: item.is_active,
      created_at: item.created_at,
      updated_at: item.updated_at,
      period: {
        id: item.village_structure_periods.id,
        start_year: item.village_structure_periods.start_year,
        end_year: item.village_structure_periods.end_year,
      },
      position: {
        id: item.village_structure_positions.id,
        name: item.village_structure_positions.name,
        category: {
          id: item.village_structure_positions.village_structure_categories.id,
          name: item.village_structure_positions.village_structure_categories.name,
          type: item.village_structure_positions.village_structure_categories.type,
          level: item.village_structure_positions.village_structure_categories.level,
        },
        group: item.village_structure_positions.village_structure_groups
          ? {
              id: item.village_structure_positions.village_structure_groups.id,
              name: item.village_structure_positions.village_structure_groups.name,
            }
          : null,
      },
    }));

    return NextResponse.json({
      success: true,
      data: serializeBigInt(result),
      message: "Berhasil mengambil data pejabat struktur",
    });
  } catch (error) {
    console.error("GET MEMBERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Gagal mengambil pejabat struktur",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// CREATE MEMBER
// =========================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      period_id,
      position_id,
      full_name,
      gender,
      photo_url,
      photo_public_id,
      phone,
      email,
      address,
    } = body;

    if (!period_id || !position_id || !full_name) {
      return NextResponse.json(
        {
          success: false,
          message: "Periode, jabatan dan nama wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

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

    const position = await prisma.village_structure_positions.findUnique({
      where: {
        id: BigInt(position_id),
      },
    });

    if (position && !position.is_multiple) {
      const exists = await prisma.village_structures.findFirst({
        where: {
          period_id: BigInt(period_id),
          position_id: BigInt(position_id),
          is_active: true,
        },
      });

      if (exists) {
        return NextResponse.json(
          {
            success: false,
            message: "Jabatan ini sudah memiliki pejabat",
          },
          {
            status: 400,
          }
        );
      }
    }

    const member = await prisma.village_structures.create({
      data: {
        village_id: village.id,
        period_id: BigInt(period_id),
        position_id: BigInt(position_id),
        full_name,
        gender,
        photo_url,
        photo_public_id,
        phone,
        email,
        address,
      },
    });

    return NextResponse.json({
      success: true,
      data: serializeBigInt(member),
      message: "Pejabat struktur berhasil ditambahkan",
    });
  } catch (error) {
    console.error("CREATE MEMBER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan pejabat struktur",
      },
      {
        status: 500,
      }
    );
  }
}