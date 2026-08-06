// components/services/ServiceModal.tsx

"use client";

import { useEffect } from "react";
import { X, Clock3, Wallet, CheckCircle2, ArrowRight, FileCheck2 } from "lucide-react";
import ServiceFAQ from "./ServiceFAQ";
import ServiceCTA from "./ServiceCTA";
import type { Service } from "@/modules/services/types/service.types";

interface ServiceModalProps {
  service: Service | null;
  open: boolean;
  onClose: () => void;
}

export default function ServiceModal({ service, open, onClose }: ServiceModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !service) return null;

  const Icon = service.icon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl md:max-w-3xl md:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative border-b border-slate-100 bg-white p-6">
          {/* DECORATION */}
          <div className={`pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-gradient-to-br ${service.color} opacity-10`} />

          {/* CLOSE */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>

          {/* CONTENT */}
          <div className="relative z-10 flex items-start gap-4 pr-14">
            {/* ICON */}
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-lg`}>
              <Icon className="h-8 w-8" />
            </div>

            {/* TITLE */}
            <div className="min-w-0">
              {/* BADGE */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {service.category}
                </span>

                {service.online && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    Online
                  </span>
                )}

                {service.featured && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                    Populer
                  </span>
                )}
              </div>

              <h2 className="mt-3 line-clamp-2 text-xl font-bold text-slate-900 md:text-2xl">
                {service.title}
              </h2>

              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {service.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* DESCRIPTION */}
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tentang Layanan</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
          </div>

          {/* INFO */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs font-medium">Estimasi</span>
              </div>
              <p className="mt-2 font-bold text-slate-900">{service.duration}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Wallet className="h-4 w-4" />
                <span className="text-xs font-medium">Biaya</span>
              </div>
              <p className="mt-2 font-bold text-emerald-600">{service.fee}</p>
            </div>
          </div>

          {/* REQUIREMENT */}
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Persyaratan</h3>
            </div>

            <div className="mt-4 space-y-3">
              {service.requirements.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm text-slate-700">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STEPS */}
          <div>
            <h3 className="text-lg font-bold text-slate-900">Alur Pengajuan</h3>

            <div className="mt-4 space-y-4">
              {service.steps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${service.color} text-sm font-bold text-white`}>
                    {index + 1}
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900">{step.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <ServiceFAQ faq={service.faq} />

          {/* CTA */}
          <ServiceCTA
            service={service}
            onApply={(item) => {
              console.log("Apply service:", item.id);
            }}
          />
        </div>
      </div>
    </div>
  );
}