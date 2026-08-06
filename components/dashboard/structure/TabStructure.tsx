// components/dashboard/structure/StructureTab.tsx

"use client";

import MemberTable from "./list/TableMember";
import PeriodTable from "./periods/TablePeriod";
import TabPosition from "./positions/TabPosition";

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
  { id: "list" as const, label: "List Pengurus", color: "blue" },
  { id: "period" as const, label: "Masa Periode", color: "orange" },
  { id: "position" as const, label: "Struktur Desa", color: "green" },
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
      {/* TAB */}
      <div className="flex rounded-t-xl bg-white">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-4 text-sm font-semibold transition ${
                active
                  ? tab.color === "blue"
                    ? "text-blue-600"
                    : tab.color === "orange"
                    ? "text-orange-600"
                    : "text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}

              {active && (
                <span
                  className={`absolute bottom-0 left-0 h-[3px] w-full ${
                    tab.color === "blue"
                      ? "bg-blue-600"
                      : tab.color === "orange"
                      ? "bg-orange-500"
                      : "bg-green-600"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div>
        {activeTab === "list" && <MemberTable onAdd={onAddMember} onEdit={onEditMember} />}

        {activeTab === "period" && <PeriodTable onAdd={onAddPeriod} onEdit={onEditPeriod} />}

        {activeTab === "position" && <TabPosition onAdd={onAddPosition} onEdit={onEditPosition} />}
      </div>
    </div>
  );
}