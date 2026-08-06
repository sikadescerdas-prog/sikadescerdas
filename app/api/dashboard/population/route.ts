// app/api/dashboard/population/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

// =========================
// GET ALL POPULATION
// =========================
export async function GET() {
  try {
    const data = await prisma.village_populations.findMany({
      orderBy: {
        year: "desc",
      },
      include: {
        village_population_details: {
          orderBy: {
            sort_order: "asc",
          },
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

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error("GET POPULATION ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data penduduk" },
      { status: 500 }
    );
  }
}

// =========================
// CREATE OR UPDATE POPULATION (UPSERT + DETAILS)
// =========================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      village_id,
      year,
      total_family_cards,
      total_male,
      total_female,
      details,
    } = body;

    if (!village_id || !year) {
      return NextResponse.json(
        { message: "Desa dan tahun wajib diisi" },
        { status: 400 }
      );
    }

    const total_population =
      Number(total_male || 0) + Number(total_female || 0);

    const parsedVillageId = BigInt(village_id);
    const parsedYear = Number(year);

    // Menggunakan Transaction agar data utama dan detail terupdate secara aman
    const result = await prisma.$transaction(async (tx) => {
      // 1. Upsert data utama (village_populations)
      const population = await tx.village_populations.upsert({
        where: {
          village_id_year: {
            village_id: parsedVillageId,
            year: parsedYear,
          },
        },
        update: {
          total_family_cards: Number(total_family_cards || 0),
          total_male: Number(total_male || 0),
          total_female: Number(total_female || 0),
          total_population,
          updated_at: new Date(),
        },
        create: {
          village_id: parsedVillageId,
          year: parsedYear,
          total_family_cards: Number(total_family_cards || 0),
          total_male: Number(total_male || 0),
          total_female: Number(total_female || 0),
          total_population,
        },
      });

      // 2. Jika ada data details, perbarui detail item penduduk
      if (details && Array.isArray(details)) {
        for (const item of details) {
          const itemId = BigInt(item.item_id);
          const itemTotal = Number(item.total || 0);
          const itemSortOrder = Number(item.sort_order || 0);

          await tx.village_population_details.upsert({
            where: {
              population_id_item_id: {
                population_id: population.id,
                item_id: itemId,
              },
            },
            update: {
              total: itemTotal,
              sort_order: itemSortOrder,
              updated_at: new Date(),
            },
            create: {
              population_id: population.id,
              item_id: itemId,
              total: itemTotal,
              sort_order: itemSortOrder,
            },
          });
        }
      }

      // 3. Ambil data akhir beserta detailnya untuk dikembalikan ke frontend
      return await tx.village_populations.findUnique({
        where: { id: population.id },
        include: {
          village_population_details: true,
        },
      });
    });

    return NextResponse.json(serializeBigInt(result), { status: 200 });
  } catch (error) {
    console.error("SAVE POPULATION ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan data penduduk",
      },
      { status: 500 }
    );
  }
}