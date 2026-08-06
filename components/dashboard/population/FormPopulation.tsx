// components/dashboard/population/FormPopulation.tsx

"use client";

import { useEffect, useState } from "react";
import HeaderForm from "./form/HeaderFormPopulation";
import GeneralPopulation from "./form/GeneralPopulation";
import CategoryPopulation from "./form/CategoryPopulation";
import ButtonSavePopulation from "./form/ButtonSavePopulation";
import { usePopulation } from "@/modules/dashboard/population/hooks/usePopulation";
import type { Population, PopulationDetailPayload, CreatePopulationPayload } from "@/modules/dashboard/population/types/population.types";

interface Props {
  initialData?: Population;
  onBack: () => void;
}

export default function FormPopulation({ initialData, onBack }: Props) {
  const { master, savePopulation, isSaving, populations, fetchPopulations, loading } = usePopulation();

  const [year, setYear] = useState(new Date().getFullYear());
  const [totalFamilyCards, setTotalFamilyCards] = useState(0);
  const [male, setMale] = useState(0);
  const [female, setFemale] = useState(0);
  const [details, setDetails] = useState<PopulationDetailPayload[]>([]);

  useEffect(() => {
    fetchPopulations();
  }, [fetchPopulations]);

  useEffect(() => {
    if (initialData) {
      setYear(Number(initialData.year));
      setTotalFamilyCards(Number(initialData.total_family_cards || 0));
      setMale(Number(initialData.total_male || 0));
      setFemale(Number(initialData.total_female || 0));
      setDetails(
        initialData.village_population_details?.map((item) => ({
          item_id: item.item_id,
          total: Number(item.total || 0),
          sort_order: item.sort_order,
        })) ?? []
      );
      return;
    }

    if (!loading) {
      if (populations && populations.length > 0) {
        const latestYear = Math.max(...populations.map((p) => Number(p.year)));
        const nextYear = latestYear + 1;
        
        setYear(nextYear);

        const targetPreviousYear = nextYear - 1;
        const previousYearData = populations.find((p) => Number(p.year) === targetPreviousYear);

        if (previousYearData) {
          setTotalFamilyCards(Number(previousYearData.total_family_cards || 0));
          setMale(Number(previousYearData.total_male || 0));
          setFemale(Number(previousYearData.total_female || 0));
          setDetails(
            previousYearData.village_population_details?.map((item) => ({
              item_id: item.item_id,
              total: Number(item.total || 0),
              sort_order: item.sort_order,
            })) ?? []
          );
        }
      } else {
        setYear(new Date().getFullYear());
        setTotalFamilyCards(0);
        setMale(0);
        setFemale(0);
        setDetails([]);
      }
    }
  }, [initialData, populations, loading]);

  useEffect(() => {
    if (!initialData && populations && populations.length > 0) {
      const targetPreviousYear = Number(year) - 1;
      const previousYearData = populations.find((p) => Number(p.year) === targetPreviousYear);

      if (previousYearData) {
        setTotalFamilyCards(Number(previousYearData.total_family_cards || 0));
        setMale(Number(previousYearData.total_male || 0));
        setFemale(Number(previousYearData.total_female || 0));
        setDetails(
          previousYearData.village_population_details?.map((item) => ({
            item_id: item.item_id,
            total: Number(item.total || 0),
            sort_order: item.sort_order,
          })) ?? []
        );
      } else {
        setTotalFamilyCards(0);
        setMale(0);
        setFemale(0);
        setDetails([]);
      }
    }
  }, [year, initialData, populations]);

  function handleDetailChange(itemId: string, total: number) {
    setDetails((prev) => {
      const exists = prev.find((item) => item.item_id === itemId);
      if (exists) {
        return prev.map((item) => (item.item_id === itemId ? { ...item, total } : item));
      }
      return [...prev, { item_id: itemId, total, sort_order: 0 }];
    });
  }

  async function handleSubmit() {
    const completeDetails: PopulationDetailPayload[] = [];

    master.forEach((category) => {
      category.population_master_items?.forEach((item) => {
        const existingDetail = details.find((d) => d.item_id === item.id);
        completeDetails.push({
          item_id: item.id,
          total: existingDetail ? Number(existingDetail.total || 0) : 0,
          sort_order: item.sort_order || 0,
        });
      });
    });

    const payload: Omit<CreatePopulationPayload, "village_id"> = {
      year,
      total_family_cards: Number(totalFamilyCards || 0),
      total_male: Number(male || 0),
      total_female: Number(female || 0),
      details: completeDetails,
    };

    await savePopulation(payload, initialData?.id);
    onBack();
  }

  if (loading && !initialData) {
    return (
      <div className="rounded-xl border bg-white p-6 space-y-6 animate-pulse">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded w-28"></div>
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-48 bg-gray-200 rounded-xl"></div>
          <div className="h-48 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white">
      <HeaderForm isEdit={!!initialData} year={year} onYearChange={setYear} onBack={onBack} />

      <div className="space-y-6 p-6">
        <GeneralPopulation
          totalFamilyCards={totalFamilyCards}
          totalMale={male}
          totalFemale={female}
          onFamilyCardsChange={setTotalFamilyCards}
          onMaleChange={setMale}
          onFemaleChange={setFemale}
        />

        {master.map((category) => (
          <CategoryPopulation
            key={category.id}
            category={category}
            details={details}
            onChange={handleDetailChange}
          />
        ))}

        <ButtonSavePopulation loading={isSaving} editMode={!!initialData} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}