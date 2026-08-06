// app/services/page.tsx

"use client";

import HeroServices from "@/components/service/HeroServices";
import SearchServices from "@/components/service/SearchServices";
import StatsServices from "@/components/service/StatsServices";
import ServiceBackground from "@/components/service/ServiceBackground";
import ServiceGrid from "@/components/service/ServiceGrid";
import ServiceModal from "@/components/service/ServiceModal";
import { useServices } from "@/modules/services/hooks/useServices";

export default function ServicesPage() {
  const {
    filteredServices,
    categories,
    keyword,
    setKeyword,
    category,
    setCategory,
    selectedService,
    openService,
    closeService,
    totalServices,
    totalFiltered,
    hasFilters,
    clearFilters,
  } = useServices();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ServiceBackground />

      <div className="relative mx-auto w-full max-w-7xl pb-24">
        <HeroServices />

        <section className="mt-10 px-4 md:px-8">
          <StatsServices
            totalServices={totalServices}
            totalFiltered={totalFiltered}
          />
        </section>

        <section className="mt-10">
          <SearchServices
            keyword={keyword}
            setKeyword={setKeyword}
            category={category}
            setCategory={setCategory}
            categories={categories}
            hasFilters={hasFilters}
            onClear={clearFilters}
          />
        </section>

        <section className="mt-10">
          <ServiceGrid
            services={filteredServices}
            onSelect={openService}
          />
        </section>
      </div>

      <ServiceModal
        open={!!selectedService}
        service={selectedService}
        onClose={closeService}
      />
    </main>
  );
}