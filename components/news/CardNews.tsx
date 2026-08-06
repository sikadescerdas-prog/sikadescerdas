// components/news/CardNews.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight, User, Maximize2, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaGlobe, FaXTwitter } from "react-icons/fa6";
import type { News } from "@/modules/news/types/news.types";
import NewsModal from "./NewsModal";

interface Props {
  news: News;
}

export default function CardNews({ news }: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [openLightbox, setOpenLightbox] = useState(false);

  const categoryStyle = {
    news: "bg-blue-50 text-blue-700",
    announcement: "bg-amber-50 text-amber-700",
    event: "bg-emerald-50 text-emerald-700",
  }[news.category] ?? "bg-slate-100 text-slate-700";

  const formatDate = new Date(news.content_date || news.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        {/* Thumbnail dengan Tombol Perbesar Foto */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {news.thumbnail_url && (
            <Image src={news.thumbnail_url} alt={news.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

          {/* Tombol Trigger Lightbox */}
          {news.thumbnail_url && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenLightbox(true);
              }}
              className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-semibold shadow-lg z-10"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Perbesar</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            {/* Category */}
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryStyle}`}>{news.category}</span>

            {/* Date + Admin */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <CalendarDays size={14} />
                {formatDate}
              </span>
              <span>•</span>
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                <User size={12} />
                Admin Desa
              </div>
            </div>

            {/* Title */}
            <h2 className="mt-3 line-clamp-2 text-xl font-bold leading-snug text-slate-900 group-hover:text-emerald-600">{news.title}</h2>

            {/* Location */}
            {news.content_location && (
              <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                <MapPin size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                <span className="line-clamp-1">{news.content_location}</span>
              </p>
            )}

            {/* Excerpt */}
            {news.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{news.excerpt}</p>}
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            {/* Social Links */}
            <div className="flex items-center gap-3 text-slate-400">
              {news.news_links?.map((link) => {
                const platform = link.platform;
                const icon = platform === "facebook" ? <FaFacebookF /> : platform === "instagram" ? <FaInstagram /> : platform === "tiktok" ? <FaTiktok /> : platform === "youtube" ? <FaYoutube /> : platform === "x" ? <FaXTwitter /> : <FaGlobe />;

                return (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="transition hover:scale-110 hover:text-emerald-600" onClick={(e) => e.stopPropagation()}>
                    {icon}
                  </a>
                );
              })}
            </div>

            {/* Modal Button */}
            <button onClick={() => setOpenModal(true)} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-all hover:gap-3 hover:text-emerald-700">
              Lihat Selengkapnya
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </article>

      {/* Detail Modal */}
      <NewsModal open={openModal} news={news} onClose={() => setOpenModal(false)} />

      {/* Lightbox Modal untuk Preview Foto Ukuran Penuh */}
      {openLightbox && news.thumbnail_url && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setOpenLightbox(false)}>
          <button type="button" onClick={() => setOpenLightbox(false)} className="absolute top-5 right-5 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10">
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-4xl max-h-[85vh] aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <Image src={news.thumbnail_url} alt={news.title} fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}