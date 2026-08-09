// components/village/PopulationDetailVillage.tsx

"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { groupPopulation } from "./utils/populationHelper";
import PopulationHeader from "./PopulationHeader";
import PopulationStatsCards from "./PopulationStatsCards";
import PopulationGenderRatio from "./PopulationGenderRatio";
import PopulationCategories from "./PopulationCategories";

interface PopulationDetailVillageProps {
  populations: {
    id: string;
    year: number;
    total_family_cards: number;
    total_male: number;
    total_female: number;
    total_population: number;
    village_population_details: {
      total: number;
      population_master_items: {
        name: string;
        population_categories: { name: string; };
      };
    }[];
  }[];
}

export default function PopulationDetailVillage({ populations = [] }: PopulationDetailVillageProps) {
  const [selectedYear, setSelectedYear] = useState(populations[0]?.year);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [chartMode, setChartMode] = useState<Record<string, "bar" | "pie">>({});

  const sortedPopulations = useMemo(() => [...populations].sort((a, b) => b.year - a.year), [populations]);

  const population = useMemo(() => {
    if (!sortedPopulations || sortedPopulations.length === 0) return null;
    return sortedPopulations.find((item) => item.year === selectedYear) ?? sortedPopulations[0];
  }, [sortedPopulations, selectedYear]);

  const previousPopulation = useMemo(() => {
    if (!population) return null;
    const targetYear = population.year - 1;
    return sortedPopulations.find((item) => item.year === targetYear) ?? null;
  }, [sortedPopulations, population]);

  const populationHistory = useMemo(() => {
    return sortedPopulations.filter((item) => item.year <= selectedYear).sort((a, b) => a.year - b.year).slice(-5).map((item) => ({
      year: item.year,
      total_population: item.total_population,
      total_family_cards: item.total_family_cards,
      total_male: item.total_male,
      total_female: item.total_female,
    }));
  }, [sortedPopulations, selectedYear]);

  const categories = useMemo(() => {
    if (!population) return {};
    return groupPopulation(population.village_population_details, previousPopulation?.village_population_details);
  }, [population, previousPopulation]);

  const toggleChartMode = (name: string) => {
    setChartMode((prev) => ({ ...prev, [name]: prev[name] === "bar" ? "pie" : "bar" }));
  };

  if (!population) {
    return (
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
        <Users className="mx-auto h-12 w-12 text-slate-300 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-slate-700">Belum Ada Data Penduduk</h2>
        <p className="text-sm text-slate-500 mt-1">Data statistik kependudukan untuk desa ini belum tersedia.</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-10 group/card">
      <style jsx>{`
        @keyframes morphBlob { 0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); } 33% { transform: translate(-20px, 15px) scale(1.15) rotate(120deg); } 66% { transform: translate(15px, -15px) scale(0.9) rotate(240deg); } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.08); } }
        .blob-anim { animation: morphBlob 8s ease-in-out infinite; }
        .float-anim { animation: floatSlow 5s ease-in-out infinite; }
        .pulse-glow { animation: pulseGlow 4s ease-in-out infinite; }
      `}</style>

      {/* 1. BAGIAN HEADER */}
      <PopulationHeader population={population} previousPopulation={previousPopulation} sortedPopulations={sortedPopulations} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />

      {/* 2. BAGIAN 4 STATS CARDS */}
      <PopulationStatsCards population={population} populationHistory={populationHistory} />

      {/* 3. BAGIAN RASIO GENDER & PERBANDINGAN TAHUN LALU */}
      <PopulationGenderRatio population={population} previousPopulation={previousPopulation} />

      {/* 4. BAGIAN KATEGORI & GRAFIK DETAIL */}
      <PopulationCategories categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} chartMode={chartMode} toggleChartMode={toggleChartMode} />
    </div>
  );
}