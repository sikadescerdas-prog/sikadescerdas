// app/village/potentials/page.tsx

import HeaderVillage from "@/components/village/HeaderVillage";
import PotentialVillage from "@/components/village/PotentialsVillage";

async function getPotentials() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/dashboard/potential`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Gagal memuat potensi:", error);
    return [];
  }
}

async function getFacilities() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/dashboard/facility`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Gagal memuat fasilitas:", error);
    return [];
  }
}

export default async function Page() {
  const [potentials, facilities] = await Promise.all([
    getPotentials(),
    getFacilities(),
  ]);

  const villageInfo = {
    name: potentials[0]?.villages?.name || "Desa Mandiri Sejahtera",
    logo: potentials[0]?.villages?.logo_url || null,
    address: {
      district: potentials[0]?.villages?.district || "Kecamatan",
      regency: potentials[0]?.villages?.regency || "Kabupaten",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <HeaderVillage 
        title="Potensi & Fasilitas Desa"
        village={villageInfo}
        showBackButton={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="bg-transparent">
          <PotentialVillage 
            potentials={potentials} 
            facilities={facilities} 
          />
        </div>
      </main>
    </div>
  );
}