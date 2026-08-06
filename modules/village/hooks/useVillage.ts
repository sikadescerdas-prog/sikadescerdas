// modules/village/hooks/useVillage.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import { villageService } from "../services/village.service";
import type { VillageResponse } from "../types/village.types";

interface UseVillageReturn {
  village: VillageResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVillage(): UseVillageReturn {
  const [village, setVillage] = useState<VillageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVillage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await villageService.getVillage();

      setVillage(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data desa."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await villageService.getVillage();

        if (mounted) {
          setVillage(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data desa."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    village,
    loading,
    error,
    refetch: fetchVillage,
  };
}