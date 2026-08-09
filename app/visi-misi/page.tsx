// app/misi-visi/page.tsx
import HeaderVillage from "@/components/village/HeaderVillage";
import VisiMisiVillage from "@/components/village/VisiMisiVillage";
import { prisma } from "@/lib/prisma";

export default async function VisionMissionPage() {
  const village = await prisma.villages.findFirst();

  if (!village) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Data desa belum tersedia</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <HeaderVillage title="Visi & Misi Desa" village={{ name: village.name ?? "", logo: village.logo_url, address: { district: village.district ?? "", regency: village.regency ?? "" } }} />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:-mt-28 -mt-12">
        <VisiMisiVillage village={{ vision: village.vision, mission: village.mission }} />
      </div>
    </main>
  );
}