// app/api/dashboard/potential/category/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// =========================
// UPDATE CATEGORY
// =========================

export async function PUT(
  request: Request,
  { params }: Props
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { message: "Nama kategori wajib diisi" },
        { status: 400 }
      );
    }

    const exists = await prisma.village_potential_categories.findFirst({
      where: {
        name: body.name,
        NOT: {
          id: BigInt(id),
        },
      },
    });

    if (exists) {
      return NextResponse.json(
        { message: "Kategori sudah ada" },
        { status: 400 }
      );
    }

    const data = await prisma.village_potential_categories.update({
      where: {
        id: BigInt(id),
      },
      data: {
        name: body.name,
        description: body.description ?? null,
      },
    });

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal memperbarui kategori potensi" },
      { status: 500 }
    );
  }
}

// =========================
// DELETE CATEGORY
// =========================

export async function DELETE(
  request: Request,
  { params }: Props
) {
  try {
    const { id } = await params;

    await prisma.village_potential_categories.delete({
      where: {
        id: BigInt(id),
      },
    });

    return NextResponse.json({
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal menghapus kategori potensi" },
      { status: 500 }
    );
  }
}