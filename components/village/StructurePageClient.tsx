// components/village/StructurePageClient.tsx
"use client";

import dynamic from "next/dynamic";

const HeaderVillage = dynamic(() => import("@/components/village/HeaderVillage"), { ssr: false });
const StructureVillage = dynamic(() => import("@/components/village/StructureVillage"), { ssr: false });

interface StructurePageClientProps {
  village: { name: string; logo: string | null; address: { district: string | null; regency: string | null; }; };
  structures: { id: string; fullName: string; gender: string | null; photo: string | null; phone: string | null; email: string | null; address: string | null; position: string; category: string; group: string | null; period: { startYear: number; endYear: number | null; isActive: boolean; } | null; }[];
}

export default function StructurePageClient({ village, structures }: StructurePageClientProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeaderVillage title="Struktur Organisasi" village={village} />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 -mt-12 lg:-mt-28">
        <StructureVillage structures={structures} />
      </div>
    </main>
  );
}