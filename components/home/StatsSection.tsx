// components/home/StatsSection.tsx
"use client";

import { Users, Store, School, MapPin, ArrowUpRight } from "lucide-react";
import type { HomeStatistics } from "@/modules/home/types/home.types";

interface Props {
  statistics: HomeStatistics;
}

export default function StatsSection({ statistics }: Props) {
  const cards = [
    {
      title: "Penduduk",
      value: statistics.population.toLocaleString("id-ID"),
      unit: "Jiwa",
      subtitle: `Tahun ${statistics.populationYear ?? "-"}`,
      icon: Users,
      gradient: "from-emerald-400 via-green-500 to-green-700",
      badge: "Demografi",
    },
    {
      title: "UMKM",
      value: statistics.umkm.products,
      unit: "Produk",
      subtitle: `${statistics.umkm.total} Pelaku Usaha Aktif`,
      icon: Store,
      gradient: "from-green-400 via-teal-500 to-emerald-700",
      badge: "Ekonomi",
    },
    {
      title: "Fasilitas",
      value: statistics.facilities.total,
      unit: "Sarana Desa",
      subtitle: statistics.facilities.categories.slice(0, 3).join(" • ") || "Desa",
      icon: School,
      gradient: "from-blue-400 via-cyan-500 to-blue-700",
      badge: "Layanan",
    },
    {
      title: "Wilayah",
      value: statistics.region.hamlets,
      unit: "Dusun",
      subtitle: `${statistics.region.rt} RT / ${statistics.region.rw} RW`,
      icon: MapPin,
      gradient: "from-orange-400 via-red-500 to-red-700",
      badge: "Administrasi",
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white to-gray-50 p-[1px] shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
          >
            {/* gradient border */}
            <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${item.gradient} opacity-0 transition duration-500 group-hover:opacity-100`} />

            <div className="relative h-full rounded-[2rem] bg-white p-6">
              {/* glow */}
              <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${item.gradient} opacity-10 blur-3xl transition duration-500 group-hover:opacity-30`} />

              <div className="relative flex items-start justify-between">
                <div>
                  <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold text-green-700">
                    {item.badge}
                  </span>

                  <p className="mt-4 text-sm font-medium text-gray-500">
                    {item.title}
                  </p>

                  <div className="mt-2 flex items-end gap-2">
                    <h3 className="text-4xl font-black tracking-tight text-gray-900 transition group-hover:scale-105">
                      {item.value}
                    </h3>
                    <span className="mb-1 text-sm font-bold text-gray-500">
                      {item.unit}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    {item.subtitle}
                  </p>
                </div>

                {/* icon */}
                <div className="relative">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} blur-lg opacity-40 transition group-hover:opacity-70`} />

                  <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-xl transition duration-500 group-hover:rotate-6`}>
                    <Icon size={30} strokeWidth={2.5} />
                    <div className="absolute -right-2 -top-2 rounded-full bg-white p-1.5 shadow-md">
                      <ArrowUpRight size={13} className="text-gray-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* bottom line */}
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-gray-100">
                <div className={`h-full w-1/2 rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-700 group-hover:w-full`} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}