"use client";

import { useEffect, useRef } from "react";

type Speck = {
  x: number;
  y: number;
  size: number;
  alpha: number;
};

type RingPoint = {
  angle: number;
  radius: number;
  spread: number;
  size: number;
  alpha: number;
};

type SpherePoint = {
  theta: number;
  phi: number;
  size: number;
  alpha: number;
};

function randomFactory(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export default function ParticleOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const random = randomFactory(42);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    let width = 1;
    let height = 1;
    let frame = 0;
    let start = performance.now();
    let specks: Speck[] = [];
    let ring: RingPoint[] = [];
    let sphere: SpherePoint[] = [];

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = width < 560 ? 0.58 : 1;
      specks = Array.from({ length: Math.round(180 * density) }, () => ({
        x: random() * width,
        y: random() * height,
        size: 0.35 + random() * 0.7,
        alpha: 0.08 + random() * 0.18,
      }));
      ring = Array.from({ length: Math.round(1450 * density) }, () => ({
        angle: random() * Math.PI * 2,
        radius: 0.44 + (random() - 0.5) * 0.075,
        spread: (random() - 0.5) * 0.026,
        size: 0.35 + random() * 0.85,
        alpha: 0.13 + random() * 0.34,
      }));
      sphere = Array.from({ length: Math.round(980 * density) }, () => ({
        theta: random() * Math.PI * 2,
        phi: Math.acos(2 * random() - 1),
        size: 0.35 + random() * 0.75,
        alpha: 0.12 + random() * 0.3,
      }));
    };

    const dot = (x: number, y: number, size: number, alpha: number) => {
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 82 && distance > 0) {
        const force = (82 - distance) / 82;
        x += (dx / distance) * force * 13;
        y += (dy / distance) * force * 13;
        alpha = Math.min(0.72, alpha + force * 0.25);
      }
      context.fillStyle = `rgba(74, 76, 75, ${alpha})`;
      context.fillRect(x, y, size, size);
    };

    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      const time = reducedMotion.matches ? 0 : (now - start) * 0.000045;
      const cx = width * 0.52;
      const cy = height * 0.53;
      const unit = Math.min(width, height);
      const tilt = -0.42;

      specks.forEach((point) => dot(point.x, point.y, point.size, point.alpha));

      ring.forEach((point) => {
        const angle = point.angle + time;
        const radiusX = width * point.radius;
        const radiusY = unit * (0.07 + point.spread);
        const rawX = Math.cos(angle) * radiusX;
        const rawY = Math.sin(angle) * radiusY;
        const x = cx + rawX * Math.cos(tilt) - rawY * Math.sin(tilt);
        const y = cy + rawX * Math.sin(tilt) + rawY * Math.cos(tilt);
        dot(x, y, point.size, point.alpha);
      });

      const sphereRadius = unit * 0.175;
      sphere.forEach((point) => {
        const theta = point.theta + time * 1.7;
        const sinPhi = Math.sin(point.phi);
        const x3 = sinPhi * Math.cos(theta);
        const y3 = Math.cos(point.phi);
        const z3 = sinPhi * Math.sin(theta);
        const x = cx + (x3 + z3 * 0.14) * sphereRadius;
        const y = cy + y3 * sphereRadius;
        const depth = (z3 + 1) / 2;
        dot(x, y, point.size * (0.7 + depth * 0.55), point.alpha * (0.55 + depth * 0.75));
      });

      if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    const observer = new ResizeObserver(() => {
      build();
      if (reducedMotion.matches) draw(performance.now());
    });
    observer.observe(canvas);
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    build();
    draw(start);

    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="particle-orbit" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
