// components/dashboard/population/form/CategoryPopulation.tsx

"use client";

import type { PopulationCategory, PopulationDetailPayload } from "@/modules/dashboard/population/types/population.types";
import { formatRibuan, parseRibuan } from "@/shared/utils/formatRibuan";

interface Props {
  category: PopulationCategory;
  details: PopulationDetailPayload[];
  onChange: (itemId: string, value: number) => void;
}

export default function CategoryPopulation({ category, details, onChange }: Props) {
  return (
    <>
      <div>
        <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
        <p className="mt-1 text-sm text-gray-500">Lengkapi data {category.name.toLowerCase()} penduduk.</p>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-6">
        {category.population_master_items?.map((item) => {
          const value = details.find((detail) => detail.item_id === item.id)?.total ?? 0;

          return (
            <InputNumber
              key={item.id}
              label={item.name}
              value={value}
              onChange={(number) => onChange(item.id, number)}
            />
          );
        })}
      </div>
    </>
  );
}

interface InputNumberProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function InputNumber({ label, value, onChange }: InputNumberProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={formatRibuan(value)}
        onChange={(e) => {
          const onlyNumber = e.target.value.replace(/\D/g, "");
          onChange(parseRibuan(onlyNumber));
        }}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}