// components/dashboard/news/TableNews.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Pencil, Trash2, Plus, Newspaper, RotateCcw, Globe, Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { FaYoutube, FaInstagram, FaFacebook, FaTiktok, FaTwitter } from "react-icons/fa";
import Swal from "sweetalert2";
import SearchInput from "@/components/shared/table/SearchInput";
import type { News } from "@/modules/dashboard/news/types/news.types";

interface Props {
  news: News[];
  loading: boolean;
  search: string;
  category: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onCategoryChange: (value: string) => void;
  onAdd: () => void;
  onEdit: (data: News) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleFeatured: (id: string, value: boolean) => Promise<void>;
  onReset: () => void;
}

const CATEGORY_LABELS: Record<string, string> = { news: "Berita", announcement: "Pengumuman", event: "Kegiatan" };

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function limitText(text: string | null, limit: number) {
  if (!text) return "-";
  return text.length <= limit ? text : text.substring(0, limit) + "...";
}

function PlatformIcon({ platform }: { platform: string | null }) {
  switch (platform) {
    case "youtube": return <FaYoutube size={16} />;
    case "instagram": return <FaInstagram size={16} />;
    case "facebook": return <FaFacebook size={16} />;
    case "tiktok": return <FaTiktok size={16} />;
    case "website": return <Globe size={16} />;
    case "x": return <FaTwitter size={16} />;
    default: return <Globe size={16} />;
  }
}

export default function TableNews({ news, loading, search, category, onSearchChange, onSearch, onCategoryChange, onAdd, onEdit, onDelete, onToggleFeatured, onReset }: Props) {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  function openGallery(item: News, index = 0) {
    if (!item.news_images || item.news_images.length === 0) return;
    setSelectedNews(item);
    setSelectedImageIndex(index);
  }

  function closeGallery() {
    setSelectedNews(null);
    setSelectedImageIndex(0);
  }

  function previousImage() {
    if (!selectedNews?.news_images?.length) return;
    setSelectedImageIndex((curr) => (curr === 0 ? selectedNews.news_images!.length - 1 : curr - 1));
  }

  function nextImage() {
    if (!selectedNews?.news_images?.length) return;
    setSelectedImageIndex((curr) => (curr === selectedNews.news_images!.length - 1 ? 0 : curr + 1));
  }

  async function handleDelete(id: string) {
    const result = await Swal.fire({ title: "Hapus berita?", text: "Berita dan data terkait akan dihapus permanen", icon: "warning", showCancelButton: true, confirmButtonText: "Hapus", cancelButtonText: "Batal", confirmButtonColor: "#dc2626" });
    if (!result.isConfirmed) return;
    try {
      await onDelete(id);
      Swal.fire({ icon: "success", title: "Berhasil", text: "Berita berhasil dihapus", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Gagal", text: "Gagal menghapus berita" });
    }
  }

  async function handleFeatured(item: News) {
    const value = !item.is_featured;
    const result = await Swal.fire({
      title: value ? "Jadikan berita unggulan?" : "Hapus dari berita unggulan?",
      text: value ? "Berita akan muncul di carousel halaman utama" : "Berita tidak tampil di carousel",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      confirmButtonColor: "#16a34a",
    });

    if (!result.isConfirmed) return;

    try {
      await onToggleFeatured(item.id, value);
      Swal.fire({ icon: "success", title: "Berhasil", text: value ? "Berita menjadi unggulan" : "Berita dihapus dari unggulan", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Gagal", text: "Maksimal hanya 5 berita unggulan" });
    }
  }

  if (loading) {
    return <div className="rounded-xl bg-white p-10 text-center text-gray-500">Memuat data berita...</div>;
  }

  const hasFilter = Boolean(search) || Boolean(category);
  const emptyDatabase = news.length === 0 && !hasFilter;
  const selectedImages = selectedNews?.news_images ?? [];
  const selectedImage = selectedImages[selectedImageIndex];

  return (
    <>
      <div className="space-y-4">
        {/* HEADER */}
        <div className="rounded-xl bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Berita Desa</h3>
              <p className="text-sm text-gray-500">Kelola informasi dan kegiatan desa</p>
            </div>
            <button onClick={onAdd} className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
              <Plus size={16} /> Tambah
            </button>
          </div>

          {/* FILTER */}
          {!emptyDatabase && (
            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className="h-11 rounded-lg border border-gray-300 px-4 text-sm">
                <option value="">Semua kategori</option>
                <option value="news">Berita</option>
                <option value="announcement">Pengumuman</option>
                <option value="event">Kegiatan</option>
              </select>
              <div className="flex gap-3">
                <SearchInput value={search} placeholder="Cari berita..." onChange={onSearchChange} onSearch={onSearch} />
                {hasFilter && (
                  <button onClick={onReset} className="flex h-11 items-center gap-2 rounded-lg border px-4 text-sm hover:bg-gray-50">
                    <RotateCcw size={15} /> Reset
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* EMPTY STATES */}
        {emptyDatabase && (
          <div className="rounded-xl bg-white p-12 text-center">
            <Newspaper size={48} className="mx-auto text-green-500" />
            <p className="mt-3 font-medium text-gray-700">Belum ada berita</p>
            <p className="mt-1 text-sm text-gray-400">Silakan tambahkan berita desa</p>
          </div>
        )}

        {news.length === 0 && hasFilter && (
          <div className="rounded-xl bg-white p-12 text-center">
            <Newspaper size={48} className="mx-auto text-gray-400" />
            <p className="mt-3 font-medium text-gray-700">Data tidak ditemukan</p>
            <p className="mt-1 text-sm text-gray-400">Coba ubah pencarian atau kategori</p>
          </div>
        )}

        {/* TABLE */}
        {news.length > 0 && (
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-[1500px] text-sm">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-3 text-left">No</th>
                    <th className="px-6 py-3 text-left">Tanggal</th>
                    <th className="px-6 py-3 text-left">Nama Berita</th>
                    <th className="px-6 py-3 text-left">Lokasi</th>
                    <th className="px-6 py-3 text-left">Deskripsi</th>
                    <th className="px-6 py-3 text-left">Isi</th>
                    <th className="px-6 py-3 text-left">Link</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {news.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="whitespace-nowrap px-6 py-4">{formatDate(item.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <div className="relative h-14 w-24 overflow-hidden rounded-lg bg-gray-100">
                            {item.thumbnail_url ? (
                              <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover" />
                            ) : (
                              <Newspaper className="m-auto mt-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              {item.is_featured && <Star size={16} className="text-yellow-500" fill="currentColor" />}
                              <p className="max-w-[250px] font-medium text-gray-900">{item.title}</p>
                            </div>
                            <button type="button" onClick={() => handleFeatured(item)} className={`mt-1 text-xs hover:underline ${item.is_featured ? "text-yellow-600" : "text-gray-500"}`}>
                              {item.is_featured ? "Hapus dari unggulan" : "Jadikan unggulan"}
                            </button>
                            <button type="button" onClick={() => openGallery(item)} disabled={!item.news_images || item.news_images.length === 0} className="mt-1 flex items-center gap-1 text-xs text-green-600 hover:underline disabled:cursor-default disabled:text-gray-400 disabled:no-underline">
                              <Images size={13} />
                              {item.news_images?.length ?? 0} foto
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{item.content_location ?? "-"}</td>
                      <td className="max-w-[260px] px-6 py-4 text-gray-600">{limitText(item.excerpt, 80)}</td>
                      <td className="max-w-[320px] px-6 py-4 text-gray-600">{limitText(item.content, 120)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {item.news_links?.map((link) => (
                            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100" title={link.platform ?? "Link"}>
                              <PlatformIcon platform={link.platform} />
                            </a>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => onEdit(item)} className="rounded-lg p-2 hover:bg-gray-100" title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* GALLERY MODAL */}
      {selectedNews && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={closeGallery}>
          <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">Dokumentasi Berita</h3>
                <p className="mt-0.5 max-w-[700px] truncate text-sm text-gray-500">{selectedNews.title}</p>
              </div>
              <button type="button" onClick={closeGallery} className="ml-4 shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="Tutup">
                <X size={20} />
              </button>
            </div>

            <div className="relative flex h-[60vh] min-h-[350px] items-center justify-center bg-gray-950">
              <Image src={selectedImage.image_url} alt={`${selectedNews.title} - Foto ${selectedImageIndex + 1}`} fill className="object-contain" sizes="(max-width: 1280px) 100vw, 1024px" />
              {selectedImages.length > 1 && (
                <button type="button" onClick={previousImage} className="absolute left-4 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70" title="Foto sebelumnya">
                  <ChevronLeft size={24} />
                </button>
              )}
              {selectedImages.length > 1 && (
                <button type="button" onClick={nextImage} className="absolute right-4 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70" title="Foto berikutnya">
                  <ChevronRight size={24} />
                </button>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs font-medium text-white">
                {selectedImageIndex + 1} / {selectedImages.length}
              </div>
            </div>

            {selectedImages.length > 1 && (
              <div className="border-t bg-white p-4">
                <div className="flex gap-3 overflow-x-auto">
                  {selectedImages.map((image, index) => (
                    <button key={image.id ?? `${image.image_url}-${index}`} type="button" onClick={() => setSelectedImageIndex(index)} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${index === selectedImageIndex ? "border-green-600" : "border-transparent"}`}>
                      <Image src={image.image_url} alt={`Thumbnail ${index + 1}`} fill className="object-cover" sizes="96px" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}