// components/dashboard/umkm/UMKMHeader.tsx

"use client";

import { FaStore, FaShoppingBag } from "react-icons/fa";
import type { Store, UMKMProduct } from "@/modules/dashboard/umkm/types/umkm.types";

type Props = {
  stores: Store[];
  products: UMKMProduct[];
};

export default function UMKMHeader({ stores, products }: Props) {
  const totalStores = stores?.length || 0;
  const totalProducts = products?.length || 0;

  return (
    <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 px-6 py-6 md:px-8">
      {/* glow */}
      <div className="absolute inset-0">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-indigo-500/25 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/15 backdrop-blur">
            <FaStore className="text-xl text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">UMKM Marketplace</h1>
            <p className="text-sm text-white/60">Data toko & produk sistem</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap gap-3">
          <Stat icon={<FaStore className="text-blue-400" />} label="Toko" value={totalStores} />
          <Stat
            icon={<FaShoppingBag className="text-green-400" />}
            label="Produk"
            value={totalProducts}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-white backdrop-blur">
      <div className="flex items-center gap-2 text-sm">
        {icon}
        {label}: <span className="font-bold">{value}</span>
      </div>
    </div>
  );
}