// components/dashboard/profile/SaveVillage.tsx

"use client";

import { FaSave } from "react-icons/fa";

type Props = {
  isSaving?: boolean;
  onSave: () => void;
};

export default function SaveVillage({ isSaving = false, onSave }: Props) {
  return (
    <div className="animate-fade-up delay-5">
      <div className="flex justify-end pt-3">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="relative flex items-center gap-2.5 rounded-xl bg-emerald-500 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-600 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Menyimpan...</span>
            </span>
          ) : (
            <>
              <FaSave className="h-4 w-4" />
              <span>Simpan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}