// components/navbar/nav.config.ts

export interface NavItem {
  href: string;
  label: string;
  hasDropdown?: boolean;
  dropdownItems?: {
    href: string;
    label: string;
  }[];
}

export const navLinks: NavItem[] = [
  { href: "/", label: "Beranda" },
  {
    href: "/village",
    label: "Profil Desa",
    hasDropdown: true,
    dropdownItems: [
      { href: "/village", label: "Profil Desa" },
      { href: "/visi-misi", label: "Visi & Misi" },
      { href: "/stucture", label: "Struktur Organisasi" },
      { href: "/population", label: "Infografis" },
      { href: "/potential", label: "Potensi Desa" },
    ],
  },
  { href: "/store", label: "UMKM" },
  { href: "/literature", label: "Literasi" },
  { href: "/news", label: "Berita" },
  { href: "/service", label: "Layanan" },
  { href: "/about", label: "Tentang" },
];