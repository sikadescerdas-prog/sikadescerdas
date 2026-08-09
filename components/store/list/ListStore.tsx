// components/store/list/ListStore.tsx

"use client";

import StoreCard from "../card/StoreCard";
import { useStoreList } from "@/modules/store/hooks/useStoreList";

export default function ListStore() {
  const { stores, loading } = useStoreList();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((item) => (<div key={item} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />))}
      </div>
    );
  }

  if (!stores.length) {
    return (<div className="py-10 text-center text-slate-400">Belum ada toko</div>);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {stores.map((store) => (<StoreCard key={store.id} store={store} />))}
    </div>
  );
}