// app/api/dashboard/structure/members/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// SERIALIZE BIGINT
function serializeBigInt(data: unknown) {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

// GET DETAIL MEMBER
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = BigInt(id);

    const member = await prisma.village_structures.findUnique({
      where: { id: memberId },
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
    });

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Pejabat struktur tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeBigInt(member),
      message: "Berhasil mengambil detail pejabat",
    });
  } catch (error) {
    console.error("GET MEMBER DETAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Gagal mengambil detail pejabat",
      },
      { status: 500 }
    );
  }
}

// PATCH UPDATE MEMBER
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = BigInt(id);
    const body = await request.json();

    const existing = await prisma.village_structures.findUnique({
      where: { id: memberId },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Pejabat struktur tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const member = await prisma.village_structures.update({
      where: { id: memberId },
      data: {
        ...(body.period_id && { period_id: BigInt(body.period_id) }),
        ...(body.position_id && { position_id: BigInt(body.position_id) }),
        ...(body.full_name !== undefined && { full_name: body.full_name }),
        ...(body.gender !== undefined && { gender: body.gender }),
        ...(body.photo_url !== undefined && { photo_url: body.photo_url }),
        ...(body.photo_public_id !== undefined && {
          photo_public_id: body.photo_public_id,
        }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.is_active !== undefined && { is_active: body.is_active }),
      },
    });

    return NextResponse.json({
      success: true,
      data: serializeBigInt(member),
      message: "Pejabat struktur berhasil diperbarui",
    });
  } catch (error) {
    console.error("UPDATE MEMBER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Gagal memperbarui pejabat struktur",
      },
      { status: 500 }
    );
  }
}

// DELETE MEMBER
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = BigInt(id);

    const existing = await prisma.village_structures.findUnique({
      where: { id: memberId },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Pejabat struktur tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await prisma.village_structures.delete({
      where: { id: memberId },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "Pejabat struktur berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE MEMBER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus pejabat struktur",
      },
      { status: 500 }
    );
  }
}