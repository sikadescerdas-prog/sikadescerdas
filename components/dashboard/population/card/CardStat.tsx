// components/dashboard/population/card/CardStat.tsx

"use client";

import { Users, UserRound, UserRoundCheck } from "lucide-react";
import { formatPopulationNumber } from "@/modules/dashboard/population/helpers/population.helper";

interface Props {
  type: "kk" | "male" | "female";
  label: string;
  value: number;
}

export default function CardStat({ type, label, value }: Props) {
  const config = {
    kk: { icon: Users, box: "bg-blue-50 border-blue-100", iconColor: "text-blue-700" },
    male: { icon: UserRound, box: "bg-sky-50 border-sky-100", iconColor: "text-sky-700" },
    female: { icon: UserRoundCheck, box: "bg-pink-50 border-pink-100", iconColor: "text-pink-700" },
  }[type];

  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-4 ${config.box}`}>
      <div className="flex items-center gap-3">
        <Icon size={22} className={config.iconColor} />
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-bold text-gray-900">{formatPopulationNumber(value)}</p>
        </div>
      </div>
    </div>
  );
}