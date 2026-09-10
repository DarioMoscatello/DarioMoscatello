"use client";

import { useEffect } from "react";

export default function InteractiveLayer() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active: HTMLElement | null = null;
    let frame = 0;
    let latest: PointerEvent | null = null;

    const reset = (element: HTMLElement | null) => {
      if (!element) return;
      element.style.setProperty("--local-x", "50%");
      element.style.setProperty("--local-y", "50%");
    };

    const paint = () => {
      frame = 0;
      const event = latest;
      if (!event) return;
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);

      const target = event.target as Element | null;
      const surface = target?.closest<HTMLElement>("[data-interactive]") ?? null;
      if (surface !== active) {
        reset(active);
        active = surface;
      }
      if (!surface) return;

      const rect = surface.getBoundingClientRect();
      surface.style.setProperty("--local-x", `${event.clientX - rect.left}px`);
      surface.style.setProperty("--local-y", `${event.clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reduceMotion.matches) return;
      latest = event;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      reset(active);
      active = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      reset(active);
    };
  }, []);

  return null;
}
