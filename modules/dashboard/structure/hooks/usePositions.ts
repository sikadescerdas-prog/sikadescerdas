// modules/dashboard/structure/hooks/usePositions.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getPositions,
  getPositionsByCategory,
  createPosition,
  updatePosition,
  deletePosition,
} from "../services/position.service";

import type {
  StructurePosition,
  StructurePositionForm,
} from "../types/structure.types";

export function usePositions(categoryId?: string) {
  const [positions, setPositions] = useState<StructurePosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = categoryId
        ? await getPositionsByCategory(categoryId)
        : await getPositions();

      setPositions(data ?? []);
    } catch (err) {
      console.error("FETCH POSITIONS ERROR:", err);

      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan"
      );
      setPositions([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  async function addPosition(data: StructurePositionForm) {
    await createPosition(data);
    await fetchPositions();
  }

  async function editPosition(id: string, data: StructurePositionForm) {
    await updatePosition(id, data);
    await fetchPositions();
  }

  async function removePosition(id: string) {
    await deletePosition(id);
    await fetchPositions();
  }

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  return {
    positions,
    loading,
    error,
    refreshPositions: fetchPositions,
    addPosition,
    editPosition,
    removePosition,
  };
}