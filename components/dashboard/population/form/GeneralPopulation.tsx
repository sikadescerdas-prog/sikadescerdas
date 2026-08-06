// components/dashboard/population/form/GeneralPopulation.tsx

"use client";

import { calculateTotalPopulation } from "@/modules/dashboard/population/helpers/population.helper";
import { formatRibuan, parseRibuan } from "@/shared/utils/formatRibuan";

interface Props {
  totalFamilyCards: number;
  totalMale: number;
  totalFemale: number;
  onFamilyCardsChange: (value: number) => void;
  onMaleChange: (value: number) => void;
  onFemaleChange: (value: number) => void;
}

export default function GeneralPopulation({
  totalFamilyCards,
  totalMale,
  totalFemale,
  onFamilyCardsChange,
  onMaleChange,
  onFemaleChange,
}: Props) {
  const totalPopulation = calculateTotalPopulation(totalMale, totalFemale);

  return (
    <>
      <div>
        <h3 className="text-base font-semibold text-gray-900">Data Umum</h3>
        <p className="mt-1 text-sm text-gray-500">Informasi umum data kependudukan desa.</p>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <InputNumber label="Jumlah Kartu Keluarga" value={totalFamilyCards} onChange={onFamilyCardsChange} />
        <InputNumber label="Jumlah Laki-laki" value={totalMale} onChange={onMaleChange} />
        <InputNumber label="Jumlah Perempuan" value={totalFemale} onChange={onFemaleChange} />
        <InputNumber label="Total Penduduk" value={totalPopulation} disabled />
      </div>
    </>
  );
}

interface InputNumberProps {
  label: string;
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

function InputNumber({ label, value, onChange, disabled }: InputNumberProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={formatRibuan(value)}
        disabled={disabled}
        onChange={(e) => {
          const onlyNumber = e.target.value.replace(/\D/g, "");
          onChange?.(parseRibuan(onlyNumber));
        }}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>
  );
}