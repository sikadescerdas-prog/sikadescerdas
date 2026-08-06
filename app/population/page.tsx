// app/population/page.tsx

export const dynamic = "force-dynamic";

import HeaderVillage from "@/components/village/HeaderVillage";
import PopulationDetailVillage from "@/components/village/population/PopulationDetailVillage";
import { prisma } from "@/lib/prisma";

export default async function PopulationPage() {
  const village = await prisma.villages.findFirst();

  if (!village) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-slate-500">
          Data desa belum tersedia
        </p>
      </main>
    );
  }

  const populations = await prisma.village_populations.findMany({
    where: { village_id: village.id },
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
    orderBy: {
      year: "desc",
    },
  });

  const formattedPopulations = populations.map((item) => ({
    id: item.id.toString(),
    year: item.year,
    total_family_cards: item.total_family_cards,
    total_male: item.total_male,
    total_female: item.total_female,
    total_population: item.total_population,

    village_population_details:
      item.village_population_details.map((detail) => ({
        total: detail.total,
        population_master_items: {
          name: detail.population_master_items.name,
          population_categories: {
            name:
              detail.population_master_items.population_categories.name,
          },
        },
      })),
  }));

  return (
    <main className="min-h-screen bg-gray-50">
      <HeaderVillage
        title="Data Penduduk"
        village={{
          name: village.name,
          logo: village.logo_url,
          address: {
            district: village.district,
            regency: village.regency,
          },
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 -mt-12 lg:-mt-28">
        <PopulationDetailVillage
          populations={formattedPopulations}
        />
      </div>
    </main>
  );
}