// components/home/HomeContent.tsx
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
  const { data } = useHome();

  // Menggunakan "as any" agar TypeScript tidak protes jika ada perbedaan tipe properti saat data kosong
  const displayData = data || ({
    village: null,
    statistics: {
      population: 0,
      populationYear: new Date().getFullYear(),
      umkm: { products: 0, total: 0 },
      facilities: { total: 0, categories: [] },
      region: { hamlets: 0, rt: 0, rw: 0 },
    },
    literatures: { total: 0, books: 0, articles: 0 },
    products: [],
    news: [],
  } as any);

  return (
    <>
      {/* HERO */}
      <section>
        <HeroSection village={displayData.village} />
      </section>

      {/* STATISTIK */}
      <section className="mt-5 lg:mt-8">
        <StatsSection statistics={displayData.statistics} />
      </section>

      {/* CUACA + LITERASI */}
      <section className="mt-6 grid gap-5 lg:grid-cols-12 xl:mt-8">
        <div className="lg:col-span-5">
          <WeatherSection />
        </div>
        <div className="lg:col-span-7">
          <LiteracySection
            total={displayData.literatures.total}
            books={displayData.literatures.books}
            articles={displayData.literatures.articles}
          />
        </div>
      </section>

      {/* UMKM */}
      <section className="mt-6 xl:mt-8">
        <UmkmSection products={displayData.products} />
      </section>

      {/* BERITA + LAYANAN */}
      <section className="mt-6 flex flex-col gap-5 lg:grid lg:grid-cols-12 xl:mt-8">
        <div className="w-full lg:col-span-8">
          <BeritaSection news={displayData.news} />
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