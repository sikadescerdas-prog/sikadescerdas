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
  period: {
    id?: string;
    startYear: number;
    endYear: number;
    isActive: boolean;
  } | null;
}

interface StructureVillageProps {
  structures: StructureItem[];
}

export default function StructureVillage({ structures }: StructureVillageProps) {
  const currentYear = new Date().getFullYear();

  const availablePeriods = useMemo(() => {
    const periodMap = new Map<string, { id: string; label: string; isActive: boolean; startYear: number }>();
    structures.forEach((item) => {
      if (item.period) {
        const key = `${item.period.startYear}-${item.period.endYear}`;
        if (!periodMap.has(key)) {
          periodMap.set(key, {
            id: item.period.id || key,
            label: `${item.period.startYear} - ${item.period.endYear}`,
            isActive: item.period.isActive,
            startYear: item.period.startYear,
          });
        }
      }
    });
    return Array.from(periodMap.values()).sort((a, b) => b.startYear - a.startYear);
  }, [structures]);

  const defaultPeriodKey = useMemo(() => {
    const active = availablePeriods.find((p) => p.isActive);
    if (active) return active.label;
    const currentActive = availablePeriods.find((p) => p.startYear <= currentYear && (p.startYear + 5 >= currentYear));
    if (currentActive) return currentActive.label;
    return availablePeriods[0]?.label || "";
  }, [availablePeriods, currentYear]);

  const [selectedPeriodLabel, setSelectedPeriodLabel] = useState<string>("");

  useMemo(() => {
    if (!selectedPeriodLabel && defaultPeriodKey) {
      setSelectedPeriodLabel(defaultPeriodKey);
    }
  }, [defaultPeriodKey, selectedPeriodLabel]);

  const activeStructures = useMemo(() => {
    return structures.filter((item) => {
      if (!item.period) return true;
      const itemLabel = `${item.period.startYear} - ${item.period.endYear}`;
      if (selectedPeriodLabel) {
        return itemLabel === selectedPeriodLabel;
      }
      return item.period.isActive || (item.period.startYear <= currentYear && item.period.endYear >= currentYear);
    });
  }, [structures, selectedPeriodLabel, currentYear]);

  const getPrefix = (gender?: string | null) => {
    if (!gender) return "";
    const g = gender.toLowerCase().trim();
    if (g === "perempuan" || g === "p" || g === "female" || g === "wanita") return "Bu";
    if (g === "laki_laki" || g === "laki-laki" || g === "l" || g === "male" || g === "pria") return "Pak";
    return "";
  };

  const formatName = (item: StructureItem) => {
    if (!item.fullName?.trim()) return item.position;
    const prefix = getPrefix(item.gender);
    return prefix ? `${prefix} ${item.fullName}` : item.fullName;
  };

  const formatGender = (gender?: string | null) => {
    if (!gender) return "-";
    const g = gender.toLowerCase().trim();
    if (g === "perempuan" || g === "p" || g === "female" || g === "wanita") return "Perempuan";
    if (g === "laki_laki" || g === "laki-laki" || g === "l" || g === "male" || g === "pria") return "Laki-laki";
    return gender;
  };

  const totalPersonel = activeStructures.length;

  const findPerson = (keys: string[]) => {
    return activeStructures.find((person) => {
      const pos = person.position.toLowerCase();
      const cat = person.category.toLowerCase();
      const isInst = pos.includes("bpd") || cat.includes("bpd") || person.group || cat.includes("lembaga") || cat.includes("pkk") || cat.includes("posyandu");
      return keys.some((k) => pos.includes(k) || cat.includes(k)) && !isInst;
    }) || null;
  };

  const filterPersonsByCategory = (categoryKeywords: string[]) => {
    const list = activeStructures.filter((person) => {
      const pos = person.position.toLowerCase();
      const cat = person.category.toLowerCase();
      const grp = (person.group || "").toLowerCase();
      const isBpd = pos.includes("bpd") || cat.includes("bpd") || grp.includes("bpd");
      const isInst = grp.includes("lembaga") || cat.includes("lembaga") || cat.includes("pkk") || cat.includes("posyandu") || grp.includes("pkk");
      if (isBpd || isInst) return false;
      return categoryKeywords.some((k) => cat.includes(k) || pos.includes(k));
    });
    list.sort((a, b) => a.position.localeCompare(b.position, 'id', { numeric: true }));
    return list;
  };

  const kepalaDesa = findPerson(["kepala desa"]);
  const sekretarisDesa = findPerson(["sekretaris desa", "sekdes"]);
  const kaurUmum = findPerson(["kaur tata usaha", "kaur umum", "tata usaha & umum"]);
  const kaurKeu = findPerson(["kaur keuangan"]);
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
    const isGov = pos.includes("kepala desa") || cat.includes("kepala desa") || pos.includes("sekretaris") || cat.includes("sekretaris") || pos.includes("kaur") || cat.includes("kaur") || pos.includes("kasi") || cat.includes("kasi") || pos.includes("kadus") || cat.includes("kadus") || pos.includes("kepala dusun") || cat.includes("kepala dusun");
    const isBpd = pos.includes("bpd") || cat.includes("bpd") || grp.includes("bpd");
    return !isGov && !isBpd;
  });

  const groupedNonBpdInstitutions: { [key: string]: StructureItem[] } = {};
  nonBpdInstitutionalStructures.forEach((item) => {
    const groupName = item.group || item.category || "Lembaga Desa Lainnya";
    if (!groupedNonBpdInstitutions[groupName]) {
      groupedNonBpdInstitutions[groupName] = [];
    }
    groupedNonBpdInstitutions[groupName].push(item);
  });

  const sortInstitutionMembers = (members: StructureItem[]) => {
    return [...members].sort((a, b) => {
      const posA = a.position.toLowerCase();
      const posB = b.position.toLowerCase();
      const getRank = (pos: string) => {
        if (pos.includes("ketua")) return 1;
        if (pos.includes("sekretaris")) return 2;
        if (pos.includes("bendahara")) return 3;
        return 4;
      };
      return getRank(posA) - getRank(posB);
    });
  };

  const sortedBpdMembers = sortInstitutionMembers(bpdStructures);

  const renderCard = (person: StructureItem | null, fallbackLabel: string, subLabel?: string) => (
    <div className="w-38 sm:w-44 flex-shrink-0">
      {person ? (
        <div className="bg-white rounded-[1.25rem] shadow-md border border-slate-100 overflow-hidden hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300">
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />
          <div className="p-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
              {person.photo ? (
                <Image src={person.photo} alt={person.fullName} width={56} height={56} className="w-full h-full object-cover rounded-2xl" unoptimized />
              ) : (
                <Crown className="w-6 h-6 text-emerald-600" />
              )}
            </div>
            <div className="text-center mt-2">
              <h3 className="font-bold text-slate-800 text-xs truncate" title={person.fullName}>
                {formatName(person)}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 truncate" title={person.position}>
                {person.position}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50/80 rounded-[1.25rem] shadow-sm border-2 border-dashed border-slate-200 overflow-hidden opacity-75">
          <div className="h-1.5 bg-slate-200" />
          <div className="p-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-slate-300" />
            </div>
            <div className="text-center mt-2">
              <h3 className="font-medium text-slate-400 text-xs truncate">{fallbackLabel}</h3>
              <p className="text-[10px] text-slate-300 mt-0.5">{subLabel || "Belum diisi"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-16 mt-28">
      <div className="flex flex-col items-center text-center gap-0.5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">STRUKTUR DESA DANASARI</h1>
        <p className="text-md font-medium text-slate-500 uppercase tracking-widest">Kec. Karangjambu, Kab. Purbalingga</p>
        {availablePeriods.length > 0 && (
          <div className="inline-flex items-center gap-1.5 mt-2">
            <span className="text-md font-medium text-slate-500 uppercase tracking-widest">Periode:</span>
            <select
              value={selectedPeriodLabel}
              onChange={(e) => setSelectedPeriodLabel(e.target.value)}
              className="min-w-[120px] bg-transparent font-medium text-slate-500 uppercase tracking-widest"
            >
              {availablePeriods.map((period) => (
                <option key={period.id} value={period.label}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="overflow-x-auto pb-8 pt-2">
          <div className="min-w-[1100px] flex flex-col items-center">
            <div className="flex flex-col items-center relative z-10">
              <span className="text-[10px] font-semibold text-slate-400 mb-1 tracking-wider uppercase">KEPALA DESA</span>
              {renderCard(kepalaDesa, "Kepala Desa")}
            </div>
            <div className="w-0.5 h-6 bg-emerald-400 my-0.5" />
            <div className="relative w-[58%] flex justify-between items-center">
              <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 z-0" />
              <div className="w-full flex justify-between relative z-10 px-8">
                <div className="w-0.5 h-4 bg-emerald-400" />
                <div className="w-0.5 h-4 bg-emerald-400" />
              </div>
            </div>
            <div className="w-full flex justify-between items-start px-8 gap-16 mt-1">
              <div className="flex-1 flex flex-col items-center space-y-8">
                <div className="flex flex-col items-center w-full">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-3 shadow-sm uppercase tracking-wider">
                    Kepala Seksi (Kasi)
                  </span>
                  <div className="w-full flex justify-center items-center mb-3">
                    <div className="w-[85%] h-5 border-t-2 border-x-2 border-emerald-300 rounded-t-lg" />
                  </div>
                  <div className="flex flex-row flex-nowrap justify-center gap-3 w-full overflow-x-auto pb-2">
                    {kasiList.length > 0 ? (
                      kasiList.map((kasi) => (
                        <div key={kasi.id}>{renderCard(kasi, kasi.position)}</div>
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
                <div className="flex flex-col items-center w-full">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-3 shadow-sm uppercase tracking-wider">
                    Kepala Dusun (Kadus)
                  </span>
                  <div className="w-full flex justify-center items-center mb-3">
                    <div className="w-[85%] h-5 border-t-2 border-x-2 border-emerald-300 rounded-t-lg" />
                  </div>
                  <div className="flex flex-row flex-nowrap justify-center gap-3 w-full overflow-x-auto pb-2">
                    {kadusList.length > 0 ? (
                      kadusList.map((kadus) => (
                        <div key={kadus.id}>{renderCard(kadus, kadus.position)}</div>
                      ))
                    ) : (
                      renderCard(null, "Kepala Dusun I")
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-3 shadow-sm uppercase tracking-wider">
                  Sekretariat Desa
                </span>
                {renderCard(sekretarisDesa, "Sekretaris Desa")}
                <div className="w-full flex justify-center items-center my-3">
                  <div className="w-[85%] h-5 border-t-2 border-x-2 border-emerald-300 rounded-t-lg" />
                </div>
                <div className="grid grid-cols-3 gap-2.5 justify-items-center w-full">
                  {renderCard(kaurUmum, "Kaur Umum")}
                  {renderCard(kaurKeu, "Kaur Keuangan")}
                  {renderCard(kaurPerencanaan, "Kaur Perencanaan")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sortedBpdMembers.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-200/60">
          <div className="text-center max-w-xl mx-auto mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl mb-3 shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Badan Permusyawaratan Desa (BPD)</h2>
            <p className="text-sm text-slate-500 mt-1">Struktur kepengurusan dan anggota BPD desa.</p>
          </div>
          <div className="bg-slate-50/60 rounded-3xl p-6 border border-slate-200/60 shadow-sm max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
              {sortedBpdMembers.map((person) => (
                <div key={person.id} className="w-full max-w-[200px]">
                  <div className="bg-white rounded-[1.25rem] shadow-md border border-slate-100 overflow-hidden hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    <div className="h-1.5 bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600" />
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div className="w-14 h-14 mx-auto bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                        {person.photo ? (
                          <Image src={person.photo} alt={person.fullName} width={64} height={64} className="w-full h-full object-cover rounded-2xl" unoptimized />
                        ) : (
                          <User className="w-7 h-7 text-indigo-600" />
                        )}
                      </div>
                      <div className="text-center mt-2.5">
                        <h3 className="font-bold text-slate-800 text-xs truncate" title={person.fullName}>
                          {formatName(person)}
                        </h3>
                        <p className="text-[11px] text-indigo-600 font-semibold mt-0.5 truncate" title={person.position}>
                          {person.position}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 pt-8 border-t border-slate-200/60">
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl mb-3 shadow-inner">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Lembaga & Organisasi Desa</h2>
          <p className="text-sm text-slate-500 mt-1">Struktur kepengurusan PKK, Posyandu, Karang Taruna, dan lembaga desa lainnya.</p>
        </div>
        {Object.keys(groupedNonBpdInstitutions).length > 0 ? (
          <div className="flex flex-wrap justify-center items-start gap-8">
            {Object.entries(groupedNonBpdInstitutions).map(([groupName, members]) => {
              const sortedMembers = sortInstitutionMembers(members);
              return (
                <div key={groupName} className="bg-slate-50/60 rounded-3xl p-6 border border-slate-200/60 shadow-sm w-full sm:w-[320px] flex-shrink-0">
                  <div className="text-center mb-6">
                    <span className="inline-block px-4 py-1.5 bg-white text-teal-700 text-xs sm:text-sm font-bold rounded-xl shadow-sm border border-teal-100 uppercase tracking-wider">
                      {groupName}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    {sortedMembers.map((person, index) => (
                      <div key={person.id} className="w-full flex flex-col items-center">
                        {index > 0 && <div className="w-0.5 h-6 bg-teal-300 my-1" />}
                        <div className="w-full max-w-[220px]">
                          <div className="bg-white rounded-[1.25rem] shadow-md border border-slate-100 overflow-hidden hover:shadow-xl hover:border-teal-200 hover:-translate-y-1 transition-all duration-300">
                            <div className="h-1.5 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600" />
                            <div className="p-3.5 sm:p-4">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-teal-50 to-emerald-100 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                                {person.photo ? (
                                  <Image src={person.photo} alt={person.fullName} width={64} height={64} className="w-full h-full object-cover rounded-2xl" unoptimized />
                                ) : (
                                  <User className="w-7 h-7 text-teal-600" />
                                )}
                              </div>
                              <div className="text-center mt-2.5">
                                <h3 className="font-bold text-slate-800 text-xs truncate" title={person.fullName}>
                                  {formatName(person)}
                                </h3>
                                <p className="text-[11px] text-teal-600 font-semibold mt-0.5 truncate" title={person.position}>
                                  {person.position}
                                </p>
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
            <p className="text-slate-400 text-sm">Belum ada data lembaga atau organisasi terdaftar.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-md border border-slate-100 overflow-hidden mt-12">
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-500 to-teal-600">
          <h2 className="font-bold text-white text-lg">Daftar Personel</h2>
          <p className="text-emerald-100 text-xs mt-0.5">Semua struktur organisasi desa untuk periode yang dipilih</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
                  <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.photo ? (
                            <Image src={item.photo} alt={item.fullName} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                          ) : (
                            <User className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                        <span className="font-medium text-slate-800 text-xs sm:text-sm">
                          {formatName(item)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full inline-block border border-emerald-100">
                        {item.position}
                      </span>
                      {item.group && <div className="text-[10px] text-slate-400 mt-0.5">{item.group}</div>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs hidden sm:table-cell">
                      {item.group ? `${item.category} (${item.group})` : item.category}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs hidden sm:table-cell font-medium">
                      {formatGender(item.gender)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-medium">
                      {item.period ? `${item.period.startYear} - ${item.period.endYear}` : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                    Tidak ada personel yang terdaftar untuk periode ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}