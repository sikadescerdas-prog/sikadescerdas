// components/dashboard/facility/settings/SettingsFacility.tsx

"use client";

import { useState } from "react";
import { ArrowLeft, Tags, Layers } from "lucide-react";

import TableCategory from "./TableCategory";
import FormCategory from "./FormCategory";
import TableType from "./TableType";
import FormType from "./FormType";

import type {
  FacilityCategory,
  FacilityType,
} from "@/modules/dashboard/facility/types/facility.types";

interface Props {
  onBack: () => void;
}

type Menu = "category" | "type";
type FormMode = "category" | "type" | null;

export default function SettingsFacility({ onBack }: Props) {
  const [menu, setMenu] = useState<Menu>("category");
  const [formMode, setFormMode] = useState<FormMode>(null);

  const [selectedCategory, setSelectedCategory] = useState<FacilityCategory>();
  const [selectedType, setSelectedType] = useState<FacilityType>();

  function handleBack() {
    setSelectedCategory(undefined);
    setSelectedType(undefined);
    setFormMode(null);
  }

  function openCategoryForm(data?: FacilityCategory) {
    setSelectedCategory(data);
    setFormMode("category");
  }

  function openTypeForm(data?: FacilityType) {
    setSelectedType(data);
    setFormMode("type");
  }

  return (
    <div className="rounded-xl border bg-white">
      {/* FORM CATEGORY */}
      {formMode === "category" && (
        <FormCategory
          initialData={selectedCategory}
          onBack={handleBack}
          onSuccess={() => {
            handleBack();
            setMenu("category");
          }}
        />
      )}

      {/* FORM TYPE */}
      {formMode === "type" && (
        <FormType
          initialData={selectedType}
          onBack={handleBack}
          onSuccess={() => {
            handleBack();
            setMenu("type");
          }}
        />
      )}

      {/* SETTINGS HOME */}
      {formMode === null && (
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
              <h2 className="font-semibold text-gray-900">Pengaturan Fasilitas</h2>
              <p className="text-sm text-gray-500">Kelola kategori dan jenis fasilitas desa</p>
            </div>
          </div>

          <div className="space-y-6 p-6">
            {/* MENU */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setMenu("category")}
                className={`rounded-xl border p-5 text-left transition ${
                  menu === "category" ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
                }`}
              >
                <Tags size={24} className="mb-3 text-green-600" />
                <h3 className="font-semibold text-gray-900">Kategori Fasilitas</h3>
                <p className="text-sm text-gray-500">Pendidikan, kesehatan, ibadah</p>
              </button>

              <button
                type="button"
                onClick={() => setMenu("type")}
                className={`rounded-xl border p-5 text-left transition ${
                  menu === "type" ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
                }`}
              >
                <Layers size={24} className="mb-3 text-green-600" />
                <h3 className="font-semibold text-gray-900">Jenis Fasilitas</h3>
                <p className="text-sm text-gray-500">SD, TK, masjid, puskesmas</p>
              </button>
            </div>

            {/* TABLE CATEGORY */}
            {menu === "category" && (
              <TableCategory
                onAdd={() => openCategoryForm()}
                onEdit={(data) => openCategoryForm(data)}
              />
            )}

            {/* TABLE TYPE */}
            {menu === "type" && (
              <TableType
                onAdd={() => openTypeForm()}
                onEdit={(data) => openTypeForm(data)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}