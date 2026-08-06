// components/store/settings/StoreHeaderForm.tsx

"use client";

import { ArrowLeft, Store } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StoreHeaderForm() {
  const router = useRouter();

  return (
    <div className="mb-6 border-b border-gray-100 pb-5">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.back()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-600" aria-label="Kembali">
          <ArrowLeft size={19} />
        </button>

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <Store size={20} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-gray-800">Pengaturan Toko</h1>
            <p className="truncate text-xs text-gray-500">Kelola informasi dan tampilan toko Anda</p>
          </div>
        </div>
      </div>
    </div>
  );
}