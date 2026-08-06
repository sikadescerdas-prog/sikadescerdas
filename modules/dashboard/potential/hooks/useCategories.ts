// modules/dashboard/potential/hooks/useCategories.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  PotentialCategory,
  PotentialCategoryForm,
} from "../types/potential.types";

import {
  getPotentialCategories,
  createPotentialCategory,
  updatePotentialCategory,
  deletePotentialCategory,
} from "../services/category.service";

import { sweet } from "@/shared/utils/sweet";

export function usePotentialCategories() {
  const [categories, setCategories] = useState<PotentialCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // GET CATEGORY
  // =========================

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPotentialCategories();
      setCategories(data);
    } catch (error) {
      console.error("Fetch potential category error:", error);
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

  async function addCategory(data: PotentialCategoryForm) {
    try {
      await createPotentialCategory(data);
      await fetchCategories();
    } catch (error) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menambah kategori",
      });

      throw error;
    }
  }

  // =========================
  // UPDATE
  // =========================

  async function editCategory(id: string, data: PotentialCategoryForm) {
    try {
      await updatePotentialCategory(id, data);
      await fetchCategories();
    } catch (error) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal update kategori",
      });

      throw error;
    }
  }

  // =========================
  // DELETE
  // =========================

  async function removeCategory(id: string) {
    try {
      await deletePotentialCategory(id);
      await fetchCategories();
    } catch (error) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal hapus kategori",
      });

      throw error;
    }
  }

  return {
    categories,
    loading,
    addCategory,
    editCategory,
    removeCategory,
    refresh: fetchCategories,
  };
}