// components/dashboard/structure/StructureTab.tsx

"use client";

import MemberTable from "./list/TableMember";
import PeriodTable from "./periods/TablePeriod";
import TabPosition from "./positions/TabPosition";

import {
  Settings2,
  UserRoundPlus,
} from "lucide-react";

import type {
  StructureMember,
  StructurePeriod,
  StructurePosition,
} from "@/modules/dashboard/structure/types/structure.types";

export type TabType = "list" | "period" | "position";

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onAddMember: () => void;
  onEditMember: (data: StructureMember) => void;
  onAddPeriod: () => void;
  onEditPeriod: (data: StructurePeriod) => void;
  onAddPosition: () => void;
  onEditPosition: (data: StructurePosition) => void;
}

const TABS = [
  {
    id: "list" as const,
    label: "List Pengurus",
    description: "Kelola data pejabat dan pengurus desa",
    icon: UserRoundPlus,
  },
  {
    id: "position" as const,
    label: "Pengaturan",
    description: "Kelola periode dan struktur organisasi desa",
    icon: Settings2,
  },
];

export default function TabStructure({
  activeTab,
  setActiveTab,
  onAddMember,
  onEditMember,
  onAddPeriod,
  onEditPeriod,
  onAddPosition,
  onEditPosition,
}: Props) {
  return (
    <div className="space-y-6">
      {/* NAVIGASI */}
      <div className="flex flex-wrap gap-3 border-b border-gray-200">
        {TABS.map((tab) => {
          const active =
            tab.id === "position"
              ? activeTab === "position" || activeTab === "period"
              : activeTab === "list";

          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-4 text-sm font-semibold transition ${
                active
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon size={18} />
              {tab.label}

              {active && (
                <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* KONTEN */}
      <div>
        {activeTab === "list" && (
          <MemberTable
            onAdd={onAddMember}
            onEdit={onEditMember}
          />
        )}

        {(activeTab === "period" || activeTab === "position") && (
          <div className="space-y-6">
            {/* PENGATURAN PERIODE */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-5 py-4">
                <h3 className="font-semibold text-gray-900">
                  Pengaturan Masa Periode
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Kelola periode jabatan pengurus desa.
                </p>
              </div>

              <div className="p-5">
                <PeriodTable
                  onAdd={onAddPeriod}
                  onEdit={onEditPeriod}
                />
              </div>
            </section>

            {/* PENGATURAN STRUKTUR */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-5 py-4">
                <h3 className="font-semibold text-gray-900">
                  Pengaturan Struktur Desa
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Kelola jabatan dan susunan organisasi pemerintahan desa.
                </p>
              </div>

              <div className="p-5">
                <TabPosition
                  onAdd={onAddPosition}
                  onEdit={onEditPosition}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}