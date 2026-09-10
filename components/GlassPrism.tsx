"use client";

import { useEffect, useRef, useState } from "react";

const STATES = [
  {
    front: "REAL ESTATE",
    side: "VALUE",
    top: "CAPITAL",
    className: "prism-violet",
  },
  {
    front: "TECHNOLOGY",
    side: "SYSTEMS",
    top: "DATA",
    className: "prism-cyan",
  },
  {
    front: "BUILD NEXT",
    side: "IDEAS",
    top: "FUTURE",
    className: "prism-amber",
  },
] as const;

export default function GlassPrism() {
  const stageRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const object = objectRef.current;
    if (!object) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let targetX = -8;
    let targetY = 22;
    let currentX = targetX;
    let currentY = targetY;
    let autoAngle = 0;
    let previous = performance.now();

    if (reducedMotion) {
      object.style.transform = "rotateX(-8deg) rotateY(22deg) rotateZ(-4deg)";
      return;
    }

    const render = (now: number) => {
      const delta = Math.min(40, now - previous);
      previous = now;
      autoAngle += delta * 0.008;
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;
      object.style.transform =
        `rotateX(${currentX}deg) rotateY(${currentY + autoAngle}deg) rotateZ(-4deg)`;
      frame = requestAnimationFrame(render);
    };

    const stage = stageRef.current;
    const onMove = (event: PointerEvent) => {
      if (!stage || event.pointerType === "touch") return;
      const rect = stage.getBoundingClientRect();
      const x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      targetX = -8 - y * 18;
      targetY = 22 + x * 26;
    };
    const onLeave = () => {
      targetX = -8;
      targetY = 22;
    };

    stage?.addEventListener("pointermove", onMove, { passive: true });
    stage?.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(render);
    return () => {
      stage?.removeEventListener("pointermove", onMove);
      stage?.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  const state = STATES[active];

  return (
    <div className={`prism-stage ${state.className}`} ref={stageRef}>
      <button
        type="button"
        className="prism-trigger"
        onClick={() => setActive((value) => (value + 1) % STATES.length)}
        aria-label={`Interactive glass object showing ${state.front}. Click to change perspective.`}
      >
        <span className="prism-shadow" />
        <span className="prism" ref={objectRef}>
          <span className="prism-face prism-front">
            <strong>{state.front}</strong>
          </span>
          <span className="prism-face prism-back">
            <strong>{state.side}</strong>
          </span>
          <span className="prism-face prism-right">
            <strong>{state.side}</strong>
          </span>
          <span className="prism-face prism-left">
            <strong>{state.top}</strong>
          </span>
          <span className="prism-face prism-top">
            <strong>{state.top}</strong>
          </span>
          <span className="prism-face prism-bottom">
            <strong>{state.front}</strong>
          </span>
        </span>
      </button>

      <div className="prism-meta" aria-live="polite">
        <span>{state.front}</span>
        <span className="prism-dots" aria-hidden="true">
          {STATES.map((item, index) => (
            <i key={item.front} data-active={index === active} />
          ))}
        </span>
      </div>
    </div>
  );
}
