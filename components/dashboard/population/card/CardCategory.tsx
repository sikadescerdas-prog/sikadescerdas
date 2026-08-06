// components/dashboard/population/card/CardCategory.tsx

"use client";

import { formatPopulationNumber } from "@/modules/dashboard/population/helpers/population.helper";
import type { PopulationCategory, PopulationDetail } from "@/modules/dashboard/population/types/population.types";

interface Props {
  category: PopulationCategory;
  details: PopulationDetail[];
}

export default function CardCategory({ category, details }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
      <h4 className="mb-4 font-semibold text-gray-900">{category.name}</h4>

      <div className="space-y-3">
        {category.population_master_items?.map((item) => {
          const detailItem = details.find((d) => d.item_id === item.id);
          const totalValue = detailItem?.total ?? 0;

          return (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-2 last:border-0">
              <span className="text-sm text-gray-600">{item.name}</span>
              <span className="font-semibold text-gray-900">{formatPopulationNumber(totalValue)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}