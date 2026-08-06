// components/profile/settings/MapsProfile.tsx

"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const Maps = dynamic(
  () => import("@/components/ui/Maps"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-56 items-center justify-center rounded-xl border text-sm text-gray-400">
        Memuat peta...
      </div>
    ),
  }
);

interface MapsProfileProps {
  latitude: number | null;
  longitude: number | null;
  onSelect: (lat: number, lng: number) => void;
}

export default function MapsProfile({
  latitude,
  longitude,
  onSelect,
}: MapsProfileProps) {
  const [open, setOpen] = useState(false);

  const isSelected = latitude !== null && longitude !== null;

  const handleSelect = (data: { lat: number; lng: number }) => {
    onSelect(data.lat, data.lng);
  };

  const formatLocation = () => {
    if (!isSelected) return "Pilih lokasi";

    return `${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}`;
  };

  return (
    <div className="w-full pb-0">
      <div className="grid grid-cols-12 items-center border-b py-4">
        <div className="col-span-4 text-sm font-medium text-gray-500">
          Lokasi
        </div>

        <div className="col-span-8">
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="flex cursor-pointer items-center justify-between hover:text-green-600"
          >
            <span
              className={`text-sm ${
                isSelected
                  ? "font-medium text-green-600"
                  : "text-gray-400"
              }`}
            >
              {formatLocation()}
            </span>

            <ChevronRight
              size={16}
              className={`transition-transform ${
                open ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {open && (
        <div className="py-4">
          <Maps
            value={
              isSelected
                ? {
                    lat: latitude!,
                    lng: longitude!,
                  }
                : undefined
            }
            onSelect={handleSelect}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}