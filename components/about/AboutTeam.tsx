// components/about/AboutTeam.tsx

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, Code2, Megaphone, Building2, UsersRound, Users } from "lucide-react";
import { aboutData } from "@/modules/about/data/about.data";

const teams = [
  {
    icon: GraduationCap,
    title: "PGSD UMP",
    role: "Literasi dan Edukasi",
    description: "Berperan dalam penguatan literasi dasar, pengembangan pojok literasi, serta edukasi masyarakat desa.",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Code2,
    title: "Teknik Informatika UMP",
    role: "Sistem Informasi Desa",
    description: "Mengembangkan website desa, sistem informasi digital, serta pengelolaan teknologi SIKADES CERDAS.",
    color: "from-blue-500 to-sky-500",
  },
  {
    icon: Megaphone,
    title: "Bisnis Digital UMP",
    role: "Branding dan UMKM Digital",
    description: "Mendukung pemasaran digital, branding produk lokal, serta pengembangan marketplace UMKM desa.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Building2,
    title: "Pemerintah Desa Danasari",
    role: "Mitra Program",
    description: "Mendukung implementasi, pemanfaatan, dan keberlanjutan sistem informasi desa.",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Users,
    title: "Masyarakat Desa",
    role: "Pengguna dan Penggerak",
    description: "Menjadi bagian utama dalam pemanfaatan teknologi, literasi digital, dan pemberdayaan ekonomi.",
    color: "from-rose-500 to-pink-500",
  },
];

export default function AboutTeam() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-5 py-2.5 text-xs font-bold text-emerald-600 shadow-sm">
            <UsersRound className="h-4 w-4" />
            Team Support
          </div>

          <h2 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl">
            Kolaborasi{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              Universitas Muhammadiyah Purwokerto
            </span>
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            SIKADES CERDAS dikembangkan melalui kolaborasi lintas disiplin ilmu bersama pemerintah desa dan masyarakat.
          </p>
        </motion.div>

        {/* TEAM CARD */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {teams.map((team, index) => {
            const Icon = team.icon;

            return (
              <motion.div
                key={team.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-emerald-50" />

                <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${team.color} text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-900">
                  {team.title}
                </h3>

                <p className="mt-1 text-xs font-semibold text-emerald-600">
                  {team.role}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {team.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* DEVELOPER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-8 shadow-xl">
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-200/40 blur-3xl" />

            <div className="relative flex flex-col items-center gap-6 sm:flex-row">
              <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-[2rem] bg-white shadow-lg ring-4 ring-emerald-100">
                {aboutData.developer.logo && (
                  <Image
                    src={aboutData.developer.logo}
                    alt={aboutData.developer.name}
                    width={120}
                    height={120}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>

              <div className="text-center sm:text-left">
                <p className="mt-3 text-xs text-slate-500">
                  Dikembangkan oleh
                </p>

                <h3 className="mt-1 bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-3xl font-extrabold text-transparent">
                  {aboutData.developer.name}
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  {aboutData.developer.description}
                </p>

                <span className="mt-3 inline-flex rounded-full bg-white px-4 py-2 text-[9px] font-semibold text-emerald-600 shadow-sm">
                  © {aboutData.developer.year} SIKADES CERDAS
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}