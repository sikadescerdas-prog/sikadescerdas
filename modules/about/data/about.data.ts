// modules/about/data/about.data.ts

import {
  BookOpen, Building2, GraduationCap, Globe2, Laptop, Megaphone, Network, Store, Users, Wifi, } from "lucide-react";
import type { AboutData } from "../types/about.types";

export const aboutData: AboutData = {
  name: "Desa Danasari",
  logo: "/logo-desa.png",
  title: "Mengenal Desa Danasari Lebih Dekat Melalui Informasi dan Transformasi Digital",
  subtitle: "Website Resmi Desa Danasari",
  description: "Desa Danasari menghadirkan transformasi digital melalui pengembangan website desa sebagai pusat informasi publik, edukasi masyarakat, literasi digital, serta pemberdayaan ekonomi lokal.",
  background: "from-emerald-600 via-green-500 to-teal-500",
  stats: [
    { id: "1", value: "2026", label: "Transformasi Digital Desa" },
    { id: "2", value: "5", label: "Pojok Literasi" },
    { id: "3", value: "3", label: "Bidang Kolaborasi" },
    { id: "4", value: "1", label: "Website Desa Digital" },
  ],
  features: [
    {
      id: "website",
      title: "Website Desa Digital",
      description: "Sebagai pusat informasi desa, pelayanan masyarakat, dokumentasi kegiatan, dan keterbukaan informasi publik.",
      icon: Globe2,
    },
    {
      id: "literasi",
      title: "Literasi Digital",
      description: "Meningkatkan kemampuan masyarakat dalam memanfaatkan teknologi untuk informasi, edukasi, dan aktivitas produktif.",
      icon: Laptop,
    },
    {
      id: "umkm",
      title: "UMKM Digital",
      description: "Mendukung promosi, branding, dan pemasaran produk lokal melalui ekosistem digital.",
      icon: Store,
    },
  ],
  goals: [
    {
      id: "1",
      title: "Desa Informatif",
      description: "Menyediakan akses informasi desa yang mudah, cepat, dan transparan bagi masyarakat.",
      icon: Globe2,
    },
    {
      id: "2",
      title: "Penguatan Literasi Digital",
      description: "Meningkatkan kemampuan masyarakat dalam menggunakan teknologi secara aman, kreatif, dan produktif.",
      icon: BookOpen,
    },
    {
      id: "3",
      title: "Pemberdayaan Ekonomi Desa",
      description: "Mendorong perkembangan UMKM melalui pemanfaatan teknologi digital dan pemasaran online.",
      icon: Store,
    },
  ],
  pojokLiterasi: [
    {
      id: "anak",
      title: "Pojok Literasi Anak",
      description: "Mendukung penguatan literasi dasar dan pembelajaran kreatif bagi anak-anak desa.",
      icon: BookOpen,
    },
    {
      id: "digital",
      title: "Pojok Literasi Digital",
      description: "Memberikan edukasi penggunaan teknologi yang aman, kreatif, dan bermanfaat.",
      icon: Wifi,
    },
    {
      id: "umkm",
      title: "Pojok UMKM Digital",
      description: "Membantu pelaku UMKM dalam branding dan pemasaran produk berbasis digital.",
      icon: Store,
    },
    {
      id: "informasi",
      title: "Pojok Informasi Desa",
      description: "Menjadi pusat informasi kegiatan, layanan, dan potensi Desa Danasari.",
      icon: Megaphone,
    },
  ],
  collaboration: [
    {
      id: "pgsd",
      title: "PGSD UMP",
      description: "Berperan dalam penguatan literasi dasar dan edukasi masyarakat desa.",
      icon: GraduationCap,
    },
    {
      id: "ti",
      title: "Teknik Informatika UMP",
      description: "Mengembangkan sistem informasi, website desa, dan teknologi digital.",
      icon: Laptop,
    },
    {
      id: "bisnis",
      title: "Bisnis Digital UMP",
      description: "Mendukung branding, pemasaran digital, dan pengembangan UMKM desa.",
      icon: Network,
    },
    {
      id: "desa",
      title: "Pemerintah Desa Danasari",
      description: "Menjadi mitra implementasi dan pengelola keberlanjutan sistem informasi desa.",
      icon: Building2,
    },
  ],
  developer: {
    name: "SIKADES CERDAS",
    year: "2026",
    description: "Dikembangkan oleh SIKADES CERDAS melalui kolaborasi Universitas Muhammadiyah Purwokerto bersama Pemerintah Desa Danasari untuk mendukung transformasi digital desa.",
    logo: "/logo-sikades.png",
  },
};