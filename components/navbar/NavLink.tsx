// components/navbar/NavLink.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { NavItem } from "./nav.config";

interface NavLinkProps {
  item: NavItem;
}

export default function NavLink({ item }: NavLinkProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navClassName = `flex items-center px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
    active ? "text-white bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] shadow-lg shadow-green-500/25" : "text-slate-600 hover:text-[#25C95F] hover:bg-slate-100"
  }`;

  return (
    <div ref={ref} className="relative">
      {item.hasDropdown ? (
        <button type="button" onClick={() => setOpen((value) => !value)} className={`${navClassName} gap-1.5`}>
          <span>{item.label}</span>
          <ChevronDown size={15} strokeWidth={2} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      ) : (
        <Link href={item.href} className={navClassName}>
          {item.label}
        </Link>
      )}

      {item.hasDropdown && open && item.dropdownItems && item.dropdownItems.length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl z-50">
          {item.dropdownItems.map((subItem) => {
            const subActive = subItem.href === "/" ? pathname === "/" : pathname === subItem.href || pathname.startsWith(`${subItem.href}/`);

            return (
              <Link
                key={subItem.href}
                href={subItem.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 text-sm transition-colors ${
                  subActive ? "bg-green-50 text-[#25C95F] font-semibold" : "text-slate-600 hover:bg-green-50 hover:text-[#25C95F]"
                }`}
              >
                {subItem.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}