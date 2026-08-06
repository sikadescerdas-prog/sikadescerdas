// components/product/details/ProductGallery.tsx

"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

interface ProductGalleryProps {
  product: any;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const images = useMemo(
    () =>
      [
        product?.thumbnailUrl,
        ...(product?.images?.map((item: any) => item.url) ?? []),
      ].filter(Boolean),
    [product]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [changing, setChanging] = useState(false);

  function getNext() {
    return activeIndex === images.length - 1 ? 0 : activeIndex + 1;
  }

  function getPrev() {
    return activeIndex === 0 ? images.length - 1 : activeIndex - 1;
  }

  function start(x: number) {
    setStartX(x);
    setDragging(true);
  }

  function move(x: number) {
    if (startX === null) return;
    setDragX(x - startX);
  }

  function end() {
    if (!dragging) return;

    setDragging(false);

    if (dragX < -80) {
      changeImage(getNext());
    } else if (dragX > 80) {
      changeImage(getPrev());
    }

    setDragX(0);
    setStartX(null);
  }

  function changeImage(index: number) {
    if (index === activeIndex) return;

    setChanging(true);

    setTimeout(() => {
      setActiveIndex(index);
    }, 350);

    setTimeout(() => {
      setChanging(false);
    }, 700);
  }

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE CONTAINER */}
      <div
        className="relative aspect-square cursor-grab overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
        style={{ touchAction: "pan-y" }}
        onTouchStart={(e) => start(e.touches[0].clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        onTouchEnd={end}
        onMouseDown={(e) => start(e.clientX)}
        onMouseMove={(e) => {
          if (dragging) move(e.clientX);
        }}
        onMouseUp={end}
        onMouseLeave={end}
      >
        {/* IMAGE */}
        <div
          className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: changing
              ? "scale(1.02)"
              : `translateX(${dragX}px) scale(1)`,
            opacity: changing ? 0.35 : 1,
          }}
        >
          <Image
            src={images[activeIndex]}
            alt={product?.name ?? "Produk"}
            fill
            draggable={false}
            priority
            className="object-cover select-none"
            unoptimized
          />
        </div>

        {/* WHITE TRANSITION */}
        <div
          className={
            changing
              ? "absolute inset-0 bg-white opacity-60 transition-opacity duration-700 pointer-events-none"
              : "absolute inset-0 bg-white opacity-0 transition-opacity duration-700 pointer-events-none"
          }
        />

        {/* COUNTER */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {activeIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((img: string, index: number) => (
          <button
            key={index}
            type="button"
            onClick={() => changeImage(index)}
            className={
              activeIndex === index
                ? "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-600 ring-2 ring-emerald-100 scale-105 transition-all duration-200"
                : "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-200 hover:border-emerald-300 transition-all duration-200"
            }
          >
            <Image
              src={img}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>
    </div>
  );
}