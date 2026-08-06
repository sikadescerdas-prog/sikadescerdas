// components/services/StatsServices.tsx

"use client";

import { FileCheck2, SearchCheck, Clock3 } from "lucide-react";

interface StatsServicesProps {
  totalServices: number;
  totalFiltered: number;
}

export default function StatsServices({ totalServices, totalFiltered }: StatsServicesProps) {
  const stats = [
    { title: "Total Layanan", value: totalServices, icon: FileCheck2, description: "Layanan tersedia" },
    { title: "Ditemukan", value: totalFiltered, icon: SearchCheck, description: "Hasil pencarian" },
    { title: "Online", value: "24/7", icon: Clock3, description: "Akses layanan" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Icon className="h-6 w-6" />
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="text-sm font-medium text-slate-600">{item.title}</p>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}