// components/news/NewsModal.tsx

"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, CalendarDays, MapPin, Images, User, Globe } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";
import type { News } from "@/modules/news/types/news.types";

interface Props {
  open: boolean;
  news: News;
  onClose: () => void;
}

export default function NewsModal({ open, news, onClose }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  function getPlatformIcon(platform: string | null) {
    switch (platform) {
      case "facebook": return <FaFacebookF />;
      case "instagram": return <FaInstagram />;
      case "tiktok": return <FaTiktok />;
      case "youtube": return <FaYoutube />;
      case "x": return <FaXTwitter />;
      default: return <Globe size={16} />;
    }
  }

  const formatDate = new Date(news.content_date || news.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} aria-label="Tutup" className="absolute right-5 top-5 z-20 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70">
          <X size={20} />
        </button>

        {/* Thumbnail */}
        {news.thumbnail_url && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl">
            <Image src={news.thumbnail_url} alt={news.title} fill className="object-cover" />
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Category */}
          <span className="inline-flex rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">{news.category}</span>

          {/* Title */}
          <h1 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900 md:text-3xl">{news.title}</h1>

          {/* Info */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} />
              {formatDate}
            </span>

            {news.content_location && (
              <>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {news.content_location}
                </span>
              </>
            )}

            <span>•</span>

            <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <User size={14} />
              Admin Desa
            </span>
          </div>

          {/* Social Links */}
          {news.news_links && news.news_links.length > 0 && (
            <div className="mt-5 flex items-center gap-3">
              {news.news_links.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-emerald-600 hover:text-white">
                  {getPlatformIcon(link.platform)}
                </a>
              ))}
            </div>
          )}

          {/* Excerpt */}
          {news.excerpt && <p className="mt-6 leading-7 text-slate-600">{news.excerpt}</p>}

          {/* Documentation */}
          {news.news_images && news.news_images.length > 0 && (
            <section className="mt-8 border-t pt-6">
              <div className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                <Images size={20} />
                Dokumentasi
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {news.news_images.map((image) => (
                  <div key={image.id} className="relative aspect-square overflow-hidden rounded-2xl">
                    <Image src={image.image_url} alt="Dokumentasi" fill className="object-cover transition duration-500 hover:scale-110" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Content */}
          {news.content && <div className="mt-8 border-t pt-6 whitespace-pre-line leading-8 text-slate-700">{news.content}</div>}
        </div>
      </div>
    </div>
  );
}