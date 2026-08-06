// app/dashboard/structure/page.tsx

"use client";

import { useState } from "react";
import FormMember from "@/components/dashboard/structure/list/FormMember";
import FormPeriod from "@/components/dashboard/structure/periods/FormPeriod";
import FormPosition from "@/components/dashboard/structure/positions/FormPosition";
import HeaderStructure from "@/components/dashboard/structure/HeaderStructure";
import TabStructure, { type TabType } from "@/components/dashboard/structure/TabStructure";
import { useMembers } from "@/modules/dashboard/structure/hooks/useMembers";
import { usePeriods } from "@/modules/dashboard/structure/hooks/usePeriods";
import { usePositions } from "@/modules/dashboard/structure/hooks/usePositions";
import { useCategories } from "@/modules/dashboard/structure/hooks/useCategories";
import { useGroups } from "@/modules/dashboard/structure/hooks/useGroups";
import { useVillageId } from "@/modules/dashboard/village/hooks/useVillageId";
import type {
  StructureMember,
  StructurePeriod,
  StructurePosition,
} from "@/modules/dashboard/structure/types/structure.types";

export default function StructurePage() {
  const [activeTab, setActiveTab] = useState<TabType>("list");
  const [formMode, setFormMode] = useState<"member" | "period" | "position" | null>(null);

  const [selectedMember, setSelectedMember] = useState<StructureMember>();
  const [selectedPeriod, setSelectedPeriod] = useState<StructurePeriod>();
  const [selectedPosition, setSelectedPosition] = useState<StructurePosition>();

  const { periods, addPeriod, editPeriod } = usePeriods();
  const { positions, addPosition, editPosition } = usePositions();
  const { categories } = useCategories();
  const { groups, addGroup } = useGroups();
  const { photoPreview, updatePhoto, deletePhoto, saveMember } = useMembers();
  const { villageId } = useVillageId();

  function handleBack() {
    setSelectedMember(undefined);
    setSelectedPeriod(undefined);
    setSelectedPosition(undefined);
    setFormMode(null);
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <HeaderStructure />

      <div className="p-6">
        {formMode === "member" && (
          <FormMember
            initialData={selectedMember}
            periods={periods}
            positions={positions}
            photoPreview={photoPreview}
            onUpload={updatePhoto}
            onDeletePhoto={() => deletePhoto(selectedMember?.photo_public_id)}
            onBack={handleBack}
            onSubmit={async (data) => {
              if (!villageId) return;
              await saveMember(data, villageId, selectedMember?.id);
              handleBack();
            }}
          />
        )}

        {formMode === "period" && (
          <FormPeriod
            initialData={selectedPeriod}
            onBack={handleBack}
            onSubmit={async (data) => {
              if (selectedPeriod) {
                await editPeriod(selectedPeriod.id, data);
              } else {
                await addPeriod(data);
              }
              handleBack();
            }}
          />
        )}

        {formMode === "position" && (
          <FormPosition
            initialData={selectedPosition}
            categories={categories}
            groups={groups}
            positions={positions}
            addGroup={addGroup}
            onBack={handleBack}
            onSubmit={async (data) => {
              if (selectedPosition) {
                await editPosition(selectedPosition.id, data);
              } else {
                await addPosition(data);
              }
              handleBack();
            }}
          />
        )}

        {formMode === null && (
          <TabStructure
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddMember={() => {
              setSelectedMember(undefined);
              setFormMode("member");
            }}
            onEditMember={(data) => {
              setSelectedMember(data);
              setFormMode("member");
            }}
            onAddPeriod={() => {
              setSelectedPeriod(undefined);
              setFormMode("period");
            }}
            onEditPeriod={(data) => {
              setSelectedPeriod(data);
              setFormMode("period");
            }}
            onAddPosition={() => {
              setSelectedPosition(undefined);
              setFormMode("position");
            }}
            onEditPosition={(data) => {
              setSelectedPosition(data);
              setFormMode("position");
            }}
          />
        )}
      </div>
    </div>
  );
}