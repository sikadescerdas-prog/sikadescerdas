// app/api/dashboard/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Ambil tahun kependudukan terbaru secara dinamis dari database
    const latestPopulationRecord = await prisma.village_populations.findFirst({
      orderBy: { year: "desc" },
      select: { year: true },
    });

    const currentYear = latestPopulationRecord?.year || new Date().getFullYear();
    const previousYear = currentYear - 1;

    // 2. Mengambil seluruh data statistik dan list secara paralel
    const [
      totalUsers,
      totalActiveUsers,
      totalStores,
      totalProducts,
      totalNews,
      totalLiteratures,
      totalFacilities,
      totalPotentials,
      currentPop,
      prevPop,
      activeVillageStructurePeriod,
      schoolFacilities,
      recentProducts,
      recentNews,
      topPotentials,
    ] = await Promise.all([
      prisma.users.count(),
      prisma.users.count({ where: { is_active: true } }),
      prisma.stores.count(),
      prisma.products.count({ where: { is_active: true } }),
      prisma.news.count({ where: { is_active: true } }),
      prisma.literatures.count({ where: { is_active: true } }),
      prisma.village_facilities.count({ where: { is_active: true } }),
      prisma.village_potentials.count({ where: { is_active: true } }),

      // Data Penduduk Dinamis Berdasarkan Tahun Terbaru
      prisma.village_populations.findFirst({
        where: { year: currentYear },
        select: { total_population: true, total_family_cards: true, total_male: true, total_female: true },
      }),
      prisma.village_populations.findFirst({
        where: { year: previousYear },
        select: { total_population: true, total_family_cards: true },
      }),

      // Perangkat Desa Aktif
      prisma.village_structure_periods.findFirst({
        where: { is_active: true },
        include: {
          village_structures: {
            where: { is_active: true },
            orderBy: { created_at: "asc" },
            select: {
              id: true,
              full_name: true,
              phone: true,
              email: true,
              photo_url: true,
              village_structure_positions: {
                select: { name: true },
              },
            },
          },
        },
      }),

      // --- PERBAIKAN: FILTER BERDASARKAN RELASI TIPE FASILITAS KATEGORI PENDIDIKAN ---
      // Menggunakan relasi ke village_facility_types di mana category_id bernilai "1" (Pendidikan)
      prisma.village_facilities.findMany({
        where: {
          is_active: true,
          village_facility_types: {
            category_id: 1, // Atau string "1" tergantung tipe data kolom category_id di database Anda
          },
        },
        select: { 
          id: true, 
          name: true, 
          address: true,
          village_facility_types: {
            select: { name: true }
          }
        },
        orderBy: { name: "asc" },
      }),

      // List 10 Produk UMKM Terbaru
      prisma.products.findMany({
        take: 10,
        where: { is_active: true },
        orderBy: { created_at: "desc" },
        select: { 
          id: true, 
          name: true, 
          price: true, 
          stores: { select: { name: true } }, 
          created_at: true 
        },
      }),

      // List 10 Berita Terbaru
      prisma.news.findMany({
        take: 10,
        where: { is_active: true },
        orderBy: { created_at: "desc" },
        select: { id: true, title: true, category: true, created_at: true },
      }),

      // List 5 Potensi Desa Unggulan
      prisma.village_potentials.findMany({
        take: 5,
        where: { is_active: true },
        orderBy: { created_at: "desc" },
        select: { id: true, name: true, description: true },
      }),
    ]);

    // Kalkulasi Pertumbuhan Penduduk
    const currTotal = currentPop?.total_population || 0;
    const prevTotal = prevPop?.total_population || 0;
    const diffPopulation = currTotal - prevTotal;
    const growthPercentage = prevTotal > 0 ? ((diffPopulation / prevTotal) * 100).toFixed(1) : "0";

    const responseData = {
      success: true,
      message: "Data dashboard lengkap berhasil dimuat",
      data: {
        stats: {
          users: totalUsers,
          active_users: totalActiveUsers,
          stores: totalStores,
          products: totalProducts,
          news: totalNews,
          literatures: totalLiteratures,
          facilities: totalFacilities,
          potentials: totalPotentials,
        },
        population_comparison: {
          current_year: currentYear,
          current_data: currentPop,
          previous_year: previousYear,
          previous_data: prevPop,
          growth: {
            difference: diffPopulation,
            percentage: `${growthPercentage}%`,
            is_increase: diffPopulation >= 0,
          },
        },
        village_officials: {
          period_name: activeVillageStructurePeriod ? `${activeVillageStructurePeriod.start_year} - ${activeVillageStructurePeriod.end_year}` : "Periode Aktif",
          staffs: activeVillageStructurePeriod?.village_structures || [],
        },
        lists: {
          schools: schoolFacilities,
          products: recentProducts,
          news: recentNews,
          potentials: topPotentials,
        },
      },
    };

    return NextResponse.json(serializeBigInt(responseData), { status: 200 });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data dashboard" },
      { status: 500 }
    );
  }
}