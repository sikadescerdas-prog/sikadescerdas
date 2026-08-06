// app/api/dashboard/structure/groups/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper untuk menangani pembacaan data jika ada field BigInt
function serializeGroup(group: any) {
  return {
    ...group,
    id: group.id.toString(),
    category_id: group.category_id?.toString(),
    village_structure_categories: group.village_structure_categories
      ? {
          ...group.village_structure_categories,
          id: group.village_structure_categories.id.toString(),
        }
      : null,
  };
}

// =========================
// UPDATE
// =========================
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: { name?: string; category_id?: bigint } = {};

    if (body.name) {
      updateData.name = body.name;
    }

    if (body.category_id) {
      updateData.category_id = BigInt(body.category_id);
    }

    const rawGroup = await prisma.village_structure_groups.update({
      where: {
        id: BigInt(id),
      },
      data: updateData,
    });

    const group = serializeGroup(rawGroup);

    return NextResponse.json({
      group,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal update lembaga",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// DELETE
// =========================
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.village_structure_groups.delete({
      where: {
        id: BigInt(id),
      },
    });

    return NextResponse.json({
      message: "Berhasil menghapus lembaga",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal menghapus lembaga",
      },
      {
        status: 500,
      }
    );
  }
}