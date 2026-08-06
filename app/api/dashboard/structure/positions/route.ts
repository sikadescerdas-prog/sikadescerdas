// app/api/dashboard/structure/positions/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

// =========================
// GET ALL POSITIONS
// =========================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const categoryId = searchParams.get("category_id");
    const groupId = searchParams.get("group_id");

    const positions = await prisma.village_structure_positions.findMany({
      where: {
        ...(categoryId && {
          category_id: BigInt(categoryId),
        }),
        ...(groupId && {
          group_id: BigInt(groupId),
        }),
      },
      include: {
        village_structure_categories: true,
        village_structure_groups: true,
        village_structure_positions: true,
        other_village_structure_positions: true,
      },
      orderBy: [
        {
          category_id: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    const formatted = positions.map((item) => ({
      ...item,
      category: item.village_structure_categories,
      group: item.village_structure_groups,
      parent: item.village_structure_positions,
      children: item.other_village_structure_positions,
    }));

    return NextResponse.json({
      success: true,
      data: serializeBigInt(formatted),
    });
  } catch (error) {
    console.error("GET POSITION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil jabatan struktur",
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// CREATE POSITION
// =========================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const categoryId = body.category_id ? BigInt(body.category_id) : null;
    const groupId = body.group_id ? BigInt(body.group_id) : null;
    const parentId = body.parent_id ? BigInt(body.parent_id) : null;
    const name = String(body.name ?? "").trim();
    const isMultiple = Boolean(body.is_multiple);

    if (!categoryId || !name) {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori dan nama jabatan wajib diisi",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const position = await prisma.village_structure_positions.create({
      data: {
        category_id: categoryId,
        group_id: groupId,
        parent_id: parentId,
        name,
        is_multiple: isMultiple,
      },
      include: {
        village_structure_categories: true,
        village_structure_groups: true,
        village_structure_positions: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Jabatan berhasil ditambahkan",
        data: serializeBigInt(position),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE POSITION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat jabatan",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}