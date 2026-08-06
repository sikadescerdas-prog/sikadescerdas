// components/profile/MenuProfile.tsx

"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

export type MenuVariant = "default" | "green" | "emerald" | "blue" | "danger";

export type MenuItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: MenuVariant;
};

type Props = {
  items: MenuItem[];
};

const variantStyles: Record<
  MenuVariant,
  { container: string; text: string; icon: string; arrow: string }
> = {
  default: {
    container: "bg-gray-50 hover:bg-gray-100",
    text: "text-gray-700",
    icon: "text-gray-500 group-hover:text-gray-700",
    arrow: "text-gray-400 group-hover:text-gray-600",
  },
  blue: {
    container: "bg-gray-50 hover:bg-blue-50",
    text: "text-gray-700 group-hover:text-blue-700",
    icon: "text-gray-500 group-hover:text-blue-600",
    arrow: "text-gray-400 group-hover:text-blue-600",
  },
  green: {
    container: "bg-gray-50 hover:bg-green-50",
    text: "text-gray-700 group-hover:text-green-700",
    icon: "text-gray-500 group-hover:text-green-600",
    arrow: "text-gray-400 group-hover:text-green-600",
  },
  emerald: {
    container: "bg-gray-50 hover:bg-emerald-50",
    text: "text-gray-700 group-hover:text-emerald-700",
    icon: "text-gray-500 group-hover:text-emerald-600",
    arrow: "text-gray-400 group-hover:text-emerald-600",
  },
  danger: {
    container: "bg-gray-50 hover:bg-red-50",
    text: "text-gray-700 group-hover:text-red-600",
    icon: "text-gray-500 group-hover:text-red-600",
    arrow: "text-gray-400 group-hover:text-red-600",
  },
};

export function MenuProfile({ items }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => {
        const variant = item.variant ?? "default";
        const style = variantStyles[variant];

        return (
          <button
            key={index}
            type="button"
            onClick={item.onClick}
            className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 transition-colors duration-200 ${style.container}`}
          >
            <div className="flex items-center gap-3">
              <div className={`transition-colors duration-200 ${style.icon}`}>
                {item.icon}
              </div>

              <span className={`font-medium transition-colors duration-200 ${style.text}`}>
                {item.label}
              </span>
            </div>

            <ChevronRight
              size={18}
              className={`transition-all duration-200 group-hover:translate-x-1 ${style.arrow}`}
            />
          </button>
        );
      })}
    </div>
  );
}