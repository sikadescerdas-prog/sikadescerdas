// modules/store/services/store.service.ts

import type { CreateStoreResponse, Store, UpdateStorePayload } from "../types/store.types";

export const storeService = {
  async createStore(name: string): Promise<Store> {
    const res = await fetch("/api/store/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const json: CreateStoreResponse = await res.json();

    if (!res.ok) {
      const error = new Error(json.message ?? "Gagal membuat toko.");
      Object.assign(error, { code: json.code });
      throw error;
    }

    if (!json.store) {
      throw new Error("Data toko tidak ditemukan.");
    }

    return json.store;
  },

  async getStore(): Promise<Store> {
    const res = await fetch("/api/store/settings", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const json: { code: string; message: string; store?: Store } = await res.json();

    if (!res.ok) {
      const error = new Error(json.message ?? "Gagal mengambil data toko.");
      Object.assign(error, { code: json.code });
      throw error;
    }

    if (!json.store) {
      throw new Error("Data toko tidak ditemukan.");
    }

    return json.store;
  },

  async updateStore(payload: UpdateStorePayload): Promise<Store> {
    const res = await fetch("/api/store/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const json: { code: string; message: string; store?: Store } = await res.json();

    if (!res.ok) {
      const error = new Error(json.message ?? "Gagal memperbarui data toko.");
      Object.assign(error, { code: json.code });
      throw error;
    }

    if (!json.store) {
      throw new Error("Data toko tidak ditemukan.");
    }

    return json.store;
  },
};