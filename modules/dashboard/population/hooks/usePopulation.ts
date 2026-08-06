// modules/dashboard/population/hooks/usePopulation.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getPopulations,
  getPopulationMaster,
  getPopulationDetail,
  createPopulation,
  updatePopulation,
  deletePopulation,
  savePopulationDetail,
} from "../services/population.service";
import type {
  Population,
  PopulationCategory,
  PopulationDetail,
  CreatePopulationPayload,
  PopulationDetailPayload,
} from "../types/population.types";
import { sweet } from "@/shared/utils/sweet";

export function usePopulation() {
  const [populations, setPopulations] = useState<Population[]>([]);
  const [master, setMaster] = useState<PopulationCategory[]>([]);
  const [details, setDetails] = useState<PopulationDetail[]>([]);
  const [currentVillageId, setCurrentVillageId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // GET CURRENT VILLAGE
  // =========================
  useEffect(() => {
    async function fetchVillage() {
      try {
        const response = await fetch("/api/dashboard/village");
        const json = await response.json();

        if (json.data?.id) {
          setCurrentVillageId(json.data.id);
        }
      } catch (error) {
        console.error("FETCH VILLAGE ERROR:", error);
      }
    }

    fetchVillage();
  }, []);

  // =========================
  // GET POPULATIONS
  // =========================
  const fetchPopulations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPopulations();
      setPopulations(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data penduduk"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // GET MASTER
  // =========================
  const fetchMaster = useCallback(async () => {
    try {
      const data = await getPopulationMaster();
      setMaster(data);
    } catch (error) {
      console.error("MASTER POPULATION ERROR:", error);
    }
  }, []);

  // =========================
  // GET DETAIL
  // =========================
  const fetchDetail = useCallback(async (populationId: string) => {
    try {
      const data = await getPopulationDetail(populationId);
      setDetails(data);
      return data;
    } catch (error) {
      console.error("DETAIL POPULATION ERROR:", error);
      return [];
    }
  }, []);

  // =========================
  // SAVE POPULATION
  // =========================
  async function savePopulation(
    payload: Omit<CreatePopulationPayload, "village_id">,
    id?: string
  ) {
    try {
      if (!currentVillageId) {
        throw new Error("Desa belum tersedia");
      }

      setIsSaving(true);

      sweet.loading({
        title: "Menyimpan...",
        text: "Menyimpan data penduduk",
      });

      // Sanitasi data: ubah nilai kosong/undefined/null menjadi 0 secara otomatis
      const sanitizedDetails = payload.details?.map((item) => ({
        ...item,
        total: Number(item.total || 0),
        sort_order: Number(item.sort_order || 0),
      }));

      const dataPayload: CreatePopulationPayload = {
        village_id: currentVillageId,
        ...payload,
        total_family_cards: Number(payload.total_family_cards || 0),
        total_male: Number(payload.total_male || 0),
        total_female: Number(payload.total_female || 0),
        details: sanitizedDetails,
      };

      const result = id
        ? await updatePopulation(id, dataPayload)
        : await createPopulation(dataPayload);

      sweet.close();
      sweet.success({
        title: "Berhasil",
        text: "Data penduduk berhasil disimpan",
      });

      await fetchPopulations();
      return result;
    } catch (error) {
      sweet.close();
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan data penduduk",
      });

      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  // =========================
  // DELETE
  // =========================
  async function removePopulation(id: string) {
    try {
      const confirmed = await sweet.confirmDanger({
        title: "Hapus data penduduk?",
        text: "Data yang sudah dihapus tidak dapat dikembalikan",
        confirmButtonText: "Hapus",
        cancelText: "Batal",
      });

      if (!confirmed) return;

      await deletePopulation(id);

      sweet.success({
        title: "Berhasil",
        text: "Data penduduk berhasil dihapus",
      });

      await fetchPopulations();
    } catch (error) {
      sweet.error({
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menghapus data penduduk",
      });

      throw error;
    }
  }

  // =========================
  // SAVE DETAIL
  // =========================
  async function saveDetail(
    populationId: string,
    detailPayloads: PopulationDetailPayload[]
  ) {
    const data = await savePopulationDetail(populationId, detailPayloads);
    setDetails(data);
    return data;
  }

  useEffect(() => {
    fetchPopulations();
    fetchMaster();
  }, [fetchPopulations, fetchMaster]);

  return {
    populations,
    master,
    details,
    loading,
    isSaving,
    error,
    currentVillageId,
    fetchPopulations,
    fetchMaster,
    fetchDetail,
    savePopulation,
    removePopulation,
    saveDetail,
  };
}