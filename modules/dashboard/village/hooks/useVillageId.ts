// modules/dashboard/hooks/useIdVillage.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import { getVillageProfile } from "../services/village.service";

export function useVillageId() {
  const [villageId, setVillageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVillageId = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getVillageProfile();
      setVillageId(data.id ?? null);
    } catch (error) {
      console.error("GET VILLAGE ID ERROR:", error);
      setVillageId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVillageId();
  }, [fetchVillageId]);

  return {
    villageId,
    loading,
    reload: fetchVillageId,
  };
}