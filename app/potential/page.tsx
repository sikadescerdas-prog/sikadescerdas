// app/potentials/page.tsx

export const dynamic = "force-dynamic";

import HeaderVillage from "@/components/village/HeaderVillage";
import PotentialVillageCombined from "@/components/village/PotentialsVillage";
import { prisma } from "@/lib/prisma";

export default async function PotentialsPage() {
  const village = await prisma.villages.findFirst();

  if (!village) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-slate-500">Data desa belum tersedia</p>
      </main>
    );
  }

  const [potentials, facilities] = await Promise.all([
    prisma.village_potentials.findMany({
      where: { village_id: village.id },
      include: {
        village_potential_categories: true,
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.village_facilities.findMany({
      where: { village_id: village.id },
      include: {
        village_facility_types: {
          include: {
            village_facility_categories: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    }),
  ]);

  const formattedPotentials = potentials.map((item) => ({
    id: item.id.toString(),
    name: item.name,
    description: item.description ?? undefined,
    address: item.address ?? undefined,
    link_maps: item.link_maps ?? undefined,
    website: item.website ?? undefined,
    image_url: item.image_url ?? undefined,
    village_potential_categories: item.village_potential_categories
      ? { name: item.village_potential_categories.name }
      : undefined,
  }));

  const formattedFacilities = facilities.map((item) => ({
    id: item.id.toString(),
    name: item.name,
    address: item.address ?? undefined,
    link_maps: item.link_maps ?? undefined,
    image_url: item.image_url ?? undefined,
    village_facility_types: item.village_facility_types
      ? {
          name: item.village_facility_types.name,
          village_facility_categories: item.village_facility_types.village_facility_categories
            ? { name: item.village_facility_types.village_facility_categories.name }
            : undefined,
        }
      : undefined,
  }));

  const villageInfo = {
    name: village.name,
    logo: village.logo_url,
    address: {
      district: village.district,
      regency: village.regency,
    },
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <HeaderVillage
        title="Potensi & Fasilitas Desa"
        village={villageInfo}
        showBackButton={true}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <PotentialVillageCombined
          potentials={formattedPotentials}
          facilities={formattedFacilities}
        />
      </div>
    </main>
  );
}