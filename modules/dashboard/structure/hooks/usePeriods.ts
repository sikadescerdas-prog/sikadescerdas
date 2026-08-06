// modules/dashboard/structure/hooks/usePeriods.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  StructurePeriod,
  StructurePeriodForm,
} from "../types/structure.types";

import {
  getPeriods,
  createPeriod,
  updatePeriod,
  deletePeriod,
} from "../services/period.service";

export function usePeriods() {
  const [periods, setPeriods] = useState<StructurePeriod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // FETCH PERIODS
  // =====================================================

  const fetchPeriods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPeriods();

      setPeriods(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH PERIOD ERROR:", err);

      setError(
        err instanceof Error ? err.message : "Gagal mengambil periode"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  // =====================================================
  // CREATE
  // =====================================================

  const addPeriod = async (data: StructurePeriodForm) => {
    await createPeriod(data);
    await fetchPeriods();
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const editPeriod = async (id: string, data: StructurePeriodForm) => {
    await updatePeriod(id, data);
    await fetchPeriods();
  };

  // =====================================================
  // DELETE
  // =====================================================

  const removePeriod = async (id: string) => {
    await deletePeriod(id);
    await fetchPeriods();
  };

  return {
    periods,
    loading,
    error,
    refreshPeriods: fetchPeriods,
    addPeriod,
    editPeriod,
    removePeriod,
  };
}