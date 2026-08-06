// components/profile/settings/SaveProfile.tsx

"use client";

import { Loader2, Save } from "lucide-react";

interface SaveProfileProps {
  loading?: boolean;
  disabled?: boolean;
  onSave: () => void;
}

export default function SaveProfile({
  loading = false,
  disabled = false,
  onSave,
}: SaveProfileProps) {
  const isDisabled = loading || disabled;

  return (
    <button
      type="button"
      onClick={onSave}
      disabled={isDisabled}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-3.5 font-semibold text-white shadow-md shadow-green-500/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-md"
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Menyimpan...</span>
        </>
      ) : (
        <>
          <Save size={18} />
          <span>Simpan Perubahan</span>
        </>
      )}
    </button>
  );
}