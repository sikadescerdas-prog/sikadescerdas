// components/about/AboutIntro.tsx

"use client";

import { motion, type Variants } from "framer-motion";
import { Globe2, BookOpen, Store, Layers3, Info } from "lucide-react";

const focus = [
  {
    icon: Globe2,
    title: "Sistem Informasi Desa",
    description: "Menyediakan platform digital sebagai pusat informasi publik, pelayanan, dan dokumentasi kegiatan desa.",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: BookOpen,
    title: "Kawasan Edukasi",
    description: "Membangun ruang pembelajaran masyarakat melalui literasi digital dan edukasi berbasis teknologi.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Store,
    title: "Digitalisasi UMKM",
    description: "Mendukung promosi serta pemasaran produk lokal melalui ekosistem digital desa.",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Layers3,
    title: "Pojok Literasi Tematik",
    description: "Mengembangkan lima pojok literasi dengan pendekatan tematik yang terintegrasi.",
    color: "from-purple-500 to-violet-600",
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardAnimation: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function AboutIntro() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_top,_rgba(16,185,129,.12),transparent_35%)]" />
      <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            {/* BADGE */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-5 py-2.5 text-xs font-bold text-emerald-600 shadow-sm"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                <Info className="h-3.5 w-3.5" />
              </span>
              Tentang Program
            </motion.div>

            <h2 className="mt-7 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl">
              Apa Itu
              <span className="block bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                SIKADES CERDAS?
              </span>
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              SIKADES CERDAS (Sistem Informasi dan Kawasan Edukasi Desa Cerdas) merupakan program pengembangan desa berbasis teknologi informasi, literasi digital, dan pemberdayaan masyarakat.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Program ini menghadirkan website desa sebagai media informasi publik, sarana edukasi masyarakat, serta etalase digital untuk mendukung potensi dan ekonomi lokal.
            </p>
          </motion.div>

          {/* CARD */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {focus.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={cardAnimation}
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-100/40 blur-2xl" />

                  <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-5 h-1 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500 group-hover:w-20" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}