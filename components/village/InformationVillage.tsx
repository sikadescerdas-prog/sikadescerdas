// components/village/InformationVillage.tsx
"use client";

import React, { useState } from "react";
import { MapPin, Building2, Mail, Phone, Globe, CalendarDays, Landmark, Sparkles, Compass, Maximize2, ExternalLink, ShieldCheck, Navigation, Copy, Check } from "lucide-react";

interface AddressObject {
  fullAddress?: string;
  district?: string;
  regency?: string;
  province?: string;
  postalCode?: string;
}

interface BoundaryObject {
  north?: string;
  south?: string;
  east?: string;
  west?: string;
}

interface ContactObject {
  phone?: string;
  email?: string;
  website?: string;
}

interface VillageData {
  name: string;
  district?: string;
  regency?: string;
  province?: string;
  address?: AddressObject | string;
  areaSize?: number;
  boundary?: BoundaryObject;
  mapEmbed?: string;
  email?: string;
  phone?: string;
  website?: string;
  founded?: string;
  foundedYear?: number;
  contact?: ContactObject;
}

interface InformationVillageProps {
  village: VillageData;
}

export default function InformationVillage({ village }: InformationVillageProps) {
  const [copied, setCopied] = useState(false);

  const districtName = typeof village.address === "object" && village.address !== null && "district" in village.address ? village.address.district : village.district || "Karangjambu";
  const regencyName = typeof village.address === "object" && village.address !== null && "regency" in village.address ? village.address.regency : village.regency || "Purbalingga";
  const provinceName = typeof village.address === "object" && village.address !== null && "province" in village.address ? village.address.province : village.province || "Jawa Tengah";
  const postalCode = typeof village.address === "object" && village.address !== null && "postalCode" in village.address ? village.address.postalCode : "53357";

  const rawEmail = village.email || village.contact?.email || "danasari@gmail.com";
  const rawPhone = village.phone || village.contact?.phone || "628123456789";
  const rawWebsite = village.website || village.contact?.website || "https://danasari.desa.id";

  const formattedWebsite = rawWebsite.startsWith("http") ? rawWebsite : `https://${rawWebsite}`;
  const fullAddress = `${village.name}, Kec. ${districtName}, Kab. ${regencyName}, ${provinceName}, ${postalCode}, Indonesia`;
  const areaSize = village.areaSize ? `${village.areaSize} Ha` : "625,23 Ha";

  const handleCopyAddress = () => {
    const globalScope = (typeof globalThis !== "undefined" ? globalThis : window) as unknown as { navigator?: { clipboard?: { writeText: (text: string) => Promise<void> } } };
    if (globalScope.navigator?.clipboard) {
      globalScope.navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const information = [
    { label: "Nama Desa", value: village.name, icon: Landmark, tag: "Pusat Pemerintahan" },
    { label: "Kecamatan", value: districtName, icon: MapPin, tag: "Wilayah Administratif" },
    { label: "Kabupaten", value: regencyName, icon: MapPin, tag: "Daerah Otonom" },
    { label: "Provinsi", value: provinceName, icon: MapPin, tag: "Teritorial Regional" },
    { label: "Kode Pos", value: postalCode, icon: ShieldCheck, tag: "Zonasi Pos" },
    { label: "Tahun Berdiri", value: String(village.founded || village.foundedYear || "1982"), icon: CalendarDays, tag: "Sejarah Desa" },
  ];

  const contactInfo = [
    { label: "Email Resmi", value: rawEmail, icon: Mail, href: `mailto:${rawEmail}`, desc: "Layanan surat elektronik instansi" },
    { label: "Nomor Telepon", value: rawPhone, icon: Phone, href: `tel:${rawPhone.replace(/\s+/g, "")}`, desc: "Kontak langsung layanan warga" },
    { label: "Situs Web", value: rawWebsite.replace(/^https?:\/\//, ""), icon: Globe, href: formattedWebsite, isExternal: true, desc: "Portal informasi digital resmi" },
  ];

  const boundaries = {
    north: village.boundary?.north || "Desa Tambi",
    east: village.boundary?.east || "Desa Sirau",
    south: village.boundary?.south || "Desa Jingkang",
    west: village.boundary?.west || "Desa Jingkang",
  };

  const mapUrl = village.mapEmbed || "https://www.google.com/maps/place/Balai+Desa+Danasari,+Kec+Karangjambu,+Kab+Purbalingga/@-7.1894875,109.4223906,17z";

  return (
    <div className="w-full mx-auto group/card">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-2xl shadow-green-950/5 transition-all duration-700 hover:shadow-green-950/20 hover:-translate-y-1">
        <style jsx>{`
          @keyframes morphBlob { 0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); } 33% { transform: translate(-20px, 15px) scale(1.15) rotate(120deg); } 66% { transform: translate(15px, -15px) scale(0.9) rotate(240deg); } }
          @keyframes floatSlow { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
          @keyframes pulseGlow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.08); } }
          .blob-anim { animation: morphBlob 8s ease-in-out infinite; }
          .float-anim { animation: floatSlow 5s ease-in-out infinite; }
          .pulse-glow { animation: pulseGlow 4s ease-in-out infinite; }
        `}</style>

        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 px-8 py-7 overflow-hidden">
          <div className="absolute -right-12 -top-12 w-52 h-52 bg-white/25 rounded-full blur-3xl blob-anim pointer-events-none" />
          <div className="absolute left-1/4 -bottom-12 w-40 h-40 bg-teal-300/30 rounded-full blur-2xl blob-anim pointer-events-none" style={{ animationDelay: '3s' }} />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/20 backdrop-blur-md p-3.5 border border-white/40 shadow-xl float-anim transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-6">
                <Building2 className="h-6 w-6 text-white drop-shadow" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 drop-shadow-sm">
                  Profil Desa Danasari
                  <Sparkles className="h-4 w-4 text-green-100 animate-pulse" />
                </h2>
                <p className="text-sm font-medium text-green-50 mt-0.5 tracking-wide">Informasi umum mengenai identitas, kontak resmi, dan lokasi geografis desa.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTAINER UTAMA */}
        <div className="space-y-10 p-8 sm:p-12 relative bg-gradient-to-b from-white via-emerald-50/10 to-white">
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none pulse-glow" />

          {/* GRID INFORMASI UTAMA */}
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                  <Landmark size={18} />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Identitas & Wilayah Administrasi</h3>
              </div>
              <span className="hidden sm:inline-flex text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">Data Terverifikasi</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {information.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="group/item relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30 p-5 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1.5 flex flex-col justify-between">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-100/30 rounded-full blur-xl transition-all duration-500 group-hover/item:scale-150" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-emerald-100/80 text-emerald-600 shadow-md transition-transform duration-300 group-hover/item:scale-110 group-hover/item:rotate-6">
                        <Icon size={22} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-lg">{item.tag}</span>
                    </div>
                    <div className="relative z-10">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                      <p className="mt-1 text-base font-black text-slate-900 tracking-tight transition-colors group-hover/item:text-emerald-700">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* KONTAK RESMI */}
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                <Phone size={18} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Layanan & Kontak Resmi Desa</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="group/item relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white via-slate-50/50 to-teal-50/20 p-5 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-emerald-100/80 text-emerald-600 shadow-md transition-transform duration-300 group-hover/item:scale-110 group-hover/item:rotate-6">
                        <Icon size={22} />
                      </div>
                      {item.href && item.value !== "-" && (
                        <a href={item.href} target={item.isExternal ? "_blank" : undefined} rel={item.isExternal ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                          <span>Akses</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                      {item.href && item.value !== "-" ? (
                        <a href={item.href} target={item.isExternal ? "_blank" : undefined} rel={item.isExternal ? "noopener noreferrer" : undefined} className="block truncate text-sm font-black text-slate-900 tracking-tight transition-colors hover:text-emerald-700 hover:underline">{item.value}</a>
                      ) : (
                        <p className="truncate text-sm font-black text-slate-900 tracking-tight">{item.value}</p>
                      )}
                      <p className="text-xs text-slate-500 font-medium pt-1">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LOKASI & GEOGRAFIS */}
          <div className="space-y-6 relative z-10 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                <Navigation size={18} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Lokasi Geografis & Teritorial</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-8 group/item relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-r from-white via-slate-50/50 to-emerald-50/20 p-6 flex flex-col justify-between shadow-sm transition-all duration-500 hover:shadow-xl hover:border-emerald-300">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-emerald-100 text-emerald-600 shadow-md transition-transform duration-300 group-hover/item:scale-110">
                      <MapPin size={26} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Alamat Kantor Desa</p>
                      <h4 className="text-sm font-black text-slate-900 tracking-tight">Titik Pusat Pelayanan Publik</h4>
                    </div>
                  </div>

                  <button onClick={handleCopyAddress} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all border border-slate-200 shadow-sm" title="Salin Alamat">
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-700">Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-slate-100 shadow-inner">
                  <p className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-relaxed">{fullAddress}</p>
                </div>
              </div>

              <div className="md:col-span-4 group/item relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-r from-white via-slate-50/50 to-emerald-50/20 p-6 flex flex-col justify-between shadow-sm transition-all duration-500 hover:shadow-xl hover:border-emerald-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-emerald-100 text-emerald-600 shadow-md transition-transform duration-300 group-hover/item:scale-110">
                    <Maximize2 size={26} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Luas Wilayah</p>
                    <h4 className="text-sm font-black text-slate-900 tracking-tight">Total Area Teritorial</h4>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-slate-100 shadow-inner">
                  <p className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">{areaSize}</p>
                </div>
              </div>
            </div>

            {/* EMBED MAP */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-50 shadow-xl relative z-10">
              <div className="p-5 bg-gradient-to-r from-slate-50 via-white to-emerald-50/40 border-b border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin size={18} className="text-emerald-600" />
                  <span className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">Peta Interaktif & Kantor Desa</span>
                </div>
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 shadow-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all duration-300">
                  <span>Buka di Google Maps</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="relative w-full h-[360px] sm:h-[420px] group">
                <iframe title="Peta Desa" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.8203598767!2d109.4202019!3d-7.1894875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6ffbcef97e9cb9%3A0xf485e1991cbf9a0c!2sBalai%20Desa%20Danasari%2C%20Kec%20Karangjambu%2C%20Kab%20Purbalingga!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full h-full transition-transform duration-700 group-hover:scale-105" />
              </div>
            </div>

            {/* BATAS DESA */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                  <Compass size={18} />
                </div>
                <h4 className="text-base font-black text-slate-900 tracking-tight">Batas Wilayah Administratif Desa</h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Utara", value: boundaries.north, icon: Compass },
                  { label: "Timur", value: boundaries.east, icon: Compass },
                  { label: "Selatan", value: boundaries.south, icon: Compass },
                  { label: "Barat", value: boundaries.west, icon: Compass },
                ].map((item, idx) => {
                  const CompassIcon = item.icon;
                  return (
                    <div key={idx} className="group/bound relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/20 p-5 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-emerald-100 text-emerald-600 shadow-sm transition-transform duration-300 group-hover/bound:rotate-45">
                          <CompassIcon size={18} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Sisi {item.label}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Berbatasan Dengan</p>
                        <p className="mt-1 text-sm sm:text-base font-black text-slate-900 tracking-tight transition-colors group-hover/bound:text-emerald-700">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}