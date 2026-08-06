// components/dashboard/population/ButtonSave.tsx

"use client";

import { Save } from "lucide-react";

interface Props {
  loading: boolean;
  editMode?: boolean;
  onSubmit: () => void | Promise<void>;
}

export default function ButtonSave({ loading, editMode = false, onSubmit }: Props) {
  const buttonText = loading ? "Menyimpan..." : editMode ? "Perbarui" : "Simpan";

  return (
    <div className="flex justify-end border-t pt-5">
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
      >
        <Save size={16} />
        {buttonText}
      </button>
    </div>
  );
}