// components/navbar/MobileMenu.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { X, ChevronDown, ChevronRight, Home, Building, Store, BookOpen, Newspaper, Grid2X2, Info } from "lucide-react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [desaOpen, setDesaOpen] = useState(false);

  if (!open) return null;

  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm md:hidden" onClick={onClose} />
      <aside className="fixed bottom-0 left-0 top-0 z-50 w-72 bg-white shadow-xl md:hidden">
        <div className="flex items-center justify-between border-b px-4 py-4">
          <span className="font-semibold text-gray-800">Menu</span>
          <button onClick={onClose} type="button" className="rounded-lg p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-1 p-3">
          {/* HOME */}
          <Link href="/" onClick={onClose} className={`flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-100 ${active("/") ? "font-semibold text-green-600" : ""}`}>
            <Home size={18} /> Beranda
          </Link>

          {/* PROFIL DESA */}
          <button onClick={() => setDesaOpen(!desaOpen)} type="button" className="flex w-full items-center justify-between rounded-lg px-3 py-3 hover:bg-gray-100">
            <span className="flex items-center gap-3"><Building size={18} /> Profil Desa</span>
            {desaOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {desaOpen && (
            <div className="ml-8 space-y-1">
              <Link href="/village" onClick={onClose} className="block rounded px-3 py-2 text-sm text-gray-600 hover:text-green-600">Profil Desa</Link>
              <Link href="/visi-misi" onClick={onClose} className="block rounded px-3 py-2 text-sm text-gray-600 hover:text-green-600">Visi & Misi</Link>
              <Link href="/stucture" onClick={onClose} className="block rounded px-3 py-2 text-sm text-gray-600 hover:text-green-600">Struktur Organisasi</Link>
              <Link href="/population" onClick={onClose} className="block rounded px-3 py-2 text-sm text-gray-600 hover:text-green-600">Infografis</Link>
              <Link href="/potential" onClick={onClose} className="block rounded px-3 py-2 text-sm text-gray-600 hover:text-green-600">Potensi Desa</Link>
            </div>
          )}

          {/* UMKM */}
          <Link href="/store" onClick={onClose} className={`flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-100 ${active("/store") ? "font-semibold text-green-600" : ""}`}>
            <Store size={18} /> UMKM
          </Link>

          {/* LITERASI */}
          <Link href="/literature" onClick={onClose} className={`flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-100 ${active("/literature") ? "font-semibold text-green-600" : ""}`}>
            <BookOpen size={18} /> Literasi
          </Link>

          {/* BERITA */}
          <Link href="/news" onClick={onClose} className={`flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-100 ${active("/news") ? "font-semibold text-green-600" : ""}`}>
            <Newspaper size={18} /> Berita
          </Link>

          {/* SERVICE */}
          <Link href="/service" onClick={onClose} className={`flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-100 ${active("/service") ? "font-semibold text-green-600" : ""}`}>
            <Grid2X2 size={18} /> Layanan
          </Link>

          {/* ABOUT */}
          <Link href="/about" onClick={onClose} className={`flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-100 ${active("/about") ? "font-semibold text-green-600" : ""}`}>
            <Info size={18} /> Tentang
          </Link>
        </div>
      </aside>
    </>
  );
}