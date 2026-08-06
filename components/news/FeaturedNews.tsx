// components/news/FeaturedNews.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, CalendarDays, ArrowRight, Star } from "lucide-react";
import type { News } from "@/modules/news/types/news.types";

interface Props {
  news: News[];
}

export default function FeaturedNews({ news }: Props) {
  const featuredNews = useMemo(() => news.filter((item) => item.is_featured).slice(0, 5), [news]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => { setCurrent(0); }, [featuredNews.length]);

  useEffect(() => {
    if (paused || featuredNews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === featuredNews.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [current, paused, featuredNews.length]);

  if (!featuredNews.length) return null;

  function nextSlide() {
    setCurrent((prev) => (prev === featuredNews.length - 1 ? 0 : prev + 1));
  }

  function previousSlide() {
    setCurrent((prev) => (prev === 0 ? featuredNews.length - 1 : prev - 1));
  }

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-0">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-[0_20px_80px_rgba(0,0,0,.35)]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {/* Slides */}
        <div className="relative h-[220px] overflow-hidden md:h-[380px]">
          {featuredNews.map((item, index) => (
            <div key={item.id} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${current === index ? "z-20 opacity-100" : "pointer-events-none z-10 opacity-0"}`}>
              {/* Background */}
              <div className="absolute inset-0">
                {item.thumbnail_url && (
                  <Image src={item.thumbnail_url} alt={item.title} fill priority={index === 0} className={`object-cover transition-transform duration-[7000ms] ${current === index ? "scale-110" : "scale-100"}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-30 flex h-full items-end">
                <div className={`w-full p-6 text-white transition-all duration-700 md:max-w-3xl md:p-14 ${current === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/20 px-4 py-2 backdrop-blur-xl shadow-lg">
                    <Star size={15} fill="currentColor" className="text-yellow-300" />
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">BERITA UNGGULAN</span>
                  </div>
                  <div className="mb-3">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize text-white backdrop-blur">{item.category}</span>
                  </div>
                  <h1 className="line-clamp-2 text-2xl font-black leading-tight tracking-tight md:text-5xl">{item.title}</h1>
                  {item.excerpt && <p className="mt-4 max-w-2xl line-clamp-2 text-sm leading-7 text-slate-300 md:text-base">{item.excerpt}</p>}
                  <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-200">
                    {item.content_date && (
                      <div className="flex items-center gap-2">
                        <CalendarDays size={18} />
                        {new Date(item.content_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Previous */}
          {featuredNews.length > 1 && (
            <button onClick={previousSlide} aria-label="Sebelumnya" className="absolute left-5 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20">
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next */}
          {featuredNews.length > 1 && (
            <button onClick={nextSlide} aria-label="Berikutnya" className="absolute right-5 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20">
              <ChevronRight size={24} />
            </button>
          )}

          {/* Indicator */}
          {featuredNews.length > 1 && (
            <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3">
              {featuredNews.map((_, index) => (
                <button key={index} onClick={() => setCurrent(index)} aria-label={`Slide ${index + 1}`} className={`transition-all duration-500 ${current === index ? "h-1.5 w-12 rounded-full bg-white" : "h-1.5 w-5 rounded-full bg-white/30 hover:bg-white/60"}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}