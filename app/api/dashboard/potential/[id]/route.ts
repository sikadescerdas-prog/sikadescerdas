// app/api/dashboard/potential/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// =========================
// GET DETAIL
// =========================

export async function GET(
  request: Request,
  context: RouteParams
) {
  try {
    const { id } = await context.params;

    const data = await prisma.village_potentials.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        village_potential_categories: true,
        villages: true,
      },
    });

    if (!data) {
      return NextResponse.json(
        { message: "Potensi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error("GET POTENTIAL DETAIL ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil detail potensi" },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE
// =========================

export async function PUT(
  request: Request,
  context: RouteParams
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const data = await prisma.village_potentials.update({
      where: {
        id: BigInt(id),
      },
      data: {
        ...(body.village_id && {
          village_id: BigInt(body.village_id),
        }),
        ...(body.category_id && {
          category_id: BigInt(body.category_id),
        }),
        ...(body.name !== undefined && {
          name: body.name,
        }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.image_url !== undefined && {
          image_url: body.image_url,
        }),
        ...(body.image_public_id !== undefined && {
          image_public_id: body.image_public_id,
        }),
        ...(body.address !== undefined && {
          address: body.address,
        }),
        ...(body.link_maps !== undefined && {
          link_maps: body.link_maps,
        }),
        ...(body.website !== undefined && {
          website: body.website,
        }),
        ...(body.is_active !== undefined && {
          is_active: body.is_active,
        }),
      },
      include: {
        village_potential_categories: true,
        villages: true,
      },
    });

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error("UPDATE POTENTIAL ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal update potensi",
      },
      { status: 500 }
    );
  }
}

// =========================
// DELETE
// =========================

export async function DELETE(
  request: Request,
  context: RouteParams
) {
  try {
    const { id } = await context.params;

    await prisma.village_potentials.delete({
      where: {
        id: BigInt(id),
      },
    });

    return NextResponse.json({
      message: "Potensi berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE POTENTIAL ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal hapus potensi",
      },
      { status: 500 }
    );
  }
}