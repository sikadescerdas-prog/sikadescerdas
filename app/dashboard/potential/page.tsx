// app/dashboard/potential/page.tsx

"use client";

import { useState } from "react";
import HeaderPotential from "@/components/dashboard/potential/HeaderPotential";
import TablePotential from "@/components/dashboard/potential/list/TablePotential";
import FormPotential from "@/components/dashboard/potential/list/FormPotential";
import SettingsPotential from "@/components/dashboard/potential/settings/SettingsPotential";
import { usePotentials } from "@/modules/dashboard/potential/hooks/usePotentials";
import { useVillageId } from "@/modules/dashboard/village/hooks/useVillageId";
import type { Potential } from "@/modules/dashboard/potential/types/potential.types";

type ViewType = "potential" | "settings";

export default function PotentialPage() {
  const [view, setView] = useState<ViewType>("potential");
  const [formMode, setFormMode] = useState<"potential" | null>(null);
  const [selectedPotential, setSelectedPotential] = useState<Potential>();

  const { potentials, loading, savePotential, removePotential } = usePotentials();
  const { villageId } = useVillageId();

  function handleBack() {
    setSelectedPotential(undefined);
    setFormMode(null);
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <HeaderPotential />

      <div className="p-6">
        {formMode === "potential" && (
          <FormPotential
            initialData={selectedPotential}
            onBack={handleBack}
            onSubmit={async (data) => {
              if (!villageId) return;
              await savePotential(data, selectedPotential?.id);
              handleBack();
            }}
          />
        )}

        {formMode === null && view === "settings" && (
          <SettingsPotential onBack={() => setView("potential")} />
        )}

        {formMode === null && view === "potential" && (
          <TablePotential
            potentials={potentials}
            loading={loading}
            onAdd={() => {
              setSelectedPotential(undefined);
              setFormMode("potential");
            }}
            onEdit={(data) => {
              setSelectedPotential(data);
              setFormMode("potential");
            }}
            onDelete={removePotential}
            onSettings={() => {
              setView("settings");
            }}
          />
        )}
      </div>
    </div>
  );
}