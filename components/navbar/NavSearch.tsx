// components/navbar/NavSearch.tsx

"use client";

import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import SearchOverlay from "./SearchOverlay";

export default function NavSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const placeholder = pathname.startsWith("/store") ? "Cari toko atau produk..." : pathname.startsWith("/literature") ? "Cari judul atau artikel..." : pathname.startsWith("/news") ? "Cari berita..." : "Cari...";

  function handleSearch() {
    const keyword = search.trim();
    const params = new URLSearchParams();

    if (keyword) params.set("search", keyword);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    setSearch("");
    setSearchOpen(false);
  }

  function handleClear() {
    setSearch("");
    const params = new URLSearchParams(window.location.search);
    params.delete("search");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <>
      <button type="button" onClick={() => setSearchOpen(true)} title="Cari" className="flex h-8 w-8 items-center justify-center rounded-full border border-white shadow-lg shadow-green-500/25 transition-all duration-200 hover:scale-105 active:scale-95 md:h-9 md:w-9">
        <Search className="h-4 w-4 text-[#25C95F] md:h-5 md:w-5" />
      </button>

      <SearchOverlay open={searchOpen} value={search} placeholder={placeholder} onChange={setSearch} onSubmit={handleSearch} onClose={() => setSearchOpen(false)} onClear={handleClear} />
    </>
  );
}