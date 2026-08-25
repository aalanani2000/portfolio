"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useLang, useT } from "@/i18n";
import {
  VISITOR_EVENT,
  getVisitorMode,
  type VisitorMode,
} from "@/lib/visitor";
import { sfx } from "@/lib/sound";
import NeuralField from "./NeuralField";
import { fadeUp, staggerParent } from "@/lib/motion";

function BootSequence({ onDone }: { onDone: () => void }) {
  const { t, locale } = useLang();
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const lines = t.boot.lines;

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }
    if (shown >= lines.length) {
      const end = setTimeout(onDone, 550);
      return () => clearTimeout(end);
    }
    const timer = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 350 : 300);
    return () => clearTimeout(timer);
  }, [shown, lines.length, onDone, reduced]);

  return (
    <m.div
      key={locale}
      className="fixed inset-0 z-[70] flex cursor-pointer flex-col justify-center bg-bg-deep px-6"
      onClick={onDone}
      exit={{ opacity: 0, filter: "blur(6px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      role="presentation"
    >
      <div className="mx-auto w-full max-w-xl">
        {lines.slice(0, shown).map((line, i) => (
          <m.p
            key={`${locale}-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            dir="auto"
            className={`py-1 font-mono text-sm sm:text-base ${
              i === 0 || i === lines.length - 1
                ? "text-accent"
                : i === 2 || i === 3
                  ? "font-semibold text-hi"
                  : "text-mid"
            }`}
          >
            <span className="me-3 text-low">›</span>
            {line}
          </m.p>
        ))}
        <span className="mt-1 inline-block h-4 w-2 animate-pulse bg-accent" />
        <p className="absolute inset-x-0 bottom-8 text-center font-mono text-xs tracking-widest text-low">
          {t.boot.skip}
        </p>
      </div>
    </m.div>
  );
}

export default function Hero() {
  const { locale } = useLang();
  const t = useT();
  const [booting, setBooting] = useState(false);
  const [bootedOnce, setBootedOnce] = useState(false);
  const [visitorMode, setVisitorModeState] = useState<VisitorMode | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setVisitorModeState(getVisitorMode());
    }, 0);
    const handler = (e: Event) =>
      setVisitorModeState((e as CustomEvent<VisitorMode | null>).detail);
    window.addEventListener(VISITOR_EVENT, handler);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(VISITOR_EVENT, handler);
    };
  }, []);

  const ctas = visitorMode ? t.visitor.heroCtas[visitorMode] : null;

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const id = window.setTimeout(() => {
      const seen = sessionStorage.getItem("aa-boot-seen");
      if (!seen && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setBooting(true);
        document.body.style.overflow = "hidden";
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const finishBoot = useCallback(() => {
    setBooting(false);
    setBootedOnce(true);
    sessionStorage.setItem("aa-boot-seen", "1");
    document.body.style.overflow = "";
  }, []);

  const revealDelay = bootedOnce ? 0.15 : 0.35;

  return (
    <>
      <AnimatePresence>
        {booting && <BootSequence key="boot" onDone={finishBoot} />}
      </AnimatePresence>

      <section
        id="top"
        className="grid-bg relative flex min-h-screen items-center overflow-hidden pt-16"
      >
        <NeuralField />
        <div aria-hidden className="aurora pointer-events-none absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-180px] end-[-160px] size-[420px] rounded-full bg-violet/10 blur-[120px]"
        />

        <m.div
          variants={staggerParent(0.14, revealDelay)}
          initial="hidden"
          animate="show"
          className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8"
        >
          <m.div variants={fadeUp} className="mb-7 flex items-center gap-3">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-ok" />
            </span>
            <span className="mono-label">{t.hero.status}</span>
            <span className="hidden h-4 w-px bg-line-strong sm:block" />
            <span className="hidden font-mono text-xs tracking-widest text-low sm:block">
              {t.hero.available}
            </span>
          </m.div>

          <m.h1
            variants={fadeUp}
            className={`font-display max-w-none text-[clamp(3.25rem,9.5vw,7.75rem)] font-bold tracking-tighter ${
              locale === "ar" ? "leading-[1.15]" : "leading-[0.95]"
            }`}
          >
            {locale === "ar" ? (
              <span className="block text-hi">{t.hero.name}</span>
            ) : (
              <>
                <span className="block">{t.hero.name.split(" ")[0]}</span>
                <span className="block bg-gradient-to-r from-hi via-hi to-mid bg-clip-text text-transparent">
                  {t.hero.name.split(" ").slice(1).join(" ")}
                </span>
              </>
            )}
          </m.h1>

          <m.p
            variants={fadeUp}
            className={`mt-4 text-[clamp(1.6rem,4vw,3rem)] font-bold tracking-tight ${
              locale === "ar"
                ? "text-accent"
                : "text-shimmer w-fit bg-gradient-to-r from-accent from-30% via-cyan via-60% to-violet bg-clip-text text-transparent"
            }`}
          >
            {t.hero.role}
          </m.p>

          <m.p
            variants={fadeUp}
            className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs tracking-wider text-low sm:text-sm"
          >
            {t.hero.rolesAlt.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </m.p>

          <m.div variants={fadeUp} className="mt-8 max-w-2xl space-y-3">
            <p className="text-lg leading-relaxed text-mid">{t.hero.line1}</p>
            <p className="font-mono text-sm tracking-wide text-accent/90">
              {t.hero.line2}
            </p>
          </m.div>

          <m.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <a
              href="#projects"
              onMouseEnter={() => sfx.tick()}
              onClick={() => sfx.confirm()}
              onMouseMove={(e) => {
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
                  return;
                const el = e.currentTarget;
                const r = el.getBoundingClientRect();
                const dx = e.clientX - (r.left + r.width / 2);
                const dy = e.clientY - (r.top + r.height / 2);
                el.style.transition = "transform .12s ease-out";
                el.style.transform = `translate(${dx * 0.16}px, ${dy * 0.2}px)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transition = "transform .3s ease-out";
                e.currentTarget.style.transform = "";
              }}
              className="flex h-12 items-center rounded-full bg-accent px-7 text-sm font-semibold text-white shadow-lg shadow-accent/25"
            >
              {ctas?.primary ?? t.hero.ctaProjects}
            </a>
            <a
              href="/api/cv"
              onMouseEnter={() => sfx.tick()}
              onClick={() => sfx.confirm()}
              className="flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-semibold text-hi transition-colors hover:border-accent/50 hover:text-accent"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
              </svg>
              {t.hero.cv}
            </a>
            <a
              href="#contact"
              className="flex h-12 items-center rounded-full border border-line-strong px-7 text-sm font-semibold text-hi transition-colors hover:border-accent/50 hover:text-accent"
            >
              {ctas?.secondary ?? t.hero.ctaContact}
            </a>
          </m.div>

          <m.ul
            variants={fadeUp}
            className="mt-10 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-widest text-mid"
          >
            {t.hero.capabilities.map((c) => (
              <li
                key={c}
                className="rounded-full border border-line bg-panel/60 px-3 py-1.5"
              >
                {c}
              </li>
            ))}
          </m.ul>
        </m.div>

        <m.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: revealDelay + 1, duration: 0.8 }}
          className="absolute bottom-6 start-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.3em] text-low transition-colors hover:text-accent rtl:translate-x-1/2"
        >
          ↓ {t.hero.scrollHint}
        </m.a>
      </section>
    </>
  );
}
