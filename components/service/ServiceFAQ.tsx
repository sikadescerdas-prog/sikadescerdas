// components/services/ServiceFAQ.tsx

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ServiceFAQ as FAQType } from "@/modules/services/types/service.types";

interface ServiceFAQProps {
  faq: FAQType[];
}

export default function ServiceFAQ({ faq }: ServiceFAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faq || faq.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-bold text-slate-900">Pertanyaan Umum</h3>
        <p className="mt-3 text-sm text-slate-500">Belum ada pertanyaan yang tersedia.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Pertanyaan yang Sering Diajukan</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">Informasi tambahan mengenai layanan yang tersedia.</p>
      </div>

      {/* FAQ LIST */}
      <div className="space-y-3">
        {faq.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                isOpen ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className={`text-sm font-semibold transition-colors ${isOpen ? "text-emerald-700" : "text-slate-800"}`}>
                  {item.question}
                </span>

                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                    isOpen ? "rotate-180 bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="px-5 pb-5">
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-sm leading-7 text-slate-600">{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}