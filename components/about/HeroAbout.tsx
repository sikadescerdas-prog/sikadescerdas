// components/about/HeroAbout.tsx

"use client";

import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { aboutData } from "@/modules/about/data/about.data";

export default function HeroAbout() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br px-6 py-12 md:px-12 lg:px-20">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${aboutData.background} opacity-95`} />

      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* TEXT */}
        <div className="text-white">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
              <Image
                src={aboutData.logo}
                alt={aboutData.name}
                width={60}
                height={60}
                className="h-full w-full object-contain p-1"
              />
            </div>

            <div>
              <p className="text-sm text-white/80">
                Website Resmi
              </p>

              <h2 className="text-xl font-bold">
                {aboutData.name}
              </h2>

              <div className="flex items-center gap-1 text-sm text-white/80">
                <MapPin className="h-4 w-4" />
                <span>Kec. Karangjambu, Kab. Purbalingga</span>
              </div>
            </div>
          </div>

          <h1 className="max-w-3xl text-2xl font-extrabold leading-tight md:text-5xl">
            {aboutData.title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/95 md:text-lg">
            {aboutData.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 shadow-lg transition hover:bg-slate-100">
              Jelajahi Desa
              <ArrowRight className="h-5 w-5" />
            </button>

            <button className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              Pelajari SIKADES
            </button>
          </div>
        </div>

        {/* VISUAL */}
        <div className="relative hidden justify-center lg:flex">
          <div className="relative flex h-72 w-72 items-center justify-center rounded-[3rem] bg-white p-8 shadow-2xl md:h-96 md:w-96">
            <Image
              src={aboutData.logo}
              alt={aboutData.name}
              width={320}
              height={320}
              className="h-full w-full object-contain"
            />

            {/* DEVELOPMENT */}
            <div className="absolute -bottom-4 left-1/2 flex w-max max-w-[90%] -translate-x-1/2 items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-lg">
              {aboutData.developer.logo && (
                <Image
                  src={aboutData.developer.logo}
                  alt={aboutData.developer.name}
                  width={28}
                  height={28}
                  className="h-7 w-7 shrink-0 rounded-md object-contain"
                />
              )}

              <div className="flex min-w-0 flex-col">
                <span className="whitespace-nowrap text-[10px] font-medium leading-tight text-slate-500">
                  Dikembangkan oleh
                </span>

                <span className="truncate text-xs font-bold text-emerald-600">
                  {aboutData.developer.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}