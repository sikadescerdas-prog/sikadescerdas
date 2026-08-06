// components/literature/card/ModalCard.tsx

"use client";

import Image from "next/image";
import { FaBook, FaClock, FaExternalLinkAlt, FaGlobe, FaInstagram, FaTimes, FaUser } from "react-icons/fa";
import { SiFacebook, SiTiktok, SiX, SiYoutube } from "react-icons/si";
import { QRCodeSVG } from "qrcode.react";
import type { Literature } from "@/modules/literature/types/literature.types";

interface ModalCardProps {
  item: Literature;
  onClose: () => void;
}

export default function ModalCard({ item, onClose }: ModalCardProps) {
  const authorName = item.users?.profiles?.fullname ?? item.users?.username ?? "Pengguna";
  const category = item.literature_categories?.name ?? "-";
  const links = item.literature_links ?? [];
  const socialLinks = links.slice(0, 7);
  const bookLink = item.book_url ?? item.file_url ?? null;

  const socialIcon = (platform?: string | null) => {
    switch (platform?.toLowerCase()) {
      case "youtube": return <SiYoutube className="h-5 w-5 text-red-500" />;
      case "tiktok": return <SiTiktok className="h-5 w-5 text-gray-800" />;
      case "instagram": return <FaInstagram className="h-5 w-5 text-pink-500" />;
      case "facebook": return <SiFacebook className="h-5 w-5 text-blue-600" />;
      case "x":
      case "twitter": return <SiX className="h-5 w-5 text-sky-600" />;
      case "website":
      case "web": return <FaGlobe className="h-5 w-5 text-green-600" />;
      default: return null;
    }
  };

  const socialStyle = (platform?: string | null) => {
    switch (platform?.toLowerCase()) {
      case "youtube": return "bg-red-50 border-red-100";
      case "tiktok": return "bg-gray-50 border-gray-200";
      case "instagram": return "bg-pink-50 border-pink-100";
      case "facebook": return "bg-blue-50 border-blue-100";
      case "x":
      case "twitter": return "bg-sky-50 border-sky-100";
      case "website":
      case "web": return "bg-green-50 border-green-100";
      default: return "bg-gray-50 border-gray-100";
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div onClick={(e) => e.stopPropagation()} className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-lg transition hover:bg-gray-100">
          <FaTimes />
        </button>

        {/* THUMBNAIL */}
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          {item.thumbnail_url ? (
            <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <FaBook className="h-16 w-16 text-green-400" />
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="space-y-6 p-6 md:p-8">
          {/* TYPE */}
          <span className={`inline-flex rounded-full px-4 py-1 text-xs font-bold uppercase ${item.type === "article" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {item.type}
          </span>

          {/* TITLE */}
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">{item.title}</h1>

          {/* META */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2"><FaUser />{authorName}</span>
            <span className="flex items-center gap-2"><FaClock />{new Date(item.created_at).toLocaleDateString("id-ID")}</span>
            {item.type === "article" && <span className="flex items-center gap-2"><FaBook />{category}</span>}
          </div>

          {/* DESCRIPTION */}
          {item.description && (
            <div>
              <h3 className="mb-2 font-semibold text-gray-700">Deskripsi</h3>
              <p className="leading-relaxed text-gray-600">{item.description}</p>
            </div>
          )}

          {/* ARTICLE CONTENT */}
          {item.type === "article" && item.content && (
            <div>
              <h3 className="mb-2 font-semibold text-gray-700">Isi Artikel</h3>
              <div className="whitespace-pre-line leading-relaxed text-gray-600">{item.content}</div>
            </div>
          )}

          {/* SOCIAL LINKS */}
          {item.type === "article" && socialLinks.length > 0 && (
            <div>
              <h3 className="mb-3 font-semibold text-gray-700">Social Link</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 md:grid-cols-3">
                {socialLinks.map((link) => (
                  <a key={link.id ?? link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition hover:-translate-y-1 hover:shadow-md ${socialStyle(link.platform)}`}>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">{socialIcon(link.platform)}</span>
                    <span className="text-sm font-semibold capitalize text-gray-700">{link.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* BOOK */}
          {item.type === "book" && bookLink && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <div className="flex flex-col items-center gap-5">
                <a href={bookLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                  <FaExternalLinkAlt /> Buka Buku
                </a>
                <QRCodeSVG value={bookLink} size={180} />
                <p className="text-center text-xs text-gray-500">Scan QR untuk membuka file buku</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}