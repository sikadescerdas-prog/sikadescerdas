// components/services/ServiceGrid.tsx

"use client";

import { SearchX } from "lucide-react";
import ServiceCard from "./ServiceCard";
import type { Service } from "@/modules/services/types/service.types";

interface ServiceGridProps {
  services: Service[];
  onSelect: (service: Service) => void;
}

export default function ServiceGrid({ services, onSelect }: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <section className="mx-auto max-w-7xl pb-0">
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <SearchX className="h-9 w-9 text-slate-400" />
          </div>
          <h3 className="mt-6 text-2xl font-bold text-slate-900">Layanan tidak ditemukan</h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
            Coba gunakan kata kunci lain atau ubah kategori yang dipilih untuk menemukan layanan yang sesuai.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}