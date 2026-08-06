// shared/hooks/useSwipe.ts

"use client";

import { useEffect, useRef } from "react";

export function useSwipe(speed = 1.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let moved = false;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      moved = false;
      startX = "touches" in e ? e.touches[0].clientX : e.clientX;
      scrollStart = el.scrollLeft;
      if (e instanceof MouseEvent) el.style.cursor = "grabbing";
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const distance = startX - x;

      if (Math.abs(distance) > 5) {
        moved = true;
        if ("touches" in e) e.preventDefault();
        el.scrollLeft = scrollStart + distance * speed;
      }
    };

    const onUp = () => { isDown = false; el.style.cursor = ""; };

    const onClick = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mouseleave", onUp);
    el.addEventListener("click", onClick, true);

    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("mouseleave", onUp);
      el.removeEventListener("click", onClick, true);

      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onUp);
    };
  }, [speed]);

  return ref;
}