// app/village/page.tsx

import HeaderVillage from "@/components/village/HeaderVillage";
import HistoryVillage from "@/components/village/HistoryVillage";
import InformationVillage from "@/components/village/InformationVillage";
import PopulationVillage from "@/components/village/PopulationVillage";
import { prisma } from "@/lib/prisma";

export default async function VillagePage() {
  const [village, population] = await Promise.all([
    prisma.villages.findFirst(),
    prisma.village_populations.findFirst({
      orderBy: { year: "desc" },
    }),
  ]);

  if (!village) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Data desa belum tersedia</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <HeaderVillage
        title="Profil Desa"
        village={{
          name: village.name ?? "",
          logo: village.logo_url,
          address: {
            district: village.district ?? "",
            regency: village.regency ?? "",
          },
        }}
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:-mt-28 -mt-12">
        <HistoryVillage />

        <InformationVillage
          village={{
            name: village.name ?? "",
            district: village.district ?? "",
            regency: village.regency ?? "",
            province: village.province ?? "",
            address: village.address ?? "",
            email: village.email ?? "",
            phone: village.phone ?? "",
            website: village.website ?? "",
            founded: village.founded_year ? String(village.founded_year) : "-",
          }}
        />

        <PopulationVillage
          male={population?.total_male ?? 0}
          female={population?.total_female ?? 0}
          year={String(population?.year ?? "-")}
        />
      </div>
    </main>
  );
}