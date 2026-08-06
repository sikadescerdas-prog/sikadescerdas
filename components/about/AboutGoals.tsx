// components/about/AboutGoals.tsx

"use client";

import { motion, type Variants } from "framer-motion";
import { BookOpen, Globe2, Handshake, Rocket, Store, Users } from "lucide-react";

const goals = [
  {
    number: "01",
    icon: Globe2,
    title: "Optimalisasi Website Desa",
    description: "Mengembangkan website desa sebagai pusat informasi publik, pelayanan masyarakat, edukasi, serta media promosi potensi desa.",
    color: "from-emerald-400 to-green-600",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Penguatan Literasi Digital",
    description: "Meningkatkan kemampuan masyarakat dalam memanfaatkan teknologi digital untuk informasi, pembelajaran, dan pemberdayaan.",
    color: "from-blue-400 to-cyan-600",
  },
  {
    number: "03",
    icon: Store,
    title: "Digitalisasi UMKM Desa",
    description: "Membangun etalase digital produk lokal melalui marketplace dan pemasaran berbasis teknologi.",
    color: "from-orange-400 to-amber-600",
  },
  {
    number: "04",
    icon: Users,
    title: "Pemberdayaan Masyarakat",
    description: "Melibatkan masyarakat sebagai penggerak desa digital yang mandiri dan produktif.",
    color: "from-purple-400 to-violet-600",
  },
  {
    number: "05",
    icon: Handshake,
    title: "Kolaborasi Lintas Disiplin",
    description: "Menggabungkan PGSD, Teknik Informatika, dan Bisnis Digital untuk membangun ekosistem desa cerdas.",
    color: "from-indigo-400 to-blue-600",
  },
  {
    number: "06",
    icon: Rocket,
    title: "Desa Mandiri Berkelanjutan",
    description: "Mendorong pengelolaan teknologi desa yang dapat berkembang secara mandiri.",
    color: "from-rose-400 to-pink-600",
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardAnimation: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function AboutGoals() {
  return (
    <section className="relative overflow-hidden bg-white py-28">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,.12),transparent_40%)]" />
      <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-5 py-2.5 text-xs font-bold text-emerald-600 shadow-sm"
          >
            <Rocket className="h-4 w-4" />
            Tujuan Program
          </motion.div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            Membangun{" "}
            <span className="block bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
              Ekosistem Desa Cerdas
            </span>
          </h2>

          <p className="mt-5 text-slate-500 leading-8">
            Transformasi digital desa melalui teknologi, literasi, kolaborasi, dan pemberdayaan masyarakat.
          </p>
        </div>

        {/* GRID */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {goals.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                variants={cardAnimation}
                key={item.number}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-2xl"
              >
                {/* NUMBER */}
                <span className="absolute right-6 top-4 text-7xl font-black text-slate-100 transition group-hover:text-emerald-50">
                  {item.number}
                </span>

                {/* ICON */}
                <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-xl`}>
                  <Icon className="h-8 w-8" />
                </div>

                <h3 className="mt-7 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                {/* HOVER LINE */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}