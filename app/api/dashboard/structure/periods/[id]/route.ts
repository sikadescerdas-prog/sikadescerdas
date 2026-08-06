// app/api/dashboard/structure/periods/[id]/route.ts

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
// GET DETAIL
// =========================
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const period = await prisma.village_structure_periods.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!period) {
      return NextResponse.json(
        {
          success: false,
          message: "Periode tidak ditemukan",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeBigInt(period),
    });
  } catch (error) {
    console.error("GET PERIOD DETAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil periode",
        data: null,
      },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE (PATCH)
// =========================
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.village_structure_periods.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Periode tidak ditemukan",
          data: null,
        },
        { status: 404 }
      );
    }

    const startYear = Number(body.start_year ?? existing.start_year);
    const endYear = Number(body.end_year ?? existing.end_year);
    const isActive =
      body.is_active !== undefined
        ? Boolean(body.is_active)
        : existing.is_active;

    if (startYear >= endYear) {
      return NextResponse.json(
        {
          success: false,
          message: "Tahun akhir harus lebih besar dari tahun awal",
          data: null,
        },
        { status: 400 }
      );
    }

    const duplicate = await prisma.village_structure_periods.findUnique({
      where: {
        start_year_end_year: {
          start_year: startYear,
          end_year: endYear,
        },
      },
    });

    if (duplicate && duplicate.id !== existing.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Periode sudah tersedia",
          data: null,
        },
        { status: 409 }
      );
    }

    // Jika periode ini di-set aktif, nonaktifkan periode lainnya secara otomatis
    if (isActive) {
      await prisma.village_structure_periods.updateMany({
        where: { id: { not: BigInt(id) } },
        data: { is_active: false },
      });
    }

    const period = await prisma.village_structure_periods.update({
      where: {
        id: BigInt(id),
      },
      data: {
        start_year: startYear,
        end_year: endYear,
        is_active: isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Periode berhasil diperbarui",
      data: serializeBigInt(period),
    });
  } catch (error) {
    console.error("UPDATE PERIOD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengubah periode",
        data: null,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.village_structure_periods.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Periode tidak ditemukan",
          data: null,
        },
        { status: 404 }
      );
    }

    const used = await prisma.village_structures.count({
      where: {
        period_id: BigInt(id),
      },
    });

    if (used > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Periode tidak dapat dihapus karena sudah digunakan.",
          data: null,
        },
        { status: 400 }
      );
    }

    await prisma.village_structure_periods.delete({
      where: {
        id: BigInt(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Periode berhasil dihapus",
      data: null,
    });
  } catch (error) {
    console.error("DELETE PERIOD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus periode",
        data: null,
      },
      { status: 500 }
    );
  }
}