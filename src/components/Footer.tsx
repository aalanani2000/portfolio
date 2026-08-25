"use client";

import { useLang } from "@/i18n";
import { LINKS } from "@/content/data";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-deep/70">
      <div
        aria-hidden
        className="ghost-wordmark pointer-events-none absolute -bottom-6 start-1/2 -translate-x-1/2 text-[clamp(4rem,14vw,11rem)] rtl:translate-x-1/2"
      >
        ALANANI
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row sm:px-8">
        <div className="text-center sm:text-start">
          <p className="flex items-center justify-center gap-2.5 font-semibold text-hi sm:justify-start">
            <span className="grid size-7 place-items-center rounded-md border border-line-strong bg-panel font-mono text-[11px] font-bold text-accent">
              AA
            </span>
            {t.hero.name}
          </p>
          <p className="mt-1.5 text-sm text-low">{t.footer.tagline}</p>        </div>

        <div className="flex items-center gap-4 font-mono text-xs text-low">
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
            GitHub ↗
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
            LinkedIn ↗
          </a>
          <a href={`mailto:${LINKS.email}`} className="transition-colors hover:text-accent">
            Email ↗
          </a>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-4 font-mono text-[11px] text-low sm:flex-row sm:px-8">
          <p>© {year} Abdulrahman Alanani — {t.footer.rights}</p>
          <p>{t.footer.built}</p>
        </div>
      </div>
    </footer>
  );
}
