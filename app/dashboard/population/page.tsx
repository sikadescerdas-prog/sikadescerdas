// app/dashboard/population/page.tsx

"use client";

import { useState } from "react";
import HeaderPopulation from "@/components/dashboard/population/HeaderPopulation";
import ListPopulation from "@/components/dashboard/population/ListPopulation";
import FormPopulation from "@/components/dashboard/population/FormPopulation";
import type { Population } from "@/modules/dashboard/population/types/population.types";

export default function PopulationPage() {
  const [formMode, setFormMode] = useState<"population" | null>(null);
  const [selectedPopulation, setSelectedPopulation] = useState<Population>();

  function handleBack() {
    setSelectedPopulation(undefined);
    setFormMode(null);
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <HeaderPopulation />

      <div className="p-6">
        {formMode === "population" && (
          <FormPopulation
            initialData={selectedPopulation}
            onBack={handleBack}
          />
        )}

        {formMode === null && (
          <ListPopulation
            onAdd={() => {
              setSelectedPopulation(undefined);
              setFormMode("population");
            }}
            onEdit={(data) => {
              setSelectedPopulation(data);
              setFormMode("population");
            }}
          />
        )}
      </div>
    </div>
  );
}