"use client";

import { useLang } from "@/i18n";
import { LINKS } from "@/content/data";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import { m } from "framer-motion";

export default function Contact() {
  const { t } = useLang();

  const channels = [
    {
      label: t.contact.email,
      value: LINKS.email,
      href: `mailto:${LINKS.email}`,
      icon: (
        <path d="M3 8l9 6 9-6M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
      ),
    },
    {
      label: t.contact.linkedin,
      value: "in/abdulrahman-alanani",
      href: LINKS.linkedin,
      icon: (
        <path d="M6.5 8.5v10M6.5 5.5v.01M11 18.5v-6a3 3 0 0 1 6 0v6M11 18.5H8.5M17 18.5h2.5" />
      ),
    },
    {
      label: t.contact.github,
      value: "github.com/aalanani2000",
      href: LINKS.github,
      icon: (
        <path d="M9 19c-4 1.2-4-2-6-2.5M15 20v-3.2c0-.9.1-1.3-.5-1.9 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.8 11.8 0 0 0-6.4 0C6.4 2.2 5.4 2.5 5.4 2.5a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 8.9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 1.9V20" />
      ),
    },
  ];

  return (
    <section id="contact" className="cv-auto relative py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 start-1/2 size-[600px] -translate-x-1/2 rounded-full bg-accent/8 blur-[150px]"
      />
      <m.div
        variants={staggerParent()}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative mx-auto max-w-6xl px-5 text-center sm:px-8"
      >
        <m.p variants={fadeUp} className="mono-label relative mb-3">
          {t.contact.label}
        </m.p>
        <span
          aria-hidden
          className="ghost-index pointer-events-none absolute -top-8 start-1/2 -translate-x-1/2 opacity-70 rtl:translate-x-1/2"
        >
          08
        </span>
        <m.h2
          variants={fadeUp}
          className="relative mx-auto max-w-3xl text-balance text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-tight"
        >
          {t.contact.heading}
        </m.h2>
        <m.p
          variants={fadeUp}
          className="mx-auto mt-5 max-w-xl leading-relaxed text-mid"
        >
          {t.contact.sub}
        </m.p>

        <m.div
          variants={fadeUp}
          className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3"
        >
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group glass-panel rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
            >
              <span className="mx-auto mb-4 grid size-12 place-items-center rounded-xl border border-line bg-panel text-accent transition-colors group-hover:border-accent/50">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                  aria-hidden
                >
                  {c.icon}
                </svg>
              </span>
              <p className="font-semibold text-hi">{c.label}</p>
              <p className="mt-1 break-all font-mono text-xs text-low transition-colors group-hover:text-mid">
                {c.value}
              </p>
            </a>
          ))}
        </m.div>

        <m.div variants={fadeUp} className="mt-8">
          <p className="mono-label mb-3">{t.contact.rolesLabel}</p>
          <ul className="flex flex-wrap justify-center gap-2">
            {t.contact.roles.map((role) => (
              <li
                key={role}
                className="rounded-full border border-line-strong bg-panel/60 px-4 py-1.5 text-sm text-hi"
              >
                {role}
              </li>
            ))}
          </ul>
          <a
            href="/api/cv"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-semibold text-hi transition-colors hover:border-accent/60 hover:text-accent"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
            {t.hero.cv}
          </a>
        </m.div>

        <m.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-2 font-mono text-xs tracking-wider text-low sm:flex-row sm:gap-4"
        >
          <span className="flex items-center gap-2">
            <span className="size-1.5 animate-pulse rounded-full bg-ok" />
            {t.nav.openTo}
          </span>
          <span className="hidden sm:block">·</span>
          <span>{t.contact.locationTag}</span>
          <span className="hidden sm:block">·</span>
          <span>{t.contact.responseNote}</span>
        </m.div>
      </m.div>
    </section>
  );
}
