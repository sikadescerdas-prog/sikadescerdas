// app/store/settings/page.tsx

"use client";

import { Loader2 } from "lucide-react";
import { useStore } from "@/modules/store/hooks/useStore";
import type { UpdateStorePayload } from "@/modules/store/types/store.types";
import StoreForm from "@/components/store/settings/StoreForm";
import { sweet } from "@/shared/utils/sweet";

export default function StoreSettingsPage() {
  const { store, loading, saving, error, updateStore } = useStore();

  const handleSubmit = async (data: UpdateStorePayload) => {
    if (!store) return;

    try {
      await updateStore(data);
      await sweet.success({ title: "Berhasil", text: "Informasi toko berhasil disimpan." });
    } catch (error: unknown) {
      console.error("[STORE_SETTINGS_SAVE_ERROR]:", error);
      await sweet.error({ title: "Gagal Menyimpan", text: error instanceof Error ? error.message : "Gagal memperbarui informasi toko." });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-gray-500">
        <Loader2 size={30} className="animate-spin text-green-600" />
        <span className="font-medium">Memuat pengaturan toko...</span>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-gray-500">
        {error || "Data toko tidak ditemukan."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
          <div className="p-6">
            <StoreForm store={store} onSubmit={handleSubmit} saving={saving} />
          </div>
        </div>
      </div>
    </div>
  );
}