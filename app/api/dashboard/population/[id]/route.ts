import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// =========================
// GET DETAIL
// =========================
export async function GET(request: Request, context: RouteParams) {
  try {
    const { id } = await context.params;

    const data = await prisma.village_populations.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        village_population_details: {
          include: {
            population_master_items: {
              include: {
                population_categories: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        { message: "Data penduduk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error("GET DETAIL POPULATION ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil detail penduduk" },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE
// =========================
export async function PUT(request: Request, context: RouteParams) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const { year, total_family_cards, total_male, total_female, details } = body;

    const total_population =
      body.total_male !== undefined || body.total_female !== undefined
        ? Number(body.total_male || 0) + Number(body.total_female || 0)
        : undefined;

    const data = await prisma.$transaction(async (tx) => {
      // 1. Update data utama (header)
      await tx.village_populations.update({
        where: {
          id: BigInt(id),
        },
        data: {
          year: year ? Number(year) : undefined,
          total_family_cards:
            total_family_cards !== undefined
              ? Number(total_family_cards)
              : undefined,
          total_male:
            total_male !== undefined ? Number(total_male) : undefined,
          total_female:
            total_female !== undefined ? Number(total_female) : undefined,
          total_population,
        },
      });

      // 2. Jika payload details ada, hapus detail lama lalu buat ulang (termasuk nilai 0)
      if (details && Array.isArray(details)) {
        await tx.village_population_details.deleteMany({
          where: {
            population_id: BigInt(id), // Sesuaikan dengan foreign key schema Anda (population_id / village_population_id)
          },
        });

        await tx.village_population_details.createMany({
          data: details.map(
            (item: {
              item_id: string;
              total: number;
              sort_order?: number;
            }) => ({
              population_id: BigInt(id),
              item_id: BigInt(item.item_id),
              total: Number(item.total || 0),
              sort_order: Number(item.sort_order || 0),
            })
          ),
        });
      }

      // 3. Ambil kembali data lengkap beserta relasinya untuk response
      return await tx.village_populations.findUnique({
        where: { id: BigInt(id) },
        include: {
          village_population_details: {
            include: {
              population_master_items: {
                include: {
                  population_categories: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error("UPDATE POPULATION ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Gagal update penduduk",
      },
      { status: 500 }
    );
  }
}

// =========================
// DELETE
// =========================
export async function DELETE(request: Request, context: RouteParams) {
  try {
    const { id } = await context.params;

    await prisma.village_populations.delete({
      where: {
        id: BigInt(id),
      },
    });

    return NextResponse.json({
      message: "Data penduduk berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE POPULATION ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Gagal hapus penduduk",
      },
      { status: 500 }
    );
  }
}