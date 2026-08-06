// app/api/dashboard/village/route.ts

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
// CREATE DEFAULT VILLAGE
// =========================
async function createDefaultVillage() {
  return prisma.villages.create({
    data: {
      name: "Desa",
    },
  });
}

// =========================
// GET PROFILE DESA
// =========================
export async function GET() {
  try {
    let village = await prisma.villages.findFirst();

    if (!village) {
      village = await createDefaultVillage();
    }

    const data = {
      id: village.id.toString(),

      name: village.name,

      history: village.history,
      vision: village.vision,
      mission: village.mission,

      welcomeMessage: village.welcome_message,

      logoUrl: village.logo_url,
      logoPublicId: village.logo_public_id,

      email: village.email,
      phone: village.phone,
      website: village.website,

      totalHamlets: village.total_hamlets,
      totalRw: village.total_rw,
      totalRt: village.total_rt,

      facebook: village.facebook,
      instagram: village.instagram,
      tiktok: village.tiktok,
      youtube: village.youtube,

      address: village.address,

      rt: village.rt,
      rw: village.rw,

      province: village.province,
      regency: village.regency,
      district: village.district,
      village: village.village,

      postalCode: village.postal_code,

      areaSize: village.area_size
        ? Number(village.area_size)
        : null,

      foundedYear: village.founded_year,

      mapEmbed: village.map_embed,

      northBoundary: village.north_boundary,
      southBoundary: village.south_boundary,
      eastBoundary: village.east_boundary,
      westBoundary: village.west_boundary,

      createdAt: village.created_at,
      updatedAt: village.updated_at,
    };

    return NextResponse.json({
      success: true,
      data: serializeBigInt(data),
    });
  } catch (error) {
    console.error("GET VILLAGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil profil desa",
      },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE PROFILE DESA
// =========================
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const village = await prisma.villages.findFirst();

    if (!village) {
      return NextResponse.json(
        {
          success: false,
          message: "Data desa belum tersedia",
        },
        { status: 404 }
      );
    }

    const updated = await prisma.villages.update({
      where: {
        id: village.id,
      },
      data: {
        // IDENTITAS
        name: body.name ?? null,
        history: body.history ?? null,
        vision: body.vision ?? null,
        mission: body.mission ?? null,
        welcome_message:
          body.welcomeMessage ?? null,

        total_hamlets: body.totalHamlets ?? null,
        total_rw: body.totalRw ?? null,
        total_rt: body.totalRt ?? null,

        // LOGO
        logo_url:
          body.logoUrl ?? null,

        logo_public_id:
          body.logoPublicId ?? null,

        // KONTAK
        email:
          body.email ?? null,

        phone:
          body.phone ?? null,

        website:
          body.website ?? null,

        // SOCIAL MEDIA
        facebook:
          body.facebook ?? null,

        instagram:
          body.instagram ?? null,

        tiktok:
          body.tiktok ?? null,

        youtube:
          body.youtube ?? null,

        // ALAMAT
        address:
          body.address ?? null,

        rt:
          body.rt ?? null,

        rw:
          body.rw ?? null,

        province:
          body.province ?? null,

        regency:
          body.regency ?? null,

        district:
          body.district ?? null,

        village:
          body.village ?? null,

        postal_code:
          body.postalCode ?? null,

        // INFO DESA
        area_size:
          body.areaSize ?? null,

        founded_year:
          body.foundedYear ?? null,

        // MAP
        map_embed:
          body.mapEmbed ?? null,

        // BATAS WILAYAH
        north_boundary:
          body.northBoundary ?? null,

        south_boundary:
          body.southBoundary ?? null,

        east_boundary:
          body.eastBoundary ?? null,

        west_boundary:
          body.westBoundary ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profil desa berhasil diperbarui",
      data: serializeBigInt(updated),
    });

  } catch (error) {
    console.error("UPDATE VILLAGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui profil desa",
      },
      { status: 500 }
    );
  }
}