// components/store/HeaderStoreDetail.tsx

"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { sweet } from "@/shared/utils/sweet";

interface StoreMarketplace { id: string; platform: string; url: string; is_active: boolean; }

export interface StoreData {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: { url: string; publicId: string | null; } | null;
  banner: { url: string; publicId: string | null; } | null;
  phone: string | null;
  email: string | null;
  address: { province: string | null; regency: string | null; district: string | null; village: string | null; address: string | null; latitude: string | number | null; longitude: string | number | null; } | null;
  owner?: { id: string; username: string; role: string; } | null;
  marketplaces: StoreMarketplace[];
  products?: unknown[];
  is_store_complete: boolean;
  is_verified: boolean;
  is_active: boolean;
  is_owner?: boolean;
  created_at: string;
  updated_at: string;
}

interface HeaderStoreDetailProps { toko: StoreData; isStoreOpen?: boolean; onToggleStore?: () => void; isOwner?: boolean; }

export default function HeaderStoreDetail({ toko, isStoreOpen, onToggleStore, isOwner = false }: HeaderStoreDetailProps) {
  const router = useRouter();
  const [isTikTokLoading, setIsTikTokLoading] = useState(false);

  // Jika bukan owner dan toko belum verifikasi, paksa status toko menjadi tutup (false)
  const isVerified = toko.is_verified ?? true;
  const rawActive = isStoreOpen ?? toko.is_active ?? false;
  const isActive = !isOwner && !isVerified ? false : rawActive;

  const marketplaces = toko.marketplaces ?? [];

  const getMarketplace = (platform: string) => marketplaces.find((item) => item.platform?.toLowerCase() === platform.toLowerCase() && item.is_active);

  const shopee = getMarketplace("shopee");
  const tiktokShop = getMarketplace("tiktok_shop");
  const tokopedia = getMarketplace("tokopedia");

  const phone = toko.phone?.replace(/\D/g, "");
  const waLink = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(`Halo ${toko.name}`)}` : "#";

  const latitude = toko.address?.latitude;
  const longitude = toko.address?.longitude;

  const mapsQuery = [toko.address?.address, toko.address?.village, toko.address?.district, toko.address?.regency, toko.address?.province].filter(Boolean).join(", ");
  const mapsLink = latitude != null && longitude != null ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}` : mapsQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}` : "#";

  const locationName = toko.address?.village || toko.address?.district || toko.address?.regency || toko.address?.province || "";

  const getUsername = (value?: string | null) => {
    if (!value) return "";
    return value.trim().replace(/^https?:\/\/(www\.)?/i, "").replace(/^shopee\.co\.id\//i, "").replace(/^tokopedia\.com\//i, "").replace(/^www\.tokopedia\.com\//i, "").replace(/^vt\.tiktok\.com\//i, "").replace(/^tiktok\.com\/@?/i, "").replace(/^www\.tiktok\.com\/@?/i, "").replace(/^@/, "").replace(/\/$/, "");
  };

  const getShopeeLink = () => {
    const username = getUsername(shopee?.url);
    return username ? `https://shopee.co.id/${username}` : "#";
  };

  const getTokopediaLink = () => {
    const username = getUsername(tokopedia?.url);
    return username ? `https://www.tokopedia.com/${username}` : "#";
  };

  const getTikTokLink = () => {
    const username = getUsername(tiktokShop?.url);
    return username ? `https://vt.tiktok.com/${username}` : "#";
  };

  // Handler saat tombol toggle diklik
  const handleToggleClick = async () => {
    // Jika bukan miliknya (bukan owner) dan belum verifikasi, anggap toko tutup/tidak bisa diubah
    if (!isOwner && !isVerified) {
      await sweet.error({
        title: "Toko Tutup",
        text: "Silahkan hubungi admin",
      });
      return;
    }

    // Jika miliknya sendiri tetapi belum terverifikasi
    if (isOwner && !isVerified) {
      await sweet.error({
        title: "Toko Belum Terverifikasi",
        text: "Toko Anda belum diverifikasi oleh admin. Silahkan hubungi admin untuk melakukan verifikasi.",
      });
      return;
    }

    if (onToggleStore) {
      onToggleStore();
    }
  };

  const handleTikTokClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!tiktokShop?.url) return;
    event.preventDefault();
    const username = getUsername(tiktokShop.url);
    if (!username) return;
    const tiktokLink = `https://vt.tiktok.com/${username}`;
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = tiktokLink;
      return;
    }

    if (isTikTokLoading) return;
    setIsTikTokLoading(true);

    try {
      await sweet.warning({
  title: "Aplikasi TikTok",
  text: "Silakan buka ini melalui aplikasi TikTok.",
  confirmButtonText: "OK",
});

setTimeout(() => {
  window.location.reload();
}, 1000);
    } finally {
      setIsTikTokLoading(false);
    }
  };

  return (
    <div className="bg-slate-50">
      {/* BANNER */}
      <div className="relative w-full overflow-visible">
        <div className="relative h-52 overflow-hidden sm:h-64 md:h-72 lg:h-80">
          {toko.banner?.url ? (
            <Image src={toko.banner.url} alt={toko.name} fill unoptimized priority className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.025]" sizes="100vw" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-600 to-green-800" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-green-900/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_7s_ease-in-out_infinite]" />

          <div className="absolute inset-x-4 top-4 z-30 flex items-center justify-between">
            <button type="button" onClick={() => router.back()} className="h-9 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 active:scale-95">
              <ArrowLeft size={16} />
              Kembali
            </button>

            {isOwner && (
              <div className="relative z-30 animate-[fadeSlideDown_.5s_ease-out]">
                <button
                  type="button"
                  onClick={handleToggleClick}
                  aria-label={isActive ? "Tutup toko" : "Buka toko"}
                  className={`relative flex h-9 w-[92px] items-center rounded-full border border-white/30 p-1 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 ${
                    !isVerified 
                      ? "bg-gray-400/90 cursor-not-allowed opacity-80" 
                      : isActive 
                      ? "bg-emerald-600/90 hover:bg-emerald-700" 
                      : "bg-red-600/90 hover:bg-red-700"
                  }`}
                >
                  <span className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow-md transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] ${isActive && isVerified ? "right-1" : "left-1"}`} />
                  <span className={`absolute left-2.5 text-[10px] font-bold tracking-wide text-white transition-all duration-300 ${isActive && isVerified ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`}>OPEN</span>
                  <span className={`absolute right-2.5 text-[10px] font-bold tracking-wide text-white transition-all duration-300 ${isActive && isVerified ? "translate-x-1 opacity-0" : "translate-x-0 opacity-100"}`}>CLOSED</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STORE CARD */}
      <div className="relative z-20 -mt-20 px-3 sm:mx-5 sm:-mt-24 md:mx-8 md:px-5 lg:mx-auto lg:-mt-40 lg:px-8">
        <div className="group overflow-hidden rounded-3xl border border-white/30 bg-white/20 shadow-2xl shadow-green-950/20 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-green-950/30">
          <div className="relative h-1 overflow-hidden bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
            <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-white/50 blur-sm animate-[accentMove_3s_linear_infinite]" />
          </div>

          <div className="p-4 sm:p-5 md:p-6">
            {/* STORE INFO */}
            <div className="flex items-start gap-3 sm:gap-4">
              {/* LOGO */}
              <div className="relative h-16 w-16 shrink-0 overflow-visible rounded-2xl border border-white/60 bg-white/80 p-1.5 shadow-lg transition-transform duration-500 group-hover:scale-[1.04] sm:h-20 sm:w-20">
                <div className="relative h-full w-full overflow-hidden rounded-xl bg-white">
                  {toko.logo?.url ? (
                    <Image src={toko.logo.url} alt={toko.name} fill unoptimized className="object-contain p-2 transition-transform duration-700 group-hover:scale-110" sizes="80px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-green-600">
                      <span className="text-2xl font-bold text-white">{toko.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>

                {/* STATUS */}
                <span className={`absolute -right-1.5 -top-1.5 z-10 h-4 w-4 rounded-full border-2 border-white shadow-lg ${isActive && isVerified ? "bg-emerald-500 animate-[statusPulseStrong_1.8s_ease-in-out_infinite]" : "bg-red-500 animate-[statusPulseStrongRed_1.8s_ease-in-out_infinite]"}`} />
              </div>

              {/* NAME */}
              <div className="min-w-0 flex-1 pt-0.5 animate-[textReveal_.6s_.15s_ease-out_both]">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-lg font-bold tracking-tight text-white drop-shadow-md sm:text-xl md:text-2xl">{toko.name}</h1>
                  {isOwner && !isVerified ? (
                    <span className="inline-flex shrink-0 animate-[statusAppear_.35s_ease-out] items-center rounded-full border border-amber-200/70 bg-amber-500/90 px-2.5 py-1 text-[8px] font-bold text-white shadow-sm">Belum Verifikasi</span>
                  ) : !isActive && (
                    <span className="inline-flex shrink-0 animate-[statusAppear_.35s_ease-out] items-center rounded-full border border-red-200/70 bg-red-500/90 px-2.5 py-1 text-[8px] font-bold text-white shadow-sm">Toko Tutup</span>
                  )}
                </div>

                {locationName && (
                  <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1.5 text-lg text-white/85 transition-all duration-300 hover:translate-x-1 hover:text-white sm:text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/90 shadow-sm">
                      <Image src="/icon/maps.svg" alt="" width={13} height={13} />
                    </span>
                    <span className="truncate">{locationName}</span>
                  </a>
                )}
              </div>
            </div>

            {toko.description && <p className="mt-2 text-sm leading-relaxed text-slate-500 animate-[textReveal_.6s_.25s_ease-out_both] sm:text-white/90">{toko.description}</p>}

            {/* MARKETPLACE */}
            {(toko.phone || shopee?.url || tiktokShop?.url || tokopedia?.url) && (
              <div className="mt-5">
                <div className="flex flex-wrap gap-2">
                  {toko.phone && (
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200/70 bg-white/80 px-3 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-white hover:shadow-lg active:scale-95 sm:h-9 sm:justify-start sm:text-sm">
                      <Image src="/icon/whatsapp.svg" alt="" width={17} height={17} className="object-contain transition-transform duration-300 group-hover:scale-110" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  )}

                  {shopee?.url && (
                    <a href={getShopeeLink()} target="_blank" rel="noopener noreferrer" className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-orange-200/70 bg-white/80 px-3 text-xs font-semibold text-orange-600 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-white hover:shadow-lg active:scale-95 sm:h-9 sm:justify-start sm:text-sm">
                      <Image src="/icon/shopee.svg" alt="" width={18} height={18} className="object-contain transition-transform duration-300 group-hover:scale-110" />
                      <span className="hidden sm:inline">Shopee</span>
                    </a>
                  )}

                  {tiktokShop?.url && (
                    <a href={getTikTokLink()} onClick={handleTikTokClick} aria-disabled={isTikTokLoading} className={`group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-black/30 bg-white/80 px-3 text-xs font-semibold text-black shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-white hover:shadow-lg active:scale-95 sm:h-9 sm:justify-start sm:text-sm ${isTikTokLoading ? "pointer-events-none opacity-60" : ""}`}>
                      <Image src="/icon/tiktok.svg" alt="" width={18} height={18} className="object-contain transition-transform duration-300 group-hover:scale-110" />
                      <span className="hidden sm:inline">TikTok Shop</span>
                    </a>
                  )}

                  {tokopedia?.url && (
                    <a href={getTokopediaLink()} target="_blank" rel="noopener noreferrer" className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200/70 bg-white/80 px-3 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-white hover:shadow-lg active:scale-95 sm:h-9 sm:justify-start sm:text-sm">
                      <Image src="/icon/tokopedia.png" alt="" width={18} height={18} className="object-contain transition-transform duration-300 group-hover:scale-110" />
                      <span className="hidden sm:inline">Tokopedia</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-4 sm:h-5" />

      <style jsx>{`
        @keyframes fadeSlideDown {
          0% { opacity: 0; transform: translateY(-15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes textReveal {
          0% { opacity: 0; transform: translateX(-12px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes statusAppear {
          0% { opacity: 0; transform: scale(0.7); }
          70% { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes statusPulseStrong {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8); }
          50% { transform: scale(1.18); box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); }
        }
        @keyframes statusPulseStrongRed {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.8); }
          50% { transform: scale(1.18); box-shadow: 0 0 0 5px rgba(239, 68, 68, 0); }
        }
        @keyframes accentMove {
          0% { left: -35%; }
          100% { left: 120%; }
        }
        @keyframes shimmer {
          0% { left: -50%; }
          35%, 100% { left: 150%; }
        }
      `}</style>
    </div>
  );
}