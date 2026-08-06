// modules/dashboard/facility/hooks/useCategories.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  FacilityCategory,
  FacilityCategoryForm,
} from "../types/facility.types";

import {
  getFacilityCategories,
  createFacilityCategory,
  updateFacilityCategory,
  deleteFacilityCategory,
} from "../services/category.service";

export function useFacilityCategories() {
  const [categories, setCategories] = useState<FacilityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // =========================
  // GET CATEGORIES
  // =========================

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFacilityCategories();
      setCategories(data ?? []);
    } catch (error) {
      console.error("FETCH CATEGORY ERROR:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // =========================
  // CREATE
  // =========================

  async function addCategory(data: FacilityCategoryForm) {
    try {
      setIsSaving(true);
      const result = await createFacilityCategory(data);
      await fetchCategories();
      return result;
    } finally {
      setIsSaving(false);
    }
  }

  // =========================
  // UPDATE
  // =========================

  async function editCategory(id: string, data: FacilityCategoryForm) {
    try {
      setIsSaving(true);
      const result = await updateFacilityCategory(id, data);
      await fetchCategories();
      return result;
    } finally {
      setIsSaving(false);
    }
  }

  // =========================
  // DELETE
  // =========================

  async function removeCategory(id: string) {
    try {
      setIsSaving(true);
      await deleteFacilityCategory(id);
      await fetchCategories();
    } finally {
      setIsSaving(false);
    }
  }

  return {
    categories,
    loading,
    isSaving,
    refresh: fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
  };
}