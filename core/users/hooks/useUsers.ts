// core/users/hooks/useUsers.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchUsersApi, DashboardUser } from "../services/users.services";

export function useUsers() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsersApi();
      setUsers(data);
    } catch (err: any) {
      console.error("Error loading users:", err);
      setError(err.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, loading, error, refreshUsers: loadUsers };
}