// components/village/PotentialVillageCombined.tsx

"use client";

import { useState, useMemo } from "react";
import { Sparkles, Building2, MapPin, Search, ArrowUpRight, Globe, ChevronDown, X, RotateCcw, Compass, Layers } from "lucide-react";
import { useSwipe } from "@/shared/hooks/useSwipe";

export interface PotentialItem {
  id: string | number;
  name: string;
  description?: string;
  address?: string;
  link_maps?: string;
  website?: string;
  image_url?: string;
  village_potential_categories?: { name: string; };
}

export interface FacilityItem {
  id: string | number;
  name: string;
  address?: string;
  link_maps?: string;
  image_url?: string;
  village_facility_types?: { name: string; village_facility_categories?: { name: string; }; };
}

export default function PotentialVillageCombined({ potentials, facilities }: { potentials: PotentialItem[]; facilities: FacilityItem[]; }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPotentialCategory, setSelectedPotentialCategory] = useState("Semua");
  const [selectedFacilityCategory, setSelectedFacilityCategory] = useState("Semua");
  const [expandedPotentialIds, setExpandedPotentialIds] = useState<Record<string | number, boolean>>({});

  const potentialCategoryRef = useSwipe(1.15);
  const facilityCategoryRef = useSwipe(1.15);

  const toggleExpand = (id: string | number) => {
    setExpandedPotentialIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setSelectedPotentialCategory("Semua");
    setSelectedFacilityCategory("Semua");
  };

  const potentialCategories = useMemo(() => ["Semua", ...Array.from(new Set(potentials.map((item) => item.village_potential_categories?.name).filter(Boolean)))], [potentials]);

  const filteredPotentials = useMemo(() => {
    return potentials.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || (item.address && item.address.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedPotentialCategory === "Semua" || item.village_potential_categories?.name === selectedPotentialCategory;
      return matchesSearch && matchesCategory;
    });
  }, [potentials, searchQuery, selectedPotentialCategory]);

  const facilityCategories = useMemo(() => ["Semua", ...Array.from(new Set(facilities.map((item) => item.village_facility_types?.village_facility_categories?.name).filter(Boolean)))], [facilities]);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || (item.address && item.address.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedFacilityCategory === "Semua" || item.village_facility_types?.village_facility_categories?.name === selectedFacilityCategory;
      return matchesSearch && matchesCategory;
    });
  }, [facilities, searchQuery, selectedFacilityCategory]);

  const isFiltered = searchQuery !== "" || selectedPotentialCategory !== "Semua" || selectedFacilityCategory !== "Semua";

  return (
    <section className="space-y-16 text-slate-800">
      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-md opacity-25 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-lg flex items-center gap-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#03AC03]/30 focus-within:border-[#03AC03]">
          <Search className="w-5 h-5 text-emerald-600 ml-2 shrink-0 animate-pulse" />
          <input type="text" placeholder="Eksplorasi seluruh potensi & fasilitas desa..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full py-1 bg-transparent text-sm font-medium focus:outline-none text-slate-800 placeholder:text-slate-400" />
          {searchQuery && (<button onClick={() => setSearchQuery("")} className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all cursor-pointer active:scale-90" title="Hapus pencarian"><X className="w-3.5 h-3.5" /></button>)}
          {isFiltered && (<button onClick={handleResetFilter} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer active:scale-95" title="Reset semua filter"><RotateCcw className="w-3.5 h-3.5 text-slate-500" /><span className="hidden sm:inline">Reset</span></button>)}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20 transform hover:rotate-6 transition-transform duration-300">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Potensi Desa</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold">{filteredPotentials.length}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Komoditas unggulan, produk lokal, dan daya tarik utama desa</p>
            </div>
          </div>

          <div ref={potentialCategoryRef} className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none select-none cursor-grab active:cursor-grabbing">
            {potentialCategories.map((cat) => (
              <button key={cat} onClick={() => setSelectedPotentialCategory(cat as string)} className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer active:scale-95 shrink-0 ${selectedPotentialCategory === cat ? "bg-[#03AC03] text-white shadow-lg shadow-emerald-500/30 scale-[1.02]" : "bg-white/80 backdrop-blur-sm border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-xs"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPotentials.map((item, index) => {
            const isExpanded = !!expandedPotentialIds[item.id];
            return (
              <div key={item.id} className="group bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between relative overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500 pointer-events-none" />
                <div>
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-5 bg-slate-100 relative shadow-inner">
                    <img src={item.image_url || "/img/noimage.png"} alt={item.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md text-[#03AC03] text-[11px] font-bold shadow-md">
                        {item.village_potential_categories?.name || "Umum"}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#03AC03] transition-colors duration-300 leading-snug">{item.name}</h3>
                  {item.description && (
                    <div className="mt-2">
                      <p className={`text-xs text-slate-500 leading-relaxed transition-all duration-300 ${isExpanded ? "" : "line-clamp-2"}`}>{item.description}</p>
                      <button onClick={() => toggleExpand(item.id)} className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#03AC03] hover:underline cursor-pointer focus:outline-none">
                        <span>{isExpanded ? "Sembunyikan" : "Baca selengkapnya"}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  )}
                  {item.address && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  {item.website ? (<a href={item.website} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#03AC03] flex items-center gap-1.5 font-semibold truncate max-w-[55%] transition-colors"><Globe className="w-4 h-4 shrink-0 text-slate-400" /> Website</a>) : <span />}
                  {item.link_maps && (
                    <a href={item.link_maps} target="_blank" rel="noopener noreferrer" className="font-bold text-[#03AC03] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all group/link">
                      <span>Maps</span> 
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {filteredPotentials.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-8 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto text-[#03AC03] animate-bounce">
                <Compass className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Potensi tidak ditemukan</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Coba gunakan kata kunci lain atau reset pilihan kategori yang sedang aktif.</p>
              <button onClick={handleResetFilter} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95">
                Reset Filter Pencarian
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 transform hover:-rotate-6 transition-transform duration-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Fasilitas Umum</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold">{filteredFacilities.length}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Infrastruktur publik, layanan pendidikan, kesehatan, dan sarana warga</p>
            </div>
          </div>

          <div ref={facilityCategoryRef} className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none select-none cursor-grab active:cursor-grabbing">
            {facilityCategories.map((cat) => (
              <button key={cat} onClick={() => setSelectedFacilityCategory(cat as string)} className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer active:scale-95 shrink-0 ${selectedFacilityCategory === cat ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]" : "bg-white/85 backdrop-blur-sm border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-xs"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFacilities.map((facility, index) => (
            <div key={facility.id} className="group relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-blue-500/30 hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-end min-h-[260px] p-5 sm:p-6" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="absolute inset-0 z-0">
                <img src={facility.image_url || "/img/noimage.png"} alt={facility.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/10" />
              </div>

              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md text-blue-600 text-[11px] font-bold shadow-md">
                    {facility.village_facility_types?.village_facility_categories?.name || "Fasilitas"}
                  </span>
                  {facility.village_facility_types?.name && (
                    <span className="px-3 py-1 rounded-xl bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
                      {facility.village_facility_types.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative z-10 space-y-3 pt-12">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 leading-snug">{facility.name}</h3>
                  {facility.address && (
                    <div className="flex items-center gap-2 text-xs text-slate-300 mt-2 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                      <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="truncate">{facility.address}</span>
                    </div>
                  )}
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-end">
                  {facility.link_maps ? (
                    <a href={facility.link_maps} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white bg-blue-600/80 hover:bg-blue-600 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all group/link shadow-md">
                      <span>Buka Peta</span> 
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (<span className="text-[11px] text-slate-300 italic">Lokasi belum disematkan</span>)}
                </div>
              </div>
            </div>
          ))}

          {filteredFacilities.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-8 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto text-blue-600 animate-pulse">
                <Layers className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Fasilitas tidak ditemukan</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Silakan coba kata kunci lain atau pilih kategori fasilitas yang berbeda.</p>
              <button onClick={handleResetFilter} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer active:scale-95">
                Reset Filter Fasilitas
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}