// app/api/dashboard/structure/positions/[id]/route.ts

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
// UPDATE POSITION
// =========================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      category_id,
      group_id,
      parent_id,
      name,
      is_multiple,
    } = body;

    if (!category_id || !name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori dan nama jabatan wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    const positionId = BigInt(id);

    const existing = await prisma.village_structure_positions.findUnique({
      where: {
        id: positionId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Jabatan tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    const duplicate = await prisma.village_structure_positions.findFirst({
      where: {
        category_id: BigInt(category_id),
        group_id: group_id ? BigInt(group_id) : null,
        name: name.trim(),
        NOT: {
          id: positionId,
        },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          message: "Jabatan sudah tersedia",
        },
        {
          status: 409,
        }
      );
    }

    const updated = await prisma.village_structure_positions.update({
      where: {
        id: positionId,
      },
      data: {
        category_id: BigInt(category_id),
        group_id: group_id ? BigInt(group_id) : null,
        parent_id: parent_id ? BigInt(parent_id) : null,
        name: name.trim(),
        is_multiple: Boolean(is_multiple),
      },
      include: {
        village_structure_categories: true,
        village_structure_groups: true,
        village_structure_positions: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Jabatan berhasil diperbarui",
      data: serializeBigInt(updated),
    });
  } catch (error) {
    console.error("UPDATE POSITION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengubah jabatan",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// DELETE POSITION
// =========================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const positionId = BigInt(id);

    const existing = await prisma.village_structure_positions.findUnique({
      where: {
        id: positionId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Jabatan tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    const used = await prisma.village_structures.count({
      where: {
        position_id: positionId,
      },
    });

    if (used > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Jabatan tidak dapat dihapus karena sudah digunakan anggota struktur",
        },
        {
          status: 400,
        }
      );
    }

    const child = await prisma.village_structure_positions.count({
      where: {
        parent_id: positionId,
      },
    });

    if (child > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Hapus jabatan turunan terlebih dahulu",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.village_structure_positions.delete({
      where: {
        id: positionId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Jabatan berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE POSITION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus jabatan",
      },
      {
        status: 500,
      }
    );
  }
}