// modules/home/hooks/useHome.ts

"use client";

import { useEffect, useState } from "react";

import {
  getHomeData,
} from "@/modules/home/services/home.service";

import type {
  HomeData,
} from "@/modules/home/types/home.types";


export function useHome() {

  const [data, setData] = useState<HomeData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);



  async function loadHome() {

    try {

      setLoading(true);

      setError(null);


      const result = await getHomeData();


      setData(result);


    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data homepage"
      );


    } finally {

      setLoading(false);

    }

  }



  useEffect(() => {

    loadHome();

  }, []);



  return {

    data,

    loading,

    error,

    refresh: loadHome,

  };

}