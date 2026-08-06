// components/store/settings/StoreSaveButton.tsx

"use client";

import { Loader2, Save } from "lucide-react";

type StoreSaveButtonProps = { saving?: boolean; disabled?: boolean; };

export default function StoreSaveButton({ saving = false, disabled = false }: StoreSaveButtonProps) {
  return (
    <div className="border-t border-gray-100 pt-6">
      <button
        type="submit"
        disabled={saving || disabled}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Menyimpan...
          </>
        ) : (
          <>
            <Save size={18} />
            Simpan Perubahan
          </>
        )}
      </button>
    </div>
  );
}