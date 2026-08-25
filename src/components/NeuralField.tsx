"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type P = { x: number; y: number; vx: number; vy: number };

export default function NeuralField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const g = canvas.getContext("2d");
    if (!g) return;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let pts: P[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999, active: false };
    const LINK = 115;
    const REPEL = 150;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(95, Math.floor((w * h) / 15000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
      }));
    };

    const step = () => {
      if (!running) return;
      g.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        if (mouse.active) {
          const dxm = p.x - mouse.x;
          const dym = p.y - mouse.y;
          const dm2 = dxm * dxm + dym * dym;
          if (dm2 < REPEL * REPEL && dm2 > 1) {
            const d = Math.sqrt(dm2);
            const force = ((REPEL - d) / REPEL) * 0.55;
            p.vx += (dxm / d) * force * 0.35;
            p.vy += (dym / d) * force * 0.35;
          }
        }

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 1.4) {
          p.vx *= 1.4 / speed;
          p.vy *= 1.4 / speed;
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
      }

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / LINK) * 0.3;

            let cursorBoost = 0;
            if (mouse.active) {
              const mx = (a.x + b.x) / 2 - mouse.x;
              const my = (a.y + b.y) / 2 - mouse.y;
              const md = Math.hypot(mx, my);
              if (md < REPEL) cursorBoost = (1 - md / REPEL) * 0.55;
            }

            g.strokeStyle = `rgba(96, 165, 250, ${Math.min(alpha + cursorBoost, 0.8)})`;
            g.lineWidth = cursorBoost > 0.1 ? 1.6 : 1.2;
            g.beginPath();
            g.moveTo(a.x, a.y);
            g.lineTo(b.x, b.y);
            g.stroke();
          }
        }
      }

      for (const p of pts) {
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const near = mouse.active && dxm * dxm + dym * dym < REPEL * REPEL;
        g.fillStyle = near ? "rgba(147, 197, 253, 1)" : "rgba(148, 163, 184, 0.85)";
        g.beginPath();
        g.arc(p.x, p.y, near ? 2.4 : 1.7, 0, Math.PI * 2);
        g.fill();
      }

      raf = requestAnimationFrame(step);
    };

    const drawStatic = () => {
      g.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            g.strokeStyle = `rgba(96, 165, 250, ${((1 - Math.sqrt(d2) / LINK) * 0.14).toFixed(3)})`;
            g.beginPath();
            g.moveTo(a.x, a.y);
            g.lineTo(b.x, b.y);
            g.stroke();
          }
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const p of pts) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 220) {
          const impulse = (1 - d / 220) * 3.2;
          p.vx += (dx / d) * impulse;
          p.vy += (dy / d) * impulse;
        }
      }
    };

    resize();
    if (reduced) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(step);
    }
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    canvas.parentElement?.addEventListener("click", onClick as EventListener);

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !reduced && raf === 0) {
          raf = requestAnimationFrame(step);
        }
        if (!running && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "80px" },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      canvas.parentElement?.removeEventListener("click", onClick as EventListener);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 size-full opacity-100"
    />
  );
}
