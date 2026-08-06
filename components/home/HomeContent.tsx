// modules/home/components/HomeContent.tsx
"use client";

import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import WeatherSection from "@/components/home/WeatherSection";
import LiteracySection from "@/components/home/LiteracySection";
import UmkmSection from "@/components/home/UMKMSection";
import BeritaSection from "@/components/home/BeritaSection";
import LayananSection from "@/components/home/LayananSection";
import CTASection from "@/components/home/CTASection";
import { useHome } from "@/modules/home/hooks/useHome";

export default function HomeContent() {
  const { data, loading, error } = useHome();

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl bg-white px-6 py-4 text-sm text-gray-500 shadow">
          Memuat data desa...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl bg-white px-6 py-4 text-sm text-red-500 shadow">
          Data homepage tidak tersedia
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <section>
        <HeroSection village={data.village} />
      </section>

      {/* STATISTIK */}
      <section className="mt-5 lg:mt-8">
        <StatsSection statistics={data.statistics} />
      </section>

      {/* CUACA + LITERASI */}
      <section className="mt-6 grid gap-5 lg:grid-cols-12 xl:mt-8">
        <div className="lg:col-span-5">
          <WeatherSection />
        </div>
        <div className="lg:col-span-7">
          <LiteracySection
            total={data.literatures.total}
            books={data.literatures.books}
            articles={data.literatures.articles}
          />
        </div>
      </section>

      {/* UMKM */}
      <section className="mt-6 xl:mt-8">
        <UmkmSection products={data.products} />
      </section>

      {/* BERITA + LAYANAN */}
      <section className="mt-6 flex flex-col gap-5 lg:grid lg:grid-cols-12 xl:mt-8">
        <div className="w-full lg:col-span-8">
          <BeritaSection news={data.news} />
        </div>
        <div className="w-full lg:col-span-4">
          <LayananSection />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-6 xl:mt-8">
        <CTASection />
      </section>
    </>
  );
}