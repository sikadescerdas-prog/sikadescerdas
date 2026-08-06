// components/about/AboutCTA.tsx

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe2, Sparkles } from "lucide-react";
import { aboutData } from "@/modules/about/data/about.data";

export default function AboutCTA() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-green-600 to-teal-700" />

      {/* GRID EFFECT */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* GLOW */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-white/20 blur-3xl"
      />

      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-5 text-center md:px-10">
        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold text-white backdrop-blur-xl"
        >
          <Sparkles className="h-4 w-4 animate-pulse" />
          Sistem Informasi Desa Cerdas
        </motion.div>

        {/* TITLE */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-8 text-3xl font-extrabold leading-tight text-white md:text-6xl"
        >
          Bersama Membangun
          <br />
          <span className="bg-gradient-to-r from-white via-emerald-100 to-green-200 bg-clip-text text-transparent">
            Desa Digital Berkelanjutan
          </span>
        </motion.h2>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-8 text-emerald-50 md:text-lg"
        >
          SIKADES CERDAS hadir sebagai langkah transformasi digital desa melalui teknologi informasi, literasi digital, dan pemberdayaan masyarakat.
        </motion.p>

        {/* BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-emerald-700 shadow-2xl transition hover:bg-emerald-50"
            >
              <Globe2 className="h-5 w-5" />
              Jelajahi Website
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}