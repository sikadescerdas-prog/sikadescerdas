// modules/store/hooks/useStore.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import { storeService } from "@/modules/store/services/store.service";
import type { Store, UpdateStorePayload } from "@/modules/store/types/store.types";

export type UseStoreReturn = { store: Store | null; loading: boolean; saving: boolean; error: string | null; refetch: () => Promise<void>; updateStore: (payload: UpdateStorePayload) => Promise<Store>; };

export function useStore(): UseStoreReturn {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStore = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storeService.getStore();
      setStore(data);
    } catch (error: unknown) {
      console.error("[STORE_ERROR]:", error);
      const message = error instanceof Error ? error.message : "Gagal mengambil data toko.";
      setError(message);
      setStore(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStore = useCallback(async (payload: UpdateStorePayload): Promise<Store> => {
    try {
      setSaving(true);
      setError(null);
      const updatedStore = await storeService.updateStore(payload);
      setStore(updatedStore);
      return updatedStore;
    } catch (error: unknown) {
      console.error("[STORE_UPDATE_ERROR]:", error);
      const message = error instanceof Error ? error.message : "Gagal memperbarui data toko.";
      setError(message);
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  return { store, loading, saving, error, refetch: loadStore, updateStore };
}