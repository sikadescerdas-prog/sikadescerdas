// modules/services/data/services.data.ts

import {
  Briefcase,
  ClipboardList,
  FileText,
  IdCard,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import type { Service } from "../types/service.types";

export const services: Service[] = [
  {
    id: "surat-keterangan",
    title: "Surat Keterangan",
    subtitle: "Administrasi Umum",
    description:
      "Pelayanan penerbitan surat keterangan resmi untuk berbagai kebutuhan administrasi masyarakat.",

    category: "Administrasi",
    icon: FileText,
    color: "from-sky-500 to-blue-600",

    duration: "10 Menit",
    fee: "Gratis",
    online: true,
    featured: true,

    requirements: [
      {
        id: "ktp",
        title: "Fotokopi KTP",
      },
      {
        id: "kk",
        title: "Fotokopi Kartu Keluarga",
      },
      {
        id: "rt",
        title: "Surat Pengantar RT/RW",
      },
    ],

    steps: [
      {
        id: "1",
        title: "Ajukan Permohonan",
        description: "Isi formulir pengajuan layanan.",
      },
      {
        id: "2",
        title: "Verifikasi",
        description: "Petugas memeriksa dokumen persyaratan.",
      },
      {
        id: "3",
        title: "Penerbitan Surat",
        description: "Surat diproses dan dapat diambil.",
      },
    ],

    faq: [
      {
        id: "1",
        question: "Apakah layanan ini gratis?",
        answer: "Ya, seluruh layanan administrasi desa tidak dipungut biaya.",
      },
      {
        id: "2",
        question: "Berapa lama prosesnya?",
        answer: "Sekitar 10 menit apabila persyaratan telah lengkap.",
      },
    ],
  },

  {
    id: "surat-domisili",
    title: "Surat Domisili",
    subtitle: "Administrasi Kependudukan",
    description:
      "Surat keterangan domisili sebagai bukti tempat tinggal untuk berbagai keperluan administrasi.",

    category: "Administrasi",
    icon: ClipboardList,
    color: "from-indigo-500 to-blue-600",

    duration: "15 Menit",
    fee: "Gratis",
    online: true,
    featured: true,

    requirements: [
      {
        id: "ktp",
        title: "Fotokopi KTP",
      },
      {
        id: "kk",
        title: "Fotokopi KK",
      },
      {
        id: "rt",
        title: "Surat Pengantar RT/RW",
      },
    ],

    steps: [
      {
        id: "1",
        title: "Pengajuan",
        description: "Lengkapi formulir online.",
      },
      {
        id: "2",
        title: "Validasi",
        description: "Data diverifikasi oleh petugas desa.",
      },
      {
        id: "3",
        title: "Cetak Surat",
        description: "Surat dapat diambil di kantor desa.",
      },
    ],

    faq: [
      {
        id: "1",
        question: "Apakah harus datang ke kantor desa?",
        answer: "Pengajuan dapat dilakukan secara online, pengambilan mengikuti kebijakan desa.",
      },
    ],
  },

  {
    id: "bantuan-sosial",
    title: "Bantuan Sosial",
    subtitle: "Kesejahteraan Masyarakat",
    description:
      "Pengajuan bantuan sosial bagi masyarakat yang memenuhi persyaratan.",

    category: "Bantuan",
    icon: ShieldCheck,
    color: "from-emerald-500 to-green-600",

    duration: "1 Hari",
    fee: "Gratis",
    online: true,
    featured: true,

    requirements: [
      {
        id: "ktp",
        title: "Fotokopi KTP",
      },
      {
        id: "kk",
        title: "Fotokopi KK",
      },
      {
        id: "sktm",
        title: "Surat Keterangan Tidak Mampu",
      },
    ],

    steps: [
      {
        id: "1",
        title: "Pengajuan",
        description: "Isi formulir bantuan sosial.",
      },
      {
        id: "2",
        title: "Verifikasi",
        description: "Petugas memeriksa kelengkapan data.",
      },
      {
        id: "3",
        title: "Penetapan",
        description: "Penentuan penerima bantuan.",
      },
    ],

    faq: [
      {
        id: "1",
        question: "Siapa yang dapat mengajukan?",
        answer: "Warga yang memenuhi syarat sesuai ketentuan pemerintah.",
      },
    ],
  },

  {
    id: "surat-usaha",
    title: "Surat Keterangan Usaha",
    subtitle: "Perizinan UMKM",
    description:
      "Legalitas usaha untuk pelaku UMKM dan kebutuhan administrasi lainnya.",

    category: "Perizinan",
    icon: Briefcase,
    color: "from-orange-500 to-amber-500",

    duration: "20 Menit",
    fee: "Gratis",
    online: true,
    featured: false,

    requirements: [
      {
        id: "ktp",
        title: "Fotokopi KTP",
      },
      {
        id: "kk",
        title: "Fotokopi KK",
      },
      {
        id: "usaha",
        title: "Foto Tempat Usaha",
      },
    ],

    steps: [
      {
        id: "1",
        title: "Pengajuan",
        description: "Ajukan permohonan surat usaha.",
      },
      {
        id: "2",
        title: "Survei",
        description: "Verifikasi lokasi usaha jika diperlukan.",
      },
      {
        id: "3",
        title: "Penerbitan",
        description: "Surat usaha diterbitkan.",
      },
    ],

    faq: [
      {
        id: "1",
        question: "Apakah usaha rumahan bisa?",
        answer: "Ya, selama memenuhi persyaratan administrasi.",
      },
    ],
  },

  {
    id: "pengantar-ktp",
    title: "Pengantar KTP",
    subtitle: "Administrasi Kependudukan",
    description:
      "Surat pengantar untuk pembuatan atau pembaruan KTP elektronik.",

    category: "Kependudukan",
    icon: IdCard,
    color: "from-violet-500 to-purple-600",

    duration: "10 Menit",
    fee: "Gratis",
    online: true,
    featured: false,

    requirements: [
      {
        id: "kk",
        title: "Kartu Keluarga",
      },
      {
        id: "rt",
        title: "Surat Pengantar RT/RW",
      },
      {
        id: "lama",
        title: "KTP Lama (Jika Ada)",
      },
    ],

    steps: [
      {
        id: "1",
        title: "Ajukan",
        description: "Isi formulir permohonan.",
      },
      {
        id: "2",
        title: "Verifikasi",
        description: "Petugas memeriksa data.",
      },
      {
        id: "3",
        title: "Surat Pengantar",
        description: "Surat diterbitkan untuk dibawa ke Disdukcapil.",
      },
    ],

    faq: [
      {
        id: "1",
        question: "Apakah langsung mendapat KTP?",
        answer: "Tidak. Desa hanya menerbitkan surat pengantar.",
      },
    ],
  },

  {
    id: "pengaduan-desa",
    title: "Pengaduan Desa",
    subtitle: "Aspirasi Masyarakat",
    description:
      "Sampaikan aspirasi, kritik, maupun laporan mengenai pelayanan desa.",

    category: "Pengaduan",
    icon: MessageCircle,
    color: "from-rose-500 to-pink-600",

    duration: "24 Jam",
    fee: "Gratis",
    online: true,
    featured: true,

    requirements: [
      {
        id: "laporan",
        title: "Deskripsi Pengaduan",
      },
      {
        id: "foto",
        title: "Foto Pendukung (Opsional)",
      },
      {
        id: "lokasi",
        title: "Lokasi Kejadian",
      },
    ],

    steps: [
      {
        id: "1",
        title: "Kirim Pengaduan",
        description: "Isi formulir pengaduan.",
      },
      {
        id: "2",
        title: "Verifikasi",
        description: "Admin desa memverifikasi laporan.",
      },
      {
        id: "3",
        title: "Tindak Lanjut",
        description: "Laporan diteruskan ke pihak terkait.",
      },
    ],

    faq: [
      {
        id: "1",
        question: "Apakah identitas pelapor dirahasiakan?",
        answer: "Ya, identitas pelapor akan dijaga sesuai kebijakan yang berlaku.",
      },
    ],
  },
];