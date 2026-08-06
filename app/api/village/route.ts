// app/api/village/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const village = await prisma.villages.findFirst({
      include: {
        village_populations: {
          where: { is_active: true },
          orderBy: { year: "desc" },
          take: 1,
          include: {
            village_population_details: {
              orderBy: { sort_order: "asc" },
              include: {
                population_master_items: {
                  include: {
                    population_categories: true,
                  },
                },
              },
            },
          },
        },
        village_structures: {
          where: { is_active: true },
          orderBy: { created_at: "asc" },
          include: {
            village_structure_positions: {
              include: {
                village_structure_categories: true,
                village_structure_groups: true,
              },
            },
            village_structure_periods: true,
          },
        },
        village_facilities: {
          where: { is_active: true },
          orderBy: { name: "asc" },
          include: {
            village_facility_types: {
              include: {
                village_facility_categories: true,
              },
            },
          },
        },
        village_potentials: {
          where: { is_active: true },
          orderBy: { name: "asc" },
          include: {
            village_potential_categories: true,
          },
        },
        news: {
          where: { is_active: true },
          orderBy: { created_at: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            thumbnail_url: true,
            created_at: true,
          },
        },
        _count: {
          select: {
            village_structures: true,
            village_facilities: true,
            village_potentials: true,
            village_populations: true,
            news: true,
          },
        },
      },
    });

    if (!village) {
      return NextResponse.json(
        { message: "Data desa tidak ditemukan." },
        { status: 404 }
      );
    }

    const latestPopulation = village.village_populations[0] ?? null;

    const male =
      latestPopulation?.total_male ??
      latestPopulation?.village_population_details
        ?.filter((item) =>
          item.population_master_items.name.toLowerCase().includes("laki")
        )
        .reduce((a, b) => a + b.total, 0) ??
      0;

    const female =
      latestPopulation?.total_female ??
      latestPopulation?.village_population_details
        ?.filter((item) =>
          item.population_master_items.name.toLowerCase().includes("perempuan")
        )
        .reduce((a, b) => a + b.total, 0) ??
      0;

    const totalPopulation = latestPopulation?.total_population ?? male + female;

    const head =
      village.village_structures.find((item) =>
        item.village_structure_positions.name.toLowerCase().includes("kepala desa")
      ) ?? null;

    const fullAddress = [
      village.address,
      village.rt ? `RT ${village.rt}` : null,
      village.rw ? `RW ${village.rw}` : null,
      village.village,
      village.district,
      village.regency,
      village.province,
      village.postal_code,
    ]
      .filter(Boolean)
      .join(", ");

    const workingHours = "08.00 - 16.00 WIB";

    const groupedPotential = village.village_potentials.reduce<
      Record<string, number>
    >((acc, item) => {
      const category = item.village_potential_categories.name;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const structures = village.village_structures.map((item) => ({
      id: item.id.toString(),
      fullName: item.full_name,
      gender: item.gender,
      photo: item.photo_url,
      phone: item.phone,
      email: item.email,
      address: item.address,
      position: item.village_structure_positions.name,
      category: item.village_structure_positions.village_structure_categories.name,
      group: item.village_structure_positions.village_structure_groups?.name ?? null,
      period: item.village_structure_periods
        ? {
            id: item.village_structure_periods.id.toString(),
            startYear: item.village_structure_periods.start_year,
            endYear: item.village_structure_periods.end_year,
            isActive: item.village_structure_periods.is_active,
          }
        : null,
    }));

    const facilities = village.village_facilities.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      image: item.image_url,
      address: item.address,
      maps: item.link_maps,
      type: {
        id: item.village_facility_types.id.toString(),
        name: item.village_facility_types.name,
      },
      category: {
        id: item.village_facility_types.village_facility_categories.id.toString(),
        name: item.village_facility_types.village_facility_categories.name,
      },
    }));

    const potentials = village.village_potentials.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      image: item.image_url,
      address: item.address,
      maps: item.link_maps,
      website: item.website,
      category: {
        id: item.village_potential_categories.id.toString(),
        name: item.village_potential_categories.name,
      },
    }));

    const counts = {
      structures: village._count.village_structures,
      facilities: village._count.village_facilities,
      potentials: village._count.village_potentials,
      populations: village._count.village_populations,
      news: village._count.news,
    };

    return NextResponse.json({
      id: village.id.toString(),
      name: village.name,
      history: village.history,
      vision: village.vision,
      mission: village.mission,
      welcomeMessage: village.welcome_message,
      foundedYear: village.founded_year,
      areaSize: village.area_size ? Number(village.area_size) : null,
      logo: village.logo_url,
      mapEmbed: village.map_embed,
      contact: {
        phone: village.phone,
        email: village.email,
        website: village.website,
        workingHours,
      },
      socialMedia: {
        facebook: village.facebook,
        instagram: village.instagram,
        youtube: village.youtube,
        tiktok: village.tiktok,
      },
      address: {
        address: village.address,
        rt: village.rt,
        rw: village.rw,
        village: village.village,
        district: village.district,
        regency: village.regency,
        province: village.province,
        postalCode: village.postal_code,
        fullAddress,
      },
      boundary: {
        north: village.north_boundary,
        south: village.south_boundary,
        east: village.east_boundary,
        west: village.west_boundary,
      },
      statistics: {
        totalRT: village.total_rt,
        totalRW: village.total_rw,
        totalHamlets: village.total_hamlets,
      },
      population: latestPopulation
        ? {
            year: latestPopulation.year,
            male,
            female,
            total: totalPopulation,
            familyCards: latestPopulation.total_family_cards,
            details: latestPopulation.village_population_details.map((item) => ({
              id: item.id.toString(),
              total: item.total,
              sortOrder: item.sort_order,
              item: {
                id: item.population_master_items.id.toString(),
                name: item.population_master_items.name,
              },
              category: {
                id: item.population_master_items.population_categories.id.toString(),
                name: item.population_master_items.population_categories.name,
              },
            })),
          }
        : null,
      head: head
        ? {
            id: head.id.toString(),
            name: head.full_name,
            title: head.village_structure_positions.name,
            gender: head.gender,
            photo: head.photo_url,
            phone: head.phone,
            email: head.email,
            address: head.address,
            period: head.village_structure_periods
              ? {
                  id: head.village_structure_periods.id.toString(),
                  startYear: head.village_structure_periods.start_year,
                  endYear: head.village_structure_periods.end_year,
                  text: `${head.village_structure_periods.start_year}-${head.village_structure_periods.end_year}`,
                }
              : null,
          }
        : null,
      structures,
      facilities,
      potentials,
      potentialSummary: groupedPotential,
      latestNews: village.news.map((item) => ({
        id: item.id.toString(),
        title: item.title,
        slug: item.slug,
        category: item.category,
        thumbnail: item.thumbnail_url,
        createdAt: item.created_at,
      })),
      counts,
      createdAt: village.created_at,
      updatedAt: village.updated_at,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}