// modules/dashboard/structure/hooks/useGroups.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  StructureGroup,
  StructureGroupForm,
} from "@/modules/dashboard/structure/types/structure.types";

const API_URL = "/api/dashboard/structure/groups";

export function useGroups() {
  const [groups, setGroups] = useState<StructureGroup[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // GET GROUPS
  // =========================
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error("Gagal mengambil data lembaga");
      }

      const data = await res.json();
      setGroups(data.groups ?? data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // =========================
  // CREATE
  // =========================
  async function addGroup(
    payload: StructureGroupForm
  ) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Gagal menambah lembaga");
    }
    const result = await res.json();
    await fetchGroups();
    return result.group;
  }

  // =========================
  // UPDATE
  // =========================
  async function editGroup(id: string, payload: StructureGroupForm) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Gagal memperbarui lembaga");
    }

    await fetchGroups();
  }

  // =========================
  // DELETE
  // =========================
  async function removeGroup(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Gagal menghapus lembaga");
    }

    await fetchGroups();
  }

  return {
    groups,
    loading,
    fetchGroups,
    addGroup,
    editGroup,
    removeGroup,
  };
}