// app/dashboard/facility/page.tsx

"use client";

import { useState } from "react";
import HeaderFacility from "@/components/dashboard/facility/HeaderFacility";
import TableFacility from "@/components/dashboard/facility/list/TableFacility";
import FormFacility from "@/components/dashboard/facility/list/FormFacility";
import SettingsFacility from "@/components/dashboard/facility/settings/SettingsFacility";
import { useFacilities } from "@/modules/dashboard/facility/hooks/useFacilities";
import { useVillageId } from "@/modules/dashboard/village/hooks/useVillageId";
import type { Facility } from "@/modules/dashboard/facility/types/facility.types";

type ViewType = "facility" | "settings";

export default function FacilityPage() {
  const [view, setView] = useState<ViewType>("facility");
  const [formMode, setFormMode] = useState<"facility" | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility>();

  const { facilities, loading, saveFacility, removeFacility } = useFacilities();
  const { villageId } = useVillageId();

  function handleBack() {
    setSelectedFacility(undefined);
    setFormMode(null);
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <HeaderFacility />

      <div className="p-6">
        {formMode === "facility" && (
          <FormFacility
            initialData={selectedFacility}
            onBack={handleBack}
            onSubmit={async (data) => {
              if (!villageId) return;
              await saveFacility(data, selectedFacility?.id);
              handleBack();
            }}
          />
        )}

        {formMode === null && view === "settings" && (
          <SettingsFacility onBack={() => setView("facility")} />
        )}

        {formMode === null && view === "facility" && (
          <TableFacility
            facilities={facilities}
            loading={loading}
            onAdd={() => {
              setSelectedFacility(undefined);
              setFormMode("facility");
            }}
            onEdit={(data) => {
              setSelectedFacility(data);
              setFormMode("facility");
            }}
            onDelete={removeFacility}
            onSettings={() => {
              setView("settings");
            }}
          />
        )}
      </div>
    </div>
  );
}