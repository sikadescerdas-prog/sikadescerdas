// app/api/dashboard/facility/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

// =========================
// GET ALL FACILITY
// =========================

export async function GET() {
  try {
    const data = await prisma.village_facilities.findMany({
      where: { is_active: true },
      include: {
        village_facility_types: {
          include: {
            village_facility_categories: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(serializeBigInt(data));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil fasilitas" },
      { status: 500 }
    );
  }
}

// =========================
// CREATE FACILITY
// =========================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      village_id,
      type_id,
      name,
      image_url,
      image_public_id,
      address,
      link_maps,
    } = body;

    if (!village_id || !type_id || !name) {
      return NextResponse.json(
        { message: "Desa, jenis, dan nama fasilitas wajib diisi" },
        { status: 400 }
      );
    }

    const data = await prisma.village_facilities.create({
      data: {
        village_id: BigInt(village_id),
        type_id: BigInt(type_id),
        name,
        image_url: image_url ?? null,
        image_public_id: image_public_id ?? null,
        address: address ?? null,
        link_maps: link_maps ?? null,
      },
    });

    return NextResponse.json(serializeBigInt(data), { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal menambah fasilitas" },
      { status: 500 }
    );
  }
}