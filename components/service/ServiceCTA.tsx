// components/services/ServiceCTA.tsx

"use client";

import { ArrowRight, CheckCircle2, Headphones, Send } from "lucide-react";
import type { Service } from "@/modules/services/types/service.types";

interface ServiceCTAProps {
  service?: Service;
  onApply?: (service: Service) => void;
}

export default function ServiceCTA({ service, onApply }: ServiceCTAProps) {
  if (!service) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-6 text-white shadow-xl md:p-8">
      {/* Decorative */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* CONTENT */}
        <div className="max-w-xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold backdrop-blur">
            <CheckCircle2 className="h-4 w-4" />
            Layanan Digital Desa
          </div>

          <h3 className="text-2xl font-bold md:text-3xl">Siap Mengajukan {service.title}?</h3>

          <p className="mt-3 text-sm leading-7 text-emerald-50 md:text-base">
            Ajukan layanan secara mudah dan cepat. Pastikan dokumen persyaratan sudah lengkap sebelum melakukan pengajuan.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-medium backdrop-blur">
              <Send className="h-4 w-4" />
              Online
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-medium backdrop-blur">
              <Headphones className="h-4 w-4" />
              Bantuan Petugas
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onApply?.(service)}
            className="group flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-emerald-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            Ajukan Layanan
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}