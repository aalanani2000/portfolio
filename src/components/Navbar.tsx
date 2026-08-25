"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/i18n";
import { SOUND_EVENT, setSoundEnabled, sfx, soundEnabled } from "@/lib/sound";
import { m } from "framer-motion";

const SECTION_IDS = ["about", "skills", "projects", "contact"] as const;

export default function Navbar() {
  const { t, toggle } = useLang();
  const [sound, setSound] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setSound(soundEnabled()), 0);
    const handler = (e: Event) => setSound(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener(SOUND_EVENT, handler);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(SOUND_EVENT, handler);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let queued = false;
    const update = () => {
      queued = false;
      let current: string | null = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          current = id;
        }
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const links = [
    { href: "#about", id: "about" as const, label: t.nav.about },
    { href: "#skills", id: "skills" as const, label: t.nav.skills },
    { href: "#projects", id: "projects" as const, label: t.nav.projects },
    { href: "#contact", id: "contact" as const, label: t.nav.contact },
  ];

  return (
    <m.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1], delay: 0.15 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="flex h-12 items-center gap-1 rounded-full border border-line-strong bg-panel/80 ps-2 pe-2 shadow-xl shadow-black/30 backdrop-blur-xl">
        <a
          href="#top"
          className="me-1 grid size-8 place-items-center rounded-full border border-line-strong bg-panel-2 font-mono text-[11px] font-bold text-accent"
          aria-label={t.hero.name}
        >
          AA
        </a>

        <ul className="hidden items-center md:flex">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.href} className="relative">
                <a
                  href={l.href}
                  onMouseEnter={() => sfx.tick()}
                  className={`relative rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                    isActive ? "text-hi" : "text-mid hover:text-hi"
                  }`}
                >
                  {isActive && (
                    <m.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full border border-accent/40 bg-accent/15"
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <span className="mx-1 hidden h-5 w-px bg-line md:block" />

        <button
          onClick={() => {
            const next = !sound;
            setSoundEnabled(next);
            setSound(next);
            if (next) sfx.confirm();
          }}
          aria-label={sound ? t.nav.soundOn : t.nav.soundOff}
          aria-pressed={sound}
          className={`grid size-8 place-items-center rounded-full border transition-colors ${
            sound ? "border-ok/50 text-ok" : "border-line text-low hover:text-mid"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden>
            {sound ? (
              <>
                <path d="M11 5 6 9H3v6h3l5 4V5z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              </>
            ) : (
              <>
                <path d="M11 5 6 9H3v6h3l5 4V5z" />
                <path d="m16 9 6 6m0-6-6 6" />
              </>
            )}
          </svg>
        </button>

        <button
          onClick={toggle}
          aria-label={t.lang.ariaLabel}
          className="ms-1 flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[13px] font-medium text-hi transition-colors hover:border-accent/50 hover:text-accent"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-3.5" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 4 5.6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.6-4-9s1.5-6.4 4-9z" />
          </svg>
          <span className="font-semibold">{t.lang.toggleTo}</span>
        </button>

        <a
          href="#contact"
          className="ms-1 hidden items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.04] lg:flex"
        >
          {t.hero.ctaContact}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </nav>
    </m.header>
  );
}
