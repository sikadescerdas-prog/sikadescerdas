// components/literature/card/CardBook.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { sweet } from "@/shared/utils/sweet";
import type { Literature } from "@/modules/literature/types/literature.types";
import ModalCard from "./ModalCard";
import { FaArrowRight, FaBookOpen, FaEdit, FaEllipsisV, FaEye, FaEyeSlash, FaExternalLinkAlt, FaFilePdf, FaTrash } from "react-icons/fa";

interface CardBookProps {
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

export default function CardBook({ item, isAdmin, isMine, onOpenModal, onEdit, onDelete, onToggleActive }: CardBookProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const authorName = useMemo(() => item.users?.profiles?.fullname ?? item.users?.username ?? "Pengguna", [item.users]);
  const avatarUrl = useMemo(() => item.users?.profiles?.avatar_url ?? null, [item.users]);
  const description = useMemo(() => item.description ?? "Tidak ada deskripsi.", [item.description]);
  const timeAgo = useMemo(() => getTimeAgo(item.created_at), [item.created_at]);

  const canManage = isAdmin || isMine;
  const hasPdf = Boolean(item.file_url);
  const hasBookLink = Boolean(item.book_url);

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

  const MenuContent = () => (
    <div className="absolute right-0 top-11 z-[99] w-44 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
      {isMine && (
        <button
          type="button"
          onClick={() => {
            setOpenMenu(false);
            onEdit(item);
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600"
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
                title: "Hapus Buku?",
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
      <article className="group relative w-full overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
        {!item.is_active && (
          <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-black/45 backdrop-blur-[2px]">
            <div className="flex h-full items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl">
                <FaEyeSlash size={28} className="text-red-600" />
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
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <FaBookOpen className="h-8 w-8 text-blue-400/60" />
              </div>
            )}
            <div className="absolute left-2 top-2 z-10">
              <span className="rounded-md bg-blue-500/90 px-2 py-1 text-[8px] font-bold uppercase text-white shadow">BUKU</span>
            </div>
            {(hasPdf || hasBookLink) && (
              <div className="absolute bottom-2 right-2 z-10 flex gap-1">
                {hasPdf && (
                  <a href={item.file_url!} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-red-500 shadow-md">
                    <FaFilePdf className="h-3 w-3" />
                  </a>
                )}
                {hasBookLink && (
                  <a href={item.book_url!} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-blue-600 shadow-md">
                    <FaExternalLinkAlt className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={authorName} width={12} height={12} className="rounded-full" />
                ) : (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[8px] text-white">
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
              <h3 className="line-clamp-2 text-[13px] font-bold text-gray-800 transition group-hover:text-blue-600">{item.title}</h3>
            </button>
            <p className="mt-1 line-clamp-2 text-[10px] text-gray-400">{description}</p>
            <button type="button" onClick={handleOpenModal} className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] font-semibold text-blue-600">
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
                <Image src={item.thumbnail_url} alt={item.title} fill sizes="33vw" className="object-cover transition duration-700 group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
                  <FaBookOpen className="h-10 w-10 text-blue-400/60" />
                </div>
              )}
            </div>
            <div className="absolute left-3 top-3 z-10">
              <span className="rounded-lg bg-blue-500/90 px-3 py-1.5 text-[10px] font-bold uppercase text-white shadow">BUKU</span>
            </div>
            <div className="absolute bottom-3 right-3 z-10 flex gap-2">
              {hasPdf && (
                <a href={item.file_url!} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex h-9 items-center gap-2 rounded-xl bg-red-50 px-3 text-xs font-semibold text-red-600 shadow">
                  <FaFilePdf /> PDF
                </a>
              )}
              {hasBookLink && (
                <a href={item.book_url!} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow">
                  <FaExternalLinkAlt />
                </a>
              )}
            </div>
            {canManage && (
              <div ref={menuRef} className="absolute right-3 top-3 z-30">
                <button type="button" onClick={() => setOpenMenu(!openMenu)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-gray-600 shadow">
                  <FaEllipsisV />
                </button>
                {openMenu && <MenuContent />}
              </div>
            )}
          </div>

          <div className="flex flex-col p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={authorName} width={16} height={16} className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-50" />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-sky-500 text-[11px] font-bold text-white">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[160px] truncate text-[11px] font-semibold text-gray-600">{authorName}</span>
              </div>
              <span className="text-[11px] text-gray-400">{timeAgo}</span>
            </div>

            <button type="button" onClick={handleOpenModal} className="mt-3 text-left">
              <h3 className="line-clamp-2 text-[18px] font-bold text-gray-800 transition group-hover:text-blue-600">{item.title}</h3>
            </button>
            <p className="mt-1 line-clamp-2 min-h-[36px] text-[11px] text-gray-400">{description}</p>
            <button type="button" onClick={handleOpenModal} className="mt-4 flex w-full items-center justify-between border-t border-gray-100 pt-3 text-[11px] font-semibold text-blue-600">
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