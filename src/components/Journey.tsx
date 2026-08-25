"use client";

import { useEffect, useRef, useState } from "react";
import { m, useInView, useScroll, useSpring } from "framer-motion";
import { pick, useLang } from "@/i18n";
import { CERTS, JOURNEY } from "@/content/data";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import SectionHeader from "./SectionHeader";

function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1300;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

function Signals() {
  const { t } = useLang();
  const s = t.journey.signals;

  const items = [
    s.projects,
    s.subsystems,
    s.downtime,
    s.resolution,
    s.fcr,
    s.incidents,
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="glass-panel rounded-xl p-4 text-center">
          <p className="bg-gradient-to-r from-accent to-cyan bg-clip-text font-mono text-2xl font-bold text-transparent sm:text-3xl">
            <CountUp value={item.value} suffix={item.suffix ?? ""} />
          </p>
          <p className="mt-1.5 text-[11px] leading-snug text-low">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function Journey() {
  const { locale, t } = useLang();
  const j = t.journey;

  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.85", "end 0.55"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  return (
    <section id="journey" className="cv-auto relative py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute start-[-180px] bottom-24 size-[460px] rounded-full bg-violet/7 blur-[140px]"
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader index="06" label={j.label} title={j.heading} intro={j.intro} />

        <m.div
          variants={staggerParent()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <m.p variants={fadeUp} className="mono-label mt-12 mb-5">
            {j.signalsTitle}
          </m.p>
          <m.div variants={fadeUp}>
            <Signals />
          </m.div>

          <div ref={railRef} className="relative mt-16 ps-10 sm:ps-14">
            <div
              aria-hidden
              className="absolute inset-y-0 start-[9px] w-px bg-line sm:start-[13px]"
            />
            <m.div
              aria-hidden
              style={{ scaleY }}
              className="absolute inset-y-0 start-[9px] w-px origin-top bg-gradient-to-b from-accent via-cyan to-violet sm:start-[13px]"
            />

            <div className="space-y-10">
              {JOURNEY.map((entry, i) => (
                <m.div
                  key={`${entry.period}-${i}`}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: 0.05 }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="absolute -start-10 top-1.5 size-[19px] rounded-full border-2 border-accent/60 bg-panel sm:-start-14"
                  />
                  <div className="glass-panel rounded-xl p-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs tracking-widest text-accent">
                        {entry.period}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-lg font-bold text-hi">
                      {pick(entry.title, locale)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-mid">
                      {pick(entry.desc, locale)}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-low"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </m.div>
              ))}
            </div>
          </div>

          <m.p variants={fadeUp} className="mono-label mt-16 mb-5">
            {j.certsTitle}
          </m.p>
          <m.div variants={fadeUp} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CERTS.map((cert) => (
              <div
                key={cert.name.en}
                className={`rounded-xl border p-4 transition-colors ${
                  cert.ongoing
                    ? "border-violet/40 bg-violet/5"
                    : "border-line bg-panel/50 hover:border-line-strong"
                }`}
              >
                <p className="flex items-start justify-between gap-2 text-sm font-semibold leading-snug text-hi">
                  {pick(cert.name, locale)}
                  {cert.ongoing && (
                    <span className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-violet">
                      <span className="size-1 animate-pulse rounded-full bg-violet" />
                      LIVE
                    </span>
                  )}
                </p>
                <p className="mt-1.5 font-mono text-[11px] tracking-wide text-low">
                  {pick(cert.issuer, locale)}
                </p>
              </div>
            ))}
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
