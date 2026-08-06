// components/dashboard/potential/settings/SettingsPotential.tsx

"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import TableCategory from "./TableCateogry";
import FormCategory from "./FormCategory";
import type { PotentialCategory } from "@/modules/dashboard/potential/types/potential.types";

interface Props {
  onBack: () => void;
}

export default function SettingsPotential({ onBack }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<PotentialCategory>();
  const [showForm, setShowForm] = useState(false);

  function handleBack() {
    setSelectedCategory(undefined);
    setShowForm(false);
  }

  return (
    <div className="rounded-xl border bg-white">
      {/* FORM CATEGORY */}
      {showForm && (
        <FormCategory
          initialData={selectedCategory}
          onBack={handleBack}
          onSuccess={handleBack}
        />
      )}

      {/* SETTINGS HOME */}
      {!showForm && (
        <>
          {/* HEADER */}
          <div className="flex items-center gap-3 border-b px-6 py-4">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border p-2 hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h2 className="font-semibold text-gray-900">Pengaturan Potensi</h2>
              <p className="text-sm text-gray-500">Kelola kategori potensi desa</p>
            </div>
          </div>

          <div className="p-6">
            <TableCategory
              onAdd={() => {
                setSelectedCategory(undefined);
                setShowForm(true);
              }}
              onEdit={(data) => {
                setSelectedCategory(data);
                setShowForm(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}