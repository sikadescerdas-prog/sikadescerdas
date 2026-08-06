// modules/dashboard/home/hooks/useDashboard.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardData } from "../types/dashboard.types";
import { getDashboardData } from "../services/dashboard.service";

/**
 * Custom hook standar menggunakan useState & useEffect untuk mengambil data dashboard.
 */
export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    try {
      const response = await getDashboardData();
      if (response && response.success) {
        setDashboardData(response.data);
      } else {
        setIsError(true);
        setErrorMessage(response?.message || "Gagal memuat data dashboard.");
      }
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err.message || "Terjadi kesalahan pada sistem.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboardData,
    isLoading,
    isError,
    errorMessage,
    refetch: fetchDashboard,
  };
}