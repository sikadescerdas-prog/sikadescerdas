// components/village/StructureVillage.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Crown, User, Plus, Building2 } from "lucide-react";

export interface StructureItem {
  id: string;
  fullName: string;
  gender: string | null;
  photo: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  position: string;
  category: string;
  group: string | null;
  period: { id?: string; startYear: number; endYear: number | null; isActive: boolean; } | null;
}

interface StructureVillageProps {
  structures: StructureItem[];
}

export default function StructureVillage({ structures }: StructureVillageProps) {
  const currentYear = new Date().getFullYear();

  const availablePeriods = useMemo(() => {
    const periodMap = new Map<string, { id: string; label: string; isActive: boolean; startYear: number; }>();
    structures.forEach((item) => {
      if (!item.period) return;
      const key = `${item.period.startYear}-${item.period.endYear ?? "now"}`;
      if (!periodMap.has(key)) {
        periodMap.set(key, {
          id: item.period.id || key,
          label: `${item.period.startYear} - ${item.period.endYear ?? "Sekarang"}`,
          isActive: item.period.isActive,
          startYear: item.period.startYear,
        });
      }
    });
    return Array.from(periodMap.values()).sort((a, b) => b.startYear - a.startYear);
  }, [structures]);

  const defaultPeriodKey = useMemo(() => {
    const activePeriod = availablePeriods.find((period) => period.isActive);
    if (activePeriod) return activePeriod.label;
    const currentPeriod = availablePeriods.find((period) => period.startYear <= currentYear);
    if (currentPeriod) return currentPeriod.label;
    return availablePeriods[0]?.label ?? "";
  }, [availablePeriods, currentYear]);

  const [selectedPeriodLabel, setSelectedPeriodLabel] = useState(defaultPeriodKey);

  const activeStructures = useMemo(() => {
    return structures.filter((item) => {
      if (!item.period) return true;
      const itemLabel = `${item.period.startYear} - ${item.period.endYear ?? "Sekarang"}`;
      if (selectedPeriodLabel) return itemLabel === selectedPeriodLabel;
      const started = item.period.startYear <= currentYear;
      const notEnded = !item.period.endYear || item.period.endYear >= currentYear;
      return item.period.isActive || (started && notEnded);
    });
  }, [structures, selectedPeriodLabel, currentYear]);

  const getPrefix = (gender?: string | null) => {
    if (!gender) return "";
    const value = gender.toLowerCase().trim();
    if (value === "perempuan" || value === "p" || value === "female" || value === "wanita") return "Bu";
    if (value === "laki_laki" || value === "laki-laki" || value === "l" || value === "male" || value === "pria") return "Pak";
    return "";
  };

  const formatName = (item: StructureItem) => {
    if (!item.fullName?.trim()) return item.position;
    const prefix = getPrefix(item.gender);
    return prefix ? `${prefix} ${item.fullName}` : item.fullName;
  };

  const formatGender = (gender?: string | null) => {
    if (!gender) return "-";
    const value = gender.toLowerCase().trim();
    if (value === "perempuan" || value === "p" || value === "female" || value === "wanita") return "Perempuan";
    if (value === "laki_laki" || value === "laki-laki" || value === "l" || value === "male" || value === "pria") return "Laki-laki";
    return gender;
  };

  const totalPersonel = activeStructures.length;

  const findPerson = (keys: string[]) => {
    return activeStructures.find((person) => {
      const pos = person.position.toLowerCase();
      const cat = person.category.toLowerCase();
      const grp = (person.group || "").toLowerCase();
      const isInstitution = pos.includes("bpd") || cat.includes("bpd") || grp.includes("lembaga") || cat.includes("lembaga") || cat.includes("pkk") || cat.includes("posyandu");
      return keys.some((key) => pos.includes(key) || cat.includes(key)) && !isInstitution;
    }) || null;
  };

  const filterPersonsByCategory = (keywords: string[]) => {
    const list = activeStructures.filter((person) => {
      const pos = person.position.toLowerCase();
      const cat = person.category.toLowerCase();
      const grp = (person.group || "").toLowerCase();
      const isBpd = pos.includes("bpd") || cat.includes("bpd") || grp.includes("bpd");
      const isInstitution = grp.includes("lembaga") || cat.includes("lembaga") || cat.includes("pkk") || cat.includes("posyandu") || grp.includes("pkk");
      if (isBpd || isInstitution) return false;
      return keywords.some((keyword) => cat.includes(keyword) || pos.includes(keyword));
    });
    return list.sort((a, b) => a.position.localeCompare(b.position, "id", { numeric: true }));
  };

  const kepalaDesa = findPerson(["kepala desa"]);
  const sekretarisDesa = findPerson(["sekretaris desa", "sekdes"]);
  const kaurUmum = findPerson(["kaur tata usaha", "kaur umum", "tata usaha"]);
  const kaurKeuangan = findPerson(["kaur keuangan"]);
  const kaurPerencanaan = findPerson(["kaur perencanaan"]);
  const kasiList = filterPersonsByCategory(["kasi", "kepala seksi"]);
  const kadusList = filterPersonsByCategory(["kadus", "kepala dusun"]);

  const bpdStructures = activeStructures.filter((person) => {
    const pos = person.position.toLowerCase();
    const cat = person.category.toLowerCase();
    const grp = (person.group || "").toLowerCase();
    return pos.includes("bpd") || cat.includes("bpd") || grp.includes("bpd");
  });

  const nonBpdInstitutionalStructures = activeStructures.filter((person) => {
    const pos = person.position.toLowerCase();
    const cat = person.category.toLowerCase();
    const grp = (person.group || "").toLowerCase();
    const isGovernment = pos.includes("kepala desa") || cat.includes("kepala desa") || pos.includes("sekretaris") || cat.includes("sekretaris") || pos.includes("kaur") || cat.includes("kaur") || pos.includes("kasi") || cat.includes("kasi") || pos.includes("kadus") || cat.includes("kadus") || pos.includes("kepala dusun") || cat.includes("kepala dusun");
    const isBpd = pos.includes("bpd") || cat.includes("bpd") || grp.includes("bpd");
    return !isGovernment && !isBpd;
  });

  const groupedNonBpdInstitutions: { [key: string]: StructureItem[]; } = {};
  nonBpdInstitutionalStructures.forEach((item) => {
    const groupName = item.group || item.category || "Lembaga Desa Lainnya";
    if (!groupedNonBpdInstitutions[groupName]) {
      groupedNonBpdInstitutions[groupName] = [];
    }
    groupedNonBpdInstitutions[groupName].push(item);
  });

  const sortInstitutionMembers = (members: StructureItem[]) => {
    return [...members].sort((a, b) => {
      const getRank = (position: string) => {
        const value = position.toLowerCase();
        if (value.includes("ketua")) return 1;
        if (value.includes("sekretaris")) return 2;
        if (value.includes("bendahara")) return 3;
        return 4;
      };
      return getRank(a.position) - getRank(b.position);
    });
  };

  const sortedBpdMembers = sortInstitutionMembers(bpdStructures);

  const renderCard = (person: StructureItem | null, fallbackLabel: string, subLabel?: string) => {
    return (
      <div className="w-38 sm:w-44 flex-shrink-0">
        {person ? (
          <div className="bg-white rounded-[1.25rem] shadow-md border border-slate-100 overflow-hidden hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300">
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />
            <div className="p-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center overflow-hidden">
                {person.photo ? (
                  <Image src={person.photo} alt={person.fullName} width={56} height={56} className="w-full h-full object-cover rounded-2xl" unoptimized />
                ) : (
                  <Crown className="w-6 h-6 text-emerald-600" />
                )}
              </div>
              <div className="text-center mt-2">
                <h3 className="font-bold text-slate-800 text-xs truncate">{formatName(person)}</h3>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 truncate">{person.position}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-[1.25rem] border-2 border-dashed border-slate-200 opacity-70">
            <div className="h-1.5 bg-slate-200" />
            <div className="p-3">
              <div className="w-12 h-12 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-slate-300" />
              </div>
              <div className="text-center mt-2">
                <h3 className="font-medium text-slate-400 text-xs truncate">{fallbackLabel}</h3>
                <p className="text-[10px] text-slate-300">{subLabel || "Belum diisi"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-16 mt-28">
      {/* HEADER */}
      <div className="flex flex-col items-center text-center gap-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">STRUKTUR DESA DANASARI</h1>
        <p className="text-md font-medium text-slate-500 uppercase tracking-widest">Kec. Karangjambu, Kab. Purbalingga</p>
        {availablePeriods.length > 0 && (
          <div className="inline-flex items-center gap-2 mt-2">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Periode:</span>
            <select value={selectedPeriodLabel} onChange={(e) => setSelectedPeriodLabel(e.target.value)} className="bg-transparent text-sm font-medium text-slate-500 uppercase tracking-widest outline-none">
              {availablePeriods.map((period) => (
                <option key={period.id} value={period.label}>{period.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* STRUKTUR PEMERINTAH DESA */}
      <div className="overflow-x-auto pb-8">
        <div className="min-w-[1100px] flex flex-col items-center">
          {/* KEPALA DESA */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">Kepala Desa</span>
            {renderCard(kepalaDesa, "Kepala Desa")}
          </div>

          <div className="w-0.5 h-8 bg-emerald-400" />

          {/* GARIS CABANG */}
          <div className="relative w-[60%]">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400" />
            <div className="flex justify-between px-10">
              <div className="w-0.5 h-6 bg-emerald-400" />
              <div className="w-0.5 h-6 bg-emerald-400" />
            </div>
          </div>

          <div className="w-full flex justify-between px-10 gap-20 mt-2">
            {/* BAGIAN KASI + KADUS */}
            <div className="flex-1 flex flex-col items-center space-y-10">
              {/* KASI */}
              <div className="w-full flex flex-col items-center">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-4 uppercase tracking-wider">Kepala Seksi (Kasi)</span>
                <div className="w-[85%] h-5 border-t-2 border-x-2 border-emerald-300 rounded-t-lg mb-3" />
                <div className="flex gap-3 justify-center overflow-x-auto w-full pb-2">
                  {kasiList.length > 0 ? (
                    kasiList.map((kasi) => (
                      <div key={kasi.id}>
                        {renderCard(kasi, kasi.position)}
                      </div>
                    ))
                  ) : (
                    <>
                      {renderCard(null, "Kasi Pemerintahan")}
                      {renderCard(null, "Kasi Kesejahteraan")}
                      {renderCard(null, "Kasi Pelayanan")}
                    </>
                  )}
                </div>
              </div>

              {/* KADUS */}
              <div className="w-full flex flex-col items-center">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-4 uppercase tracking-wider">Kepala Dusun (Kadus)</span>
                <div className="w-[85%] h-5 border-t-2 border-x-2 border-emerald-300 rounded-t-lg mb-3" />
                <div className="flex gap-3 justify-center overflow-x-auto w-full pb-2">
                  {kadusList.length > 0 ? (
                    kadusList.map((kadus) => (
                      <div key={kadus.id}>
                        {renderCard(kadus, kadus.position)}
                      </div>
                    ))
                  ) : (
                    renderCard(null, "Kepala Dusun I")
                  )}
                </div>
              </div>
            </div>

            {/* SEKRETARIAT */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-4 uppercase tracking-wider">Sekretariat Desa</span>
              {renderCard(sekretarisDesa, "Sekretaris Desa")}
              <div className="w-[85%] h-5 border-t-2 border-x-2 border-emerald-300 rounded-t-lg my-4" />
              <div className="grid grid-cols-3 gap-3 justify-items-center">
                {renderCard(kaurUmum, "Kaur Umum")}
                {renderCard(kaurKeuangan, "Kaur Keuangan")}
                {renderCard(kaurPerencanaan, "Kaur Perencanaan")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BPD */}
      {sortedBpdMembers.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Badan Permusyawaratan Desa (BPD)</h2>
            <p className="text-sm text-slate-500">Struktur kepengurusan dan anggota BPD desa.</p>
          </div>
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
              {sortedBpdMembers.map((person) => (
                <div key={person.id} className="w-full max-w-[200px]">
                  <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="h-1.5 bg-indigo-500" />
                    <div className="p-4">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center overflow-hidden">
                        {person.photo ? (
                          <Image src={person.photo} alt={person.fullName} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                        ) : (
                          <User className="w-7 h-7 text-indigo-600" />
                        )}
                      </div>
                      <div className="text-center mt-3">
                        <h3 className="font-bold text-xs text-slate-800 truncate">{formatName(person)}</h3>
                        <p className="text-[11px] text-indigo-600 font-semibold truncate">{person.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LEMBAGA & ORGANISASI DESA */}
      <div className="space-y-8 pt-8 border-t border-slate-200">
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Lembaga & Organisasi Desa</h2>
          <p className="text-sm text-slate-500 mt-1">Struktur kepengurusan PKK, Posyandu, Karang Taruna, dan lembaga desa lainnya.</p>
        </div>
        {Object.keys(groupedNonBpdInstitutions).length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {Object.entries(groupedNonBpdInstitutions).map(([groupName, members]) => {
              const sortedMembers = sortInstitutionMembers(members);
              return (
                <div key={groupName} className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm w-full sm:w-[320px]">
                  <div className="text-center mb-6">
                    <span className="inline-block px-4 py-1.5 bg-white text-teal-700 text-xs font-bold rounded-xl shadow-sm border border-teal-100 uppercase tracking-wider">{groupName}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    {sortedMembers.map((person, index) => (
                      <div key={person.id} className="w-full flex flex-col items-center">
                        {index > 0 && <div className="w-0.5 h-6 bg-teal-300" />}
                        <div className="w-full max-w-[220px]">
                          <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                            <div className="h-1.5 bg-teal-500" />
                            <div className="p-4">
                              <div className="w-16 h-16 mx-auto bg-teal-50 rounded-2xl flex items-center justify-center overflow-hidden">
                                {person.photo ? (
                                  <Image src={person.photo} alt={person.fullName} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                                ) : (
                                  <User className="w-7 h-7 text-teal-600" />
                                )}
                              </div>
                              <div className="text-center mt-3">
                                <h3 className="font-bold text-xs text-slate-800 truncate">{formatName(person)}</h3>
                                <p className="text-[11px] text-teal-600 font-semibold truncate">{person.position}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto">
            <p className="text-sm text-slate-400">Belum ada data lembaga atau organisasi terdaftar.</p>
          </div>
        )}
      </div>

      {/* TABLE DATA PERSONEL */}
      <div className="bg-white rounded-[1.5rem] shadow-md border border-slate-100 overflow-hidden mt-12">
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-500 to-teal-600">
          <h2 className="font-bold text-white text-lg">Daftar Personel</h2>
          <p className="text-emerald-100 text-xs mt-1">Semua struktur organisasi desa untuk periode yang dipilih</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Nama</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Jabatan</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase hidden sm:table-cell">Kategori / Lembaga</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase hidden sm:table-cell">JK</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Periode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {totalPersonel > 0 ? (
                activeStructures.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/40 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.photo ? (
                            <Image src={item.photo} alt={item.fullName} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                          ) : (
                            <User className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-800">{formatName(item)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">{item.position}</span>
                      {item.group && <div className="text-[10px] text-slate-400 mt-1">{item.group}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 hidden sm:table-cell">
                      {item.group ? `${item.category} (${item.group})` : item.category}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 hidden sm:table-cell">
                      {formatGender(item.gender)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {item.period ? `${item.period.startYear} - ${item.period.endYear ?? "Sekarang"}` : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">Tidak ada personel yang terdaftar untuk periode ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}