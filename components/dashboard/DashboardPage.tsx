// modules/dashboard/home/components/DashboardPage.tsx

"use client";

import React from "react";
import { useDashboard } from "@/modules/dashboard/home/hooks/useDashboard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PopulationComparisonCard } from "@/components/dashboard/PopulationComparisonCard";
import { ListCard } from "@/components/dashboard/ListCard";
import { Users, Store, ShoppingBag, Newspaper, BookOpen, Building2, Loader2, AlertCircle, Sparkles, Activity } from "lucide-react";

export default function DashboardPage() {
  const { dashboardData, isLoading, isError, errorMessage, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 rounded-full bg-emerald-500/15 animate-ping" />
          <div className="absolute h-12 w-12 rounded-full bg-emerald-500/25 animate-pulse" />
          <Loader2 className="relative z-10 h-8 w-8 text-emerald-600 animate-spin" />
        </div>
        <p className="text-sm font-medium tracking-wide text-gray-500 animate-pulse">Menyiapkan analitik interaktif SIKADES...</p>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="flex items-center space-x-4 rounded-3xl border border-red-200/60 bg-red-50/80 p-6 text-red-700 shadow-xl backdrop-blur-md">
        <div className="rounded-2xl bg-red-100 p-3.5 shadow-inner">
          <AlertCircle className="h-6 w-6 shrink-0 text-red-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Gagal Memuat Dashboard</h3>
          <p className="mt-0.5 text-sm text-gray-600">{errorMessage || "Terjadi kesalahan saat mengambil data dari server."}</p>
          <button onClick={refetch} className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-red-700 hover:shadow-red-500/20 active:scale-95">Coba Lagi</button>
        </div>
      </div>
    );
  }

  const { stats, population_comparison, lists } = dashboardData;

  return (
    <div className="space-y-8 pb-16">
      {/* HERO BANNER - GREEN LIGHT THEME */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-300/60 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-7 text-white shadow-xl md:p-9">
        <div className="absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute left-1/3 -top-20 h-48 w-48 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white shadow-inner backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-200 animate-ping" />
              Sistem Informasi Desa Danasari • Panel Kontrol Utama
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl text-white">Dashboard Eksekutif</h1>
            <p className="max-w-xl text-sm leading-relaxed text-emerald-50">Pusat monitoring terintegrasi data kependudukan, ekonomi digital, infrastruktur, dan transparansi publik secara real-time.</p>
          </div>

          <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-white/25 bg-white/15 p-4 shadow-inner backdrop-blur-md">
            <div className="h-3 w-3 rounded-full bg-emerald-200 shadow-lg shadow-emerald-200/50 animate-pulse" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-100">Koneksi Sistem</p>
              <p className="text-sm font-bold tracking-wide text-white">Sinkron & Aman</p>
            </div>
          </div>
        </div>
      </div>

      {/* STATS SECTION HEADER */}
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-emerald-100/60 pb-3 sm:flex-row sm:items-end">
          <div className="relative space-y-1">
            <div className="absolute -left-3 bottom-0 top-0 w-1.5 rounded-full bg-gradient-to-b from-emerald-500 via-teal-500 to-green-500 shadow-lg shadow-emerald-500/30" />
            <div className="space-y-1 pl-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-widest text-emerald-700">
                  <Sparkles className="h-3 w-3 text-emerald-600 animate-spin" /> Statistik & Potensi Desa
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-bold text-gray-500">Live Monitoring</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">Ringkasan Statistik & Sektor Desa</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-white px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-xs backdrop-blur-md sm:self-auto">
            <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
            <span>Real-time Analytics Active</span>
          </div>
        </div>

        {/* METRICS GRID - WARNA BERBEDA TIAP CARD */}
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
          <MetricCard 
            title="Total Pengguna" 
            value={stats.users} 
            subtitle={`${stats.active_users} Akun Aktif`} 
            icon={<Users className="h-5 w-5 text-blue-600" />} 
            href="/dashboard/users" 
            gradientBg="from-blue-500/15 via-indigo-400/20 to-transparent" 
            hoverBgColor="group-hover:bg-blue-600" 
          />
          <MetricCard 
            title="Total UMKM / Toko" 
            value={stats.stores} 
            subtitle="Toko Terdaftar" 
            icon={<Store className="h-5 w-5 text-emerald-600" />} 
            href="/dashboard/umkm" 
            gradientBg="from-emerald-500/15 via-teal-400/20 to-transparent" 
            hoverBgColor="group-hover:bg-emerald-600" 
          />
          <MetricCard 
            title="Total Produk" 
            value={stats.products} 
            subtitle="Katalog Aktif" 
            icon={<ShoppingBag className="h-5 w-5 text-amber-600" />} 
            href="/dashboard/umkm" 
            gradientBg="from-amber-500/15 via-orange-400/20 to-transparent" 
            hoverBgColor="group-hover:bg-amber-600" 
          />
          <MetricCard 
            title="Total Berita" 
            value={stats.news} 
            subtitle="Publikasi Desa" 
            icon={<Newspaper className="h-5 w-5 text-purple-600" />} 
            href="/dashboard/news" 
            gradientBg="from-purple-500/15 via-indigo-400/20 to-transparent" 
            hoverBgColor="group-hover:bg-purple-600" 
          />
          <MetricCard 
            title="Fasilitas Desa" 
            value={stats.facilities} 
            subtitle="Unit Infrastruktur" 
            icon={<Building2 className="h-5 w-5 text-rose-600" />} 
            href="/dashboard/facility" 
            gradientBg="from-rose-500/15 via-pink-400/20 to-transparent" 
            hoverBgColor="group-hover:bg-rose-600" 
          />
          <MetricCard 
            title="Literasi Desa" 
            value={stats.literatures} 
            subtitle="Arsip & Regulasi" 
            icon={<BookOpen className="h-5 w-5 text-cyan-600" />} 
            href="/literature" 
            gradientBg="from-cyan-500/15 via-teal-400/20 to-transparent" 
            hoverBgColor="group-hover:bg-cyan-600" 
          />
        </div>
      </div>

      {/* POPULATION COMPARISON */}
      <PopulationComparisonCard currentYear={population_comparison.current_year} previousYear={population_comparison.previous_year} currentData={population_comparison.current_data} previousData={population_comparison.previous_data} growth={population_comparison.growth} />

      {/* LISTS SECTION 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        <ListCard title="Fasilitas Pendidikan" icon="📚" viewAllHref="/dashboard/facility" emptyMessage="Tidak ada data fasilitas pendidikan." variant="emerald" items={lists.schools.map((school) => ({ id: school.id, name: school.name, subtitle: school.address || "-" }))} />
        <ListCard title="Potensi Desa Unggulan" icon="🌟" viewAllHref="/dashboard/potential" emptyMessage="Tidak ada data potensi desa." variant="emerald" items={lists.potentials.map((pot) => ({ id: pot.id, name: pot.name, description: pot.description || "" }))} />
      </div>

      {/* LISTS SECTION 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        <ListCard title="Katalog Produk Terbaru" icon="🛒" viewAllHref="/dashboard/umkm" emptyMessage="Tidak ada produk terbaru." variant="emerald" items={lists.products.map((prod) => ({ id: prod.id, name: prod.name, subtitle: prod.stores?.name ? `Toko: ${prod.stores.name}` : undefined, rightText: `Rp ${prod.price.toLocaleString("id-ID")}` }))} />
        <ListCard title="Berita Terbaru" icon="📰" viewAllHref="/dashboard/news" emptyMessage="Tidak ada berita terbaru." variant="emerald" items={lists.news.map((item) => ({ id: item.id, title: item.title, badgeText: item.category }))} />
      </div>
    </div>
  );
}