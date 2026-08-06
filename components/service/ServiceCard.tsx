// components/services/ServiceCard.tsx

"use client";

import { ArrowRight, CheckCircle2, Clock3, Star } from "lucide-react";
import type { Service } from "@/modules/services/types/service.types";

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/80 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-2xl"
    >
      {/* Background Glow */}
      <div className={`absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${service.color} opacity-10 blur-3xl transition-all duration-500 group-hover:opacity-20 group-hover:scale-125`} />

      {/* Header */}
      <div className="relative border-b border-slate-100 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
            <Icon className="h-7 w-7" />
          </div>

          <div className="flex flex-col items-end gap-2">
            {service.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-600">
                <Star className="h-3.5 w-3.5 fill-current" />
                Populer
              </span>
            )}

            {service.online && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-600">
                Online
              </span>
            )}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">{service.category}</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-emerald-600">{service.title}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">{service.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <p className="line-clamp-3 text-sm leading-7 text-slate-600">{service.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs font-medium">Estimasi</span>
            </div>
            <p className="mt-2 text-sm font-bold text-slate-900">{service.duration}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Biaya</span>
            </div>
            <p className="mt-2 text-sm font-bold text-emerald-600">{service.fee}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Persyaratan</p>
          <div className="space-y-2">
            {service.requirements.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <div className="mt-[7px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <p className="line-clamp-1 text-sm text-slate-600">{item.title}</p>
              </div>
            ))}

            {service.requirements.length > 3 && (
              <p className="pt-1 text-xs font-medium text-slate-400">
                +{service.requirements.length - 3} persyaratan lainnya
              </p>
            )}
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-5 py-4 transition-all group-hover:border-emerald-200 group-hover:bg-emerald-50">
            <div>
              <p className="text-sm font-semibold text-slate-900">Lihat Detail</p>
              <p className="text-xs text-slate-500">Persyaratan & langkah pengajuan</p>
            </div>

            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-white transition-transform duration-300 group-hover:translate-x-1`}>
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}