"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/i18n";

const SECTIONS = [
  { id: "top", code: "SYS.00 // BOOT" },
  { id: "about", code: "SYS.01 // IDENTITY" },
  { id: "skills", code: "SYS.02 // CAPABILITY" },
  { id: "projects", code: "SYS.03 // PROJECT LAB" },
  { id: "how-i-think", code: "SYS.04 // METHODOLOGY" },
  { id: "build-with-me", code: "SYS.05 // CONCEPT LAB" },
  { id: "journey", code: "SYS.06 // TRAJECTORY" },
  { id: "how", code: "SYS.07 // TRANSPARENCY" },
  { id: "contact", code: "SYS.08 // CHANNEL" },
];

export default function SignalSpine() {
  const fillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const { locale } = useLang();

  useEffect(() => {
    let raf = 0;
    let queued = false;

    const update = () => {
      queued = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (fillRef.current) {
        fillRef.current.style.setProperty("--sp", String(p));
      }

      let current = SECTIONS[0].code;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
          current = s.code;
        }
      }
      if (labelRef.current && labelRef.current.textContent !== current) {
        labelRef.current.textContent = current;
      }
    };

    const onScroll = () => {
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const clock = window.setInterval(() => {
      if (!clockRef.current) return;
      const now = new Date();
      const riyadh = new Date(now.getTime() + (3 * 60 + now.getTimezoneOffset()) * 60000);
      clockRef.current.textContent = `RUH ${String(riyadh.getHours()).padStart(2, "0")}:${String(
        riyadh.getMinutes(),
      ).padStart(2, "0")}`;
    }, 15000);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearInterval(clock);
    };
  }, []);

  return (
    <aside className="spine-rail" aria-hidden>
      <span
        ref={clockRef}
        dir="ltr"
        style={{
          writingMode: "vertical-rl",
          transform: locale === "ar" ? "rotate(180deg)" : undefined,
        }}
        className="font-mono text-[9px] tracking-[0.3em] text-ok"
      >
        RUH --:--
      </span>
      <div className="spine-track">
        <div ref={fillRef} className="spine-fill" />
      </div>
      <span
        ref={labelRef}
        style={{ transform: locale === "ar" ? "rotate(180deg)" : undefined }}
        className="spine-readout"
      >
        SYS.00 // BOOT
      </span>
    </aside>
  );
}
