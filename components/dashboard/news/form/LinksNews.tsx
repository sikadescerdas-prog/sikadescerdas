// components/dashboard/news/form/LinksNews.tsx

"use client";

import { Plus, Trash2 } from "lucide-react";
import type { NewsLink } from "@/modules/dashboard/news/types/news.types";

interface Props {
  links: NewsLink[];
  onAdd: () => void;
  onUpdate: (index: number, key: "platform" | "url", value: string) => void;
  onDelete: (index: number) => void;
}

const platforms = [
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "website", label: "Website" },
  { value: "x", label: "X (Twitter)" },
];

export default function LinksNews({
  links,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Link Media</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tambahkan tautan Youtube, Instagram, TikTok, Website, dan lainnya.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-50"
        >
          <Plus size={16} />
          Tambah
        </button>
      </div>

      {links.length > 0 && (
        <div className="space-y-3">
          {links.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row"
            >
              <select
                value={item.platform ?? ""}
                onChange={(e) => onUpdate(index, "platform", e.target.value)}
                className="w-full rounded-lg border px-4 py-2 text-sm text-gray-700 outline-none focus:border-green-500 md:w-56"
              >
                <option value="">Pilih Platform</option>
                {platforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>

              <input
                value={item.url}
                onChange={(e) => onUpdate(index, "url", e.target.value)}
                placeholder="https://..."
                className="flex-1 rounded-lg border px-4 py-2 text-sm outline-none focus:border-green-500"
              />

              <button
                type="button"
                onClick={() => onDelete(index)}
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}