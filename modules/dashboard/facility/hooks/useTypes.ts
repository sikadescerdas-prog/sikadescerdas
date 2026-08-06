// modules/dashboard/facility/hooks/useTypes.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  FacilityType,
  FacilityTypeForm,
} from "../types/facility.types";

import {
  getFacilityTypes,
  createFacilityType,
  updateFacilityType,
  deleteFacilityType,
} from "../services/type.service";

export function useFacilityTypes() {
  const [types, setTypes] = useState<FacilityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // =========================
  // GET TYPES
  // =========================

  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFacilityTypes();
      setTypes(data ?? []);
    } catch (error) {
      console.error("FETCH TYPE ERROR:", error);
      setTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  // =========================
  // CREATE
  // =========================

  async function addType(data: FacilityTypeForm) {
    try {
      setIsSaving(true);
      const result = await createFacilityType(data);
      await fetchTypes();
      return result;
    } finally {
      setIsSaving(false);
    }
  }

  // =========================
  // UPDATE
  // =========================

  async function editType(id: string, data: FacilityTypeForm) {
    try {
      setIsSaving(true);
      const result = await updateFacilityType(id, data);
      await fetchTypes();
      return result;
    } finally {
      setIsSaving(false);
    }
  }

  // =========================
  // DELETE
  // =========================

  async function removeType(id: string) {
    try {
      setIsSaving(true);
      await deleteFacilityType(id);
      await fetchTypes();
    } finally {
      setIsSaving(false);
    }
  }

  return {
    types,
    loading,
    isSaving,
    refresh: fetchTypes,
    addType,
    editType,
    removeType,
  };
}