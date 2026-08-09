// components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, ExternalLink, Clock, Home, Users, Building, Newspaper, Target, BookOpen, Store, Images, Info, ChevronRight } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import FooterBottom from "./FooterBottom";

const YEAR = 2026;

const FOOTER_DATA = {
  village: "Desa Danasari",
  district: "Kecamatan Karangjambu",
  address: "Desa Danasari, Kecamatan Karangjambu",
  phone: "0812-xxxx-xxxx",
  email: "email@desa.id",
  whatsapp: "62812xxxxxxx",
  maps: "https://maps.google.com",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
};

const NAVIGATION_ITEMS = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Berita", href: "/news", icon: Newspaper },
  { label: "Literasi", href: "/literature", icon: BookOpen },
  { label: "UMKM", href: "/store", icon: Store },
  { label: "Galeri", href: "#", icon: Images },
];

const VILLAGE_ITEMS = [
  { label: "Profil Desa", href: "/village", icon: Info },
  { label: "Visi & Misi", href: "/visi-misi", icon: Target },
  { label: "Struktur Desa", href: "/stucture", icon: Users },
  { label: "Populasi Desa", href: "/population", icon: Building },
  { label: "Potensi Desa", href: "/potential", icon: Home },
];

const MENU_CLASS = "group relative flex items-center gap-2 rounded-lg py-2.5 text-sm text-green-50 transition-all duration-300 hover:translate-x-1 hover:text-white";

export default function Footer() {
  const pathname = usePathname();
  const hiddenRoutes = ["/login", "/register", "/dashboard", "/settings"];
  const shouldHide = hiddenRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (shouldHide) return null;

  const isSlim = pathname === "/profile" || pathname.startsWith("/profile/") || pathname.startsWith("/store/") || pathname.startsWith("/product/");

  if (isSlim) {
    return (
      <footer className="pb-16 md:pb-0 lg:pb-0 relative overflow-hidden text-white">
        <div className="absolute inset-0 footer-gradient" />
        <div className="absolute inset-0 bg-emerald-950/10" />
        <div className="footer-grid pointer-events-none absolute inset-0" />
        <div className="relative">
          <FooterBottom />
        </div>
        <style jsx>{`
          .footer-gradient {
            background: linear-gradient(120deg, #58e88e, #25c95f, #10a957, #42df80, #25c95f, #0f9f50);
            background-size: 400% 400%;
            animation: gradientMove 14s ease infinite;
          }
          .footer-grid {
            opacity: 0.07;
            background-image: linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px);
            background-size: 60px 60px;
            animation: gridMove 20s linear infinite;
          }
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes gridMove {
            0% { transform: translate3d(0,0,0); }
            100% { transform: translate3d(60px,60px,0); }
          }
        `}</style>
      </footer>
    );
  }

  return (
    <footer className="relative mb-16 overflow-hidden text-white md:mb-0">
      <div className="absolute inset-0 footer-gradient" />
      <div className="absolute inset-0 bg-emerald-950/10" />
      <div className="footer-grid pointer-events-none absolute inset-0" />
      
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="footer-orb footer-orb-one" />
        <div className="footer-orb footer-orb-two" />
        <div className="footer-orb footer-orb-three" />
        <div className="footer-orb footer-orb-four" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="footer-particle particle-one" />
        <span className="footer-particle particle-two" />
        <span className="footer-particle particle-three" />
        <span className="footer-particle particle-four" />
        <span className="footer-particle particle-five" />
        <span className="footer-particle particle-six" />
        <span className="footer-particle particle-seven" />
        <span className="footer-particle particle-eight" />
      </div>

      <div className="footer-light pointer-events-none absolute inset-y-0 left-[-35%] w-[28%]" />
      
      <div className="relative h-1 overflow-hidden bg-white/15">
        <div className="footer-line absolute inset-y-0 left-[-35%] w-[35%]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="footer-logo-glow absolute -inset-4 rounded-[2rem]" />
                <div className="footer-logo-glass group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.25rem]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
                  <div className="pointer-events-none absolute -left-6 top-[-35%] h-[180%] w-5 rotate-[28deg] bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-24" />
                  <Image src="/logo-desa.png" alt="Logo Desa Danasari" width={64} height={64} priority className="relative z-10 h-full w-full object-contain p-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-2" />
                </div>
                <div className="pointer-events-none absolute -inset-1 rounded-[1.4rem] border border-white/10" />
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tight">{FOOTER_DATA.village}</h3>
                <p className="mt-1 text-sm text-green-50">{FOOTER_DATA.district}</p>
              </div>
            </div>

            <p className="mt-6 max-w-md text-sm leading-7 text-green-50">Website resmi {FOOTER_DATA.village} sebagai media informasi dan pelayanan digital untuk masyarakat.</p>

            <a href={FOOTER_DATA.maps} target="_blank" rel="noopener noreferrer" className="group mt-5 inline-flex items-center gap-2 text-sm text-green-50 transition-all duration-300 hover:translate-x-1 hover:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 backdrop-blur-md transition-all duration-300 group-hover:rotate-6 group-hover:border-white/20 group-hover:bg-white/20">
                <MapPin className="h-4 w-4" />
              </span>
              <span>Lihat lokasi {FOOTER_DATA.village}</span>
              <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <div className="mt-3 flex items-center gap-2 text-sm text-green-50">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 backdrop-blur-md">
                <Clock className="h-4 w-4" />
              </span>
              <span>Senin - Jumat: 08.00 - 16.00 WIB</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 lg:col-span-5">
            <div>
              <h4 className="text-sm font-medium uppercase tracking-[0.18em] text-white/90">Navigasi</h4>
              <div className="mt-5 space-y-1">
                {NAVIGATION_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} className={MENU_CLASS}>
                      <Icon className="h-4 w-4 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                      <span className="truncate">{item.label}</span>
                      <ChevronRight className="ml-auto h-3.5 w-3.5 -rotate-45 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-0 group-hover:opacity-80" />
                      <span className="absolute bottom-0 left-6 h-px w-0 bg-white/70 transition-all duration-300 group-hover:w-[calc(100%-24px)]" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium uppercase tracking-[0.18em] text-white/90">Tentang Desa</h4>
              <div className="mt-5 space-y-1">
                {VILLAGE_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isExternal = item.href.startsWith("http");
                  const content = (
                    <>
                      <Icon className="h-4 w-4 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                      <span className="truncate">{item.label}</span>
                      <ChevronRight className="ml-auto h-3.5 w-3.5 -rotate-45 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-0 group-hover:opacity-80" />
                      <span className="absolute bottom-0 left-6 h-px w-0 bg-white/70 transition-all duration-300 group-hover:w-[calc(100%-24px)]" />
                    </>
                  );

                  if (isExternal) {
                    return (
                      <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={MENU_CLASS}>
                        {content}
                      </a>
                    );
                  }

                  return (
                    <Link key={item.href} href={item.href} className={MENU_CLASS}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div id="kontak" className="scroll-mt-20 lg:col-span-3">
            <h4 className="text-sm font-medium uppercase tracking-[0.18em] text-white/90">Hubungi Kami</h4>
            <div className="mt-5 space-y-3">
              <div className="group flex items-start gap-3 text-sm text-green-50">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 backdrop-blur-md transition-all duration-300 group-hover:rotate-6 group-hover:bg-white/20">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="pt-1 leading-5">{FOOTER_DATA.address}</span>
              </div>

              <a href={`tel:${FOOTER_DATA.phone.replace(/\D/g, "")}`} className="group flex items-center gap-3 text-sm text-green-50 transition-colors hover:text-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 backdrop-blur-md transition-all duration-300 group-hover:rotate-6 group-hover:bg-white/20">
                  <Phone className="h-4 w-4" />
                </span>
                <span>{FOOTER_DATA.phone}</span>
              </a>

              <a href={`mailto:${FOOTER_DATA.email}`} className="group flex items-center gap-3 text-sm text-green-50 transition-colors hover:text-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 backdrop-blur-md transition-all duration-300 group-hover:rotate-6 group-hover:bg-white/20">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="truncate">{FOOTER_DATA.email}</span>
              </a>
            </div>

            <div className="mt-6 flex gap-2.5">
              <a href={FOOTER_DATA.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:border-white/20 hover:bg-white/20 hover:shadow-xl">
                <FaFacebook className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </a>
              <a href={FOOTER_DATA.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:border-white/20 hover:bg-white/20 hover:shadow-xl">
                <FaInstagram className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </a>
              <a href={FOOTER_DATA.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:border-white/20 hover:bg-white/20 hover:shadow-xl">
                <FaYoutube className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </a>
              <a href={`https://wa.me/${FOOTER_DATA.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:border-white/20 hover:bg-white/20 hover:shadow-xl">
                <FaWhatsapp className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <FooterBottom />

      <style jsx>{`
        .footer-gradient {
          background: linear-gradient(120deg, #58e88e, #25c95f, #10a957, #42df80, #25c95f, #0f9f50);
          background-size: 400% 400%;
          animation: gradientMove 14s ease infinite;
        }
        .footer-grid {
          opacity: 0.07;
          background-image: linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 20s linear infinite;
        }
        .footer-orb {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          filter: blur(70px);
          mix-blend-mode: screen;
        }
        .footer-orb-one { width: 320px; height: 320px; left: -100px; top: -100px; background: rgba(255, 255, 255, 0.14); animation: orbOne 10s ease-in-out infinite; }
        .footer-orb-two { width: 420px; height: 420px; right: -150px; top: 20px; background: rgba(110, 255, 180, 0.18); animation: orbTwo 13s ease-in-out infinite; }
        .footer-orb-three { width: 300px; height: 300px; left: 35%; bottom: -150px; background: rgba(255, 255, 255, 0.1); animation: orbThree 11s ease-in-out infinite; }
        .footer-orb-four { width: 180px; height: 180px; left: 55%; top: 25%; background: rgba(200, 255, 220, 0.08); animation: orbFour 8s ease-in-out infinite; }
        .footer-light {
          transform: skewX(-20deg);
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          filter: blur(2px);
          animation: lightSweep 8s linear infinite;
        }
        .footer-line {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
          animation: lineMove 5s linear infinite;
        }
        .footer-logo-glow {
          background: rgba(255, 255, 255, 0.13);
          filter: blur(22px);
          opacity: 0.5;
          animation: logoGlow 4s ease-in-out infinite;
        }
        .footer-logo-glass {
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.08));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.08), 0 15px 35px rgba(0, 70, 35, 0.15);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          animation: logoFloat 4.5s ease-in-out infinite;
        }
        .footer-particle {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.65);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.45);
        }
        .particle-one { width: 7px; height: 7px; left: 12%; top: 22%; animation: particleOne 7s ease-in-out infinite; }
        .particle-two { width: 5px; height: 5px; left: 31%; top: 42%; animation: particleTwo 6s ease-in-out infinite; }
        .particle-three { width: 8px; height: 8px; left: 48%; top: 18%; animation: particleThree 8s ease-in-out infinite; }
        .particle-four { width: 5px; height: 5px; right: 29%; top: 30%; animation: particleFour 6s ease-in-out infinite; }
        .particle-five { width: 7px; height: 7px; right: 20%; top: 65%; animation: particleFive 9s ease-in-out infinite; }
        .particle-six { width: 4px; height: 4px; left: 65%; bottom: 20%; animation: particleSix 7s ease-in-out infinite; }
        .particle-seven { width: 6px; height: 6px; left: 8%; bottom: 15%; animation: particleSeven 8s ease-in-out infinite; }
        .particle-eight { width: 4px; height: 4px; right: 8%; bottom: 18%; animation: particleEight 6s ease-in-out infinite; }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gridMove {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(60px, 60px, 0); }
        }
        @keyframes orbOne {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(90px, 60px, 0) scale(1.15); }
        }
        @keyframes orbTwo {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-110px, 80px, 0) scale(1.1); }
        }
        @keyframes orbThree {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(80px, -70px, 0); }
        }
        @keyframes orbFour {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate3d(-50px, 60px, 0) scale(1.3); opacity: 0.8; }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(1deg); }
        }
        @keyframes logoGlow {
          0%, 100% { opacity: 0.35; transform: scale(0.92); }
          50% { opacity: 0.7; transform: scale(1.12); }
        }
        @keyframes lightSweep {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(500%) skewX(-20deg); }
        }
        @keyframes lineMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
        @keyframes particleOne {
          0%, 100% { transform: translate(0, 0); opacity: 0.25; }
          50% { transform: translate(35px, -45px); opacity: 1; }
        }
        @keyframes particleTwo {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(-35px, 40px); opacity: 0.9; }
        }
        @keyframes particleThree {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(45px, 55px); opacity: 1; }
        }
        @keyframes particleFour {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(-45px, -35px); opacity: 0.9; }
        }
        @keyframes particleFive {
          0%, 100% { transform: translate(0, 0); opacity: 0.25; }
          50% { transform: translate(-35px, -55px); opacity: 1; }
        }
        @keyframes particleSix {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(45px, -40px); opacity: 0.9; }
        }
        @keyframes particleSeven {
          0%, 100% { transform: translate(0, 0); opacity: 0.25; }
          50% { transform: translate(30px, -50px); opacity: 1; }
        }
        @keyframes particleEight {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(-40px, -45px); opacity: 0.9; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </footer>
  );
}