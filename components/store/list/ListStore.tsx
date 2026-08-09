// components/store/list/ListStore.tsx

"use client";

import { Store } from "lucide-react";
import StoreCard from "../card/StoreCard";
import { useStoreList } from "@/modules/store/hooks/useStoreList";

export default function ListStore() {
  const { stores, loading } = useStoreList();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stores.length) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-gradient-to-b from-white via-emerald-50/30 to-white px-6 py-16 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 shadow-lg">
          <Store size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Belum Ada Toko</h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
          Belum ada toko yang tersedia atau tidak ada toko yang sesuai dengan filter yang dipilih.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  );
}