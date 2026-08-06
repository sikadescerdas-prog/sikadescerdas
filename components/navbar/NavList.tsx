// components/navbar/NavList.tsx

"use client";

import NavLink from "./NavLink";
import { navLinks } from "./nav.config";

export default function NavList() {
  return (
    <nav className="flex items-center gap-2">
      {navLinks.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </nav>
  );
}