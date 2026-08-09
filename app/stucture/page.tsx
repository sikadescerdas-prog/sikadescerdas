// app/structure/page.tsx
import { prisma } from "@/lib/prisma";
import StructurePageClient from "@/components/village/StructurePageClient";

export default async function StructurePage() {
  const [village, structures] = await Promise.all([
    prisma.villages.findFirst(),
    prisma.village_structures.findMany({
      where: { is_active: true },
      include: {
        village_structure_positions: {
          include: {
            village_structure_categories: true,
            village_structure_groups: true,
          },
        },
        village_structure_periods: true,
      },
      orderBy: { created_at: "asc" },
    }),
  ]);

  if (!village) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Data desa belum tersedia</p>
      </main>
    );
  }

  const mappedStructures = structures.map((item) => {
    const period = item.village_structure_periods;

    return {
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
      period: period ? { startYear: period.start_year, endYear: period.end_year, isActive: period.is_active ?? false } : null,
    };
  });

  return (
    <StructurePageClient
      village={{
        name: village.name ?? "Desa",
        logo: village.logo_url,
        address: {
          district: village.district,
          regency: village.regency,
        },
      }}
      structures={mappedStructures}
    />
  );
}