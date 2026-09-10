"use client";

import { useEffect } from "react";

const RESET = {
  "--card-x": "50%",
  "--card-y": "50%",
  "--tilt-x": "0deg",
  "--tilt-y": "0deg",
} as const;

export default function InteractiveLayer() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let active: HTMLElement | null = null;
    let frame = 0;
    let latest: PointerEvent | null = null;

    const reset = (element: HTMLElement | null) => {
      if (!element) return;
      Object.entries(RESET).forEach(([property, value]) => {
        element.style.setProperty(property, value);
      });
    };

    const paint = () => {
      frame = 0;
      const event = latest;
      if (!event) return;

      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const nx = event.clientX / width - 0.5;
      const ny = event.clientY / height - 0.5;

      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
      root.style.setProperty("--pointer-nx", nx.toFixed(4));
      root.style.setProperty("--pointer-ny", ny.toFixed(4));
      root.style.setProperty("--scene-x", `${(nx * -26).toFixed(2)}px`);
      root.style.setProperty("--scene-y", `${(ny * -26).toFixed(2)}px`);
      root.style.setProperty("--scene-rotation", `${(nx * 2).toFixed(2)}deg`);

      const target = event.target as Element | null;
      const surface = target?.closest<HTMLElement>("[data-interactive]") ?? null;

      if (surface !== active) {
        reset(active);
        active = surface;
      }

      if (!surface) return;
      const rect = surface.getBoundingClientRect();
      const localX = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      const localY = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      const localNx = localX / Math.max(rect.width, 1) - 0.5;
      const localNy = localY / Math.max(rect.height, 1) - 0.5;

      surface.style.setProperty("--card-x", `${localX}px`);
      surface.style.setProperty("--card-y", `${localY}px`);
      surface.style.setProperty("--tilt-x", `${(-localNy * 2.4).toFixed(2)}deg`);
      surface.style.setProperty("--tilt-y", `${(localNx * 2.4).toFixed(2)}deg`);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reduceMotion.matches || !finePointer.matches) {
        return;
      }
      latest = event;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onPointerLeave = () => {
      reset(active);
      active = null;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
      reset(active);
    };
  }, []);

  return (
    <>
      <div className="environment" aria-hidden="true">
        <div className="environment-glow" />
        <svg className="ambient-crystal" viewBox="0 0 640 640">
          <defs>
            <linearGradient id="crystalEdge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#a86cff" stopOpacity="0.9" />
              <stop offset="0.55" stopColor="#5f2cff" stopOpacity="0.18" />
              <stop offset="1" stopColor="#c490ff" stopOpacity="0.68" />
            </linearGradient>
            <radialGradient id="crystalFill" cx="50%" cy="48%" r="58%">
              <stop offset="0" stopColor="#7b36ff" stopOpacity="0.02" />
              <stop offset="0.72" stopColor="#6328be" stopOpacity="0.07" />
              <stop offset="1" stopColor="#a45cff" stopOpacity="0.18" />
            </radialGradient>
          </defs>
          <polygon
            className="crystal-face"
            points="320,42 493,116 592,286 544,476 361,594 159,543 47,368 101,168"
            fill="url(#crystalFill)"
            stroke="url(#crystalEdge)"
          />
          <polygon
            points="320,42 395,170 493,116 458,271 592,286 458,365 544,476 371,449 361,594 277,449 159,543 190,371 47,368 183,282 101,168 264,188"
            fill="none"
            stroke="url(#crystalEdge)"
          />
          <path d="M264 188 320 42l75 128 63 101 86 205-173-27-94 0-118 94 31-172-7-89-82-114 163 20Z" fill="none" stroke="#8c4dff" strokeOpacity=".23" />
        </svg>
        <div className="orbit orbit-a" />
        <div className="orbit orbit-b" />
      </div>
      <div className="cursor-aura" aria-hidden="true" />
    </>
  );
}
