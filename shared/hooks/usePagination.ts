// shared/hooks/usePagination.ts

"use client";

import { useState, useCallback } from "react";

export interface PaginationState { page: number; limit: number; total: number; totalPages: number; }
interface UsePaginationOptions { page?: number; limit?: number; }

export function usePagination(options: UsePaginationOptions = {}) {
  const { page = 1, limit = 10 } = options;

  const [pagination, setPagination] = useState<PaginationState>({ page, limit, total: 0, totalPages: 0 });

  const updatePagination = useCallback((data: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...data }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination({ page, limit, total: 0, totalPages: 0 });
  }, [page, limit]);

  return { pagination, setPagination: updatePagination, resetPagination };
}