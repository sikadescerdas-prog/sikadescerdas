// modules/services/hooks/useServices.ts

"use client";

import { useCallback, useMemo, useState } from "react";

import { services } from "../data/services.data";
import type { Service } from "../types/service.types";

export function useServices() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const categories = useMemo(() => {
    return [...new Set(services.map((item) => item.category))].sort();
  }, []);

  const filteredServices = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return services.filter((item) => {
      const matchKeyword =
        search === "" ||
        item.title.toLowerCase().includes(search) ||
        item.subtitle.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search);

      const matchCategory =
        category === "" || item.category === category;

      return matchKeyword && matchCategory;
    });
  }, [keyword, category]);

  const openService = useCallback((service: Service) => {
    setSelectedService(service);
  }, []);

  const closeService = useCallback(() => {
    setSelectedService(null);
  }, []);

  const clearFilters = useCallback(() => {
    setKeyword("");
    setCategory("");
  }, []);

  const hasFilters =
    keyword.trim().length > 0 || category.length > 0;

  return {
    services,
    filteredServices,
    categories,

    totalServices: services.length,
    totalFiltered: filteredServices.length,

    keyword,
    setKeyword,

    category,
    setCategory,

    selectedService,
    openService,
    closeService,

    hasFilters,
    clearFilters,
  };
}