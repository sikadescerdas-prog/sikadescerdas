// components/literature/card/CardArtikel.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { sweet } from "@/shared/utils/sweet";
import ModalCard from "./ModalCard";
import { FaArrowRight, FaEdit, FaEllipsisV, FaEye, FaEyeSlash, FaFileAlt, FaGlobe, FaTrash } from "react-icons/fa";
import { SiFacebook, SiInstagram, SiTiktok, SiX, SiYoutube } from "react-icons/si";
import type { Literature } from "@/modules/literature/types/literature.types";

interface CardArtikelProps {
  item: Literature;
  isAdmin: boolean;
  isMine: boolean;
  onOpenModal: (item: Literature) => void;
  onEdit: (item: Literature) => void;
  onDelete: (id: string, type: string) => Promise<void>;
  onToggleActive: (item: Literature) => Promise<void>;
}

const getTimeAgo = (date?: string | null) => {
  if (!date) return "-";
  const created = new Date(date).getTime();
  if (Number.isNaN(created)) return "-";

  const diff = Math.max(0, Date.now() - created);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "baru";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}j`;
  if (days < 7) return `${days}h`;
  if (weeks < 5) return `${weeks}mg`;
  if (months < 12) return `${months}bln`;
  return `${years}th`;
};

const getCategoryStyle = (category: string) => {
  const value = category.toLowerCase();

  if (value.includes("development") || value.includes("teknologi") || value.includes("digital")) {
    return { bg: "bg-emerald-500/90", shadow: "shadow-emerald-900/20" };
  }
  if (value.includes("pendidikan") || value.includes("education")) {
    return { bg: "bg-blue-500/90", shadow: "shadow-blue-900/20" };
  }
  if (value.includes("kesehatan") || value.includes("health")) {
    return { bg: "bg-rose-500/90", shadow: "shadow-rose-900/20" };
  }
  if (value.includes("ekonomi") || value.includes("umkm") || value.includes("bisnis")) {
    return { bg: "bg-orange-500/90", shadow: "shadow-orange-900/20" };
  }
  if (value.includes("budaya") || value.includes("seni")) {
    return { bg: "bg-purple-500/90", shadow: "shadow-purple-900/20" };
  }

  return { bg: "bg-gray-700/90", shadow: "shadow-gray-900/20" };
};

export default function CardArtikel({ item, isAdmin, isMine, onOpenModal, onEdit, onDelete, onToggleActive }: CardArtikelProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const authorName = useMemo(() => item.users?.profiles?.fullname ?? item.users?.username ?? "Pengguna", [item.users]);
  const avatarUrl = useMemo(() => item.users?.profiles?.avatar_url ?? null, [item.users]);
  const categoryName = useMemo(() => item.literature_categories?.name ?? "Development", [item.literature_categories]);
  const description = useMemo(() => item.description ?? "Tidak ada deskripsi.", [item.description]);
  const timeAgo = useMemo(() => getTimeAgo(item.created_at), [item.created_at]);
  const categoryStyle = useMemo(() => getCategoryStyle(categoryName), [categoryName]);

  const canManage = isAdmin || isMine;

  const links = useMemo(() => {
    const map = new Map<string, string>();
    item.literature_links?.forEach((link) => {
      if (link.platform && link.url) {
        map.set(link.platform, link.url);
      }
    });
    return map;
  }, [item.literature_links]);

  const socialLinks = useMemo(() => Array.from(links.entries()), [links]);
  const hasLinks = socialLinks.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenModal = () => {
    setOpenMenu(false);
    setOpenModal(true);
    onOpenModal(item);
  };

  const handleLinkClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const SocialLinks = ({ mobile = false }: { mobile?: boolean }) => {
    if (!hasLinks) return null;
    const size = mobile ? "h-7 w-7" : "h-9 w-9";
    const iconSize = mobile ? "h-3 w-3" : "h-4 w-4";

    return (
      <div className={`flex items-center ${mobile ? "gap-1" : "gap-1.5"}`}>
        {socialLinks.map(([platform, url]) => {
          let icon = null;
          let style = "bg-gray-100 text-gray-600";

          switch (platform.toLowerCase()) {
            case "youtube":
              icon = <SiYoutube className={iconSize} />;
              style = "bg-red-50 text-red-500";
              break;
            case "tiktok":
              icon = <SiTiktok className={iconSize} />;
              style = "bg-gray-100 text-gray-700";
              break;
            case "instagram":
              icon = <SiInstagram className={iconSize} />;
              style = "bg-pink-50 text-pink-500";
              break;
            case "facebook":
              icon = <SiFacebook className={iconSize} />;
              style = "bg-blue-50 text-blue-600";
              break;
            case "twitter":
            case "x":
              icon = <SiX className={iconSize} />;
              style = "bg-sky-50 text-sky-600";
              break;
            case "website":
            case "web":
              icon = <FaGlobe className={iconSize} />;
              style = "bg-green-50 text-green-600";
              break;
          }

          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className={`flex ${size} items-center justify-center rounded-lg shadow-sm transition hover:-translate-y-0.5 ${style}`}
            >
              {icon}
            </a>
          );
        })}
      </div>
    );
  };

  const MenuContent = () => (
    <div className="absolute right-0 top-11 z-[9999] w-44 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
      {isMine && (
        <button
          type="button"
          onClick={() => {
            setOpenMenu(false);
            onEdit(item);
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-gray-600 hover:bg-green-50 hover:text-green-600"
        >
          <FaEdit /> Edit
        </button>
      )}

      {(isAdmin || isMine) && (
        <button
          type="button"
          onClick={async () => {
            setOpenMenu(false);
            await onToggleActive(item);
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          {item.is_active ? (
            <><FaEyeSlash className="text-gray-400" /> Hidden</>
          ) : (
            <><FaEye className="text-green-500" /> Visible</>
          )}
        </button>
      )}

      {(isAdmin || isMine) && (
        <>
          <div className="my-1 border-t border-gray-100" />
          <button
            type="button"
            onClick={async () => {
              setOpenMenu(false);
              const confirmed = await sweet.confirmDanger({
                title: "Hapus Artikel?",
                text: "Data literasi yang dihapus tidak dapat dikembalikan.",
                confirmButtonText: "Delete",
                cancelText: "Cancel",
              });
              if (!confirmed) return;
              await onDelete(item.slug, item.type);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-500 hover:bg-red-50"
          >
            <FaTrash /> Hapus
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      <article className="group relative w-full overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl">
        {!item.is_active && (
          <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-black/45 backdrop-blur-[2px]">
            <div className="flex h-full items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl">
                <FaEyeSlash className="text-red-600" size={28} />
              </div>
            </div>
          </div>
        )}

        {/* MOBILE */}
        <div className="flex min-h-[150px] overflow-hidden rounded-2xl md:hidden">
          <div className="relative w-[30%] min-w-[105px] overflow-hidden bg-gray-100">
            {item.thumbnail_url ? (
              <Image src={item.thumbnail_url} alt={item.title} fill sizes="30vw" className="object-cover transition duration-500 group-hover:scale-105" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                <FaFileAlt className="h-8 w-8 text-green-400/60" />
              </div>
            )}
            <div className="absolute left-2 top-2 z-10">
              <span className={`rounded-md px-2 py-1 text-[8px] font-bold text-white shadow ${categoryStyle.bg}`}>{categoryName}</span>
            </div>
            {hasLinks && (
              <div className="absolute bottom-2 right-2 z-10">
                <SocialLinks mobile />
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={authorName} width={12} height={12} className="rounded-full" />
                ) : (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[8px] text-white">
                    {authorName.charAt(0)}
                  </div>
                )}
                <span className="text-[9px] font-semibold text-gray-600">{authorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-gray-400">{timeAgo}</span>
                {canManage && (
                  <div ref={menuRef} className="relative z-30">
                    <button type="button" onClick={() => setOpenMenu(!openMenu)} className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100">
                      <FaEllipsisV className="h-3 w-3" />
                    </button>
                    {openMenu && <MenuContent />}
                  </div>
                )}
              </div>
            </div>

            <button type="button" onClick={handleOpenModal} className="mt-2 text-left">
              <h3 className="line-clamp-2 text-[13px] font-bold text-gray-800 transition group-hover:text-green-600">{item.title}</h3>
            </button>
            <p className="mt-1 line-clamp-2 text-[10px] text-gray-400">{description}</p>
            <button type="button" onClick={handleOpenModal} className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] font-semibold text-green-600">
              <span>Lihat selengkapnya</span>
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block">
          <div className="relative aspect-video overflow-visible rounded-t-2xl bg-gray-100">
            <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
              {item.thumbnail_url ? (
                <Image src={item.thumbnail_url} alt={item.title} fill sizes="(max-width:1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
                  <FaFileAlt className="h-10 w-10 text-green-400/60" />
                </div>
              )}
            </div>
            <div className="absolute left-3 top-3 z-10">
              <span className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md ${categoryStyle.bg}`}>{categoryName}</span>
            </div>
            {hasLinks && (
              <div className="absolute bottom-3 right-3 z-10">
                <SocialLinks />
              </div>
            )}
            {canManage && (
              <div ref={menuRef} className="absolute right-3 top-3 z-30">
                <button
                  type="button"
                  onClick={() => setOpenMenu(!openMenu)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-md transition ${openMenu ? "border-green-200 bg-white text-green-600" : "border-white/70 bg-white/90 text-gray-500"}`}
                >
                  <FaEllipsisV className="h-3.5 w-3.5" />
                </button>
                {openMenu && <MenuContent />}
              </div>
            )}
          </div>

          <div className="flex flex-col p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={authorName} width={16} height={16} className="h-8 w-8 rounded-full object-cover ring-2 ring-green-50" />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-[11px] font-bold text-white">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[160px] truncate text-[11px] font-semibold text-gray-600">{authorName}</span>
              </div>
              <span className="text-[11px] text-gray-400">{timeAgo}</span>
            </div>

            <button type="button" onClick={handleOpenModal} className="mt-3 text-left">
              <h3 className="line-clamp-2 text-[18px] font-bold text-gray-800 transition group-hover:text-green-600">{item.title}</h3>
            </button>
            <p className="mt-1 line-clamp-2 min-h-[36px] text-[11px] text-gray-400">{description}</p>
            <button type="button" onClick={handleOpenModal} className="mt-4 flex w-full items-center justify-between border-t border-gray-100 pt-3 text-[11px] font-semibold text-green-600">
              <span>Lihat selengkapnya</span>
              <FaArrowRight />
            </button>
          </div>
        </div>
      </article>

      {openModal && <ModalCard item={item} onClose={() => setOpenModal(false)} />}
    </>
  );
}