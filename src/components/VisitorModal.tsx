"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLang } from "@/i18n";
import {
  VISITOR_EVENT,
  VISITOR_KEY,
  getVisitorMode,
  setVisitorMode,
  type VisitorMode,
} from "@/lib/visitor";

const MODES: VisitorMode[] = ["hiring", "engineer", "curious"];

export function ModeBadge() {
  const { t } = useLang();
  const v = t.visitor;
  const [mode, setMode] = useState<VisitorMode | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setMode(getVisitorMode());
    }, 0);
    const onChange = (e: Event) =>
      setMode((e as CustomEvent<VisitorMode | null>).detail);
    window.addEventListener(VISITOR_EVENT, onChange);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(VISITOR_EVENT, onChange);
    };
  }, []);

  return (
    <AnimatePresence>
      {mode && (
        <m.div
          key="badge"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-6 start-6 z-[75] hidden items-center gap-2 rounded-full border border-violet/40 bg-panel-2/90 px-3.5 py-2 text-xs backdrop-blur sm:flex"
        >
          <span className="text-low">{v.modeBadge}:</span>
          <span className="font-semibold text-hi">{v[mode].title}</span>
          <button
            onClick={() => setVisitorMode(null)}
            aria-label={v.reset}
            className="ms-1 grid size-5 place-items-center rounded-full border border-line text-[10px] text-mid transition-colors hover:border-accent/50 hover:text-accent"
          >
            ✕
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export default function VisitorModal() {
  const { t } = useLang();
  const v = t.visitor;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (cancelled) return;
      try {
        if (
          !window.localStorage.getItem(VISITOR_KEY) &&
          !window.sessionStorage.getItem("aa-visitor-asked") &&
          !window.sessionStorage.getItem("aa-boot-seen")
        ) {
          setOpen(true);
        }
      } catch {
        /* storage unavailable */
      }
    }, 2600);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  const close = () => {
    try {
      window.sessionStorage.setItem("aa-visitor-asked", "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          key="visitor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[85] flex items-end justify-center bg-bg-deep/70 p-4 backdrop-blur-sm sm:items-center"
          onClick={close}
          role="presentation"
        >
          <m.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.21, 0.6, 0.35, 1] }}
            className="glass-panel backdrop-blur-xl w-full max-w-xl rounded-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={v.title}
          >
            <p className="mono-label mb-2">SYSTEM QUERY</p>
            <h2 className="text-2xl font-bold">{v.title}</h2>
            <p className="mt-2 text-sm text-mid">{v.sub}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setVisitorMode(m);
                    close();
                  }}
                  className="group rounded-xl border border-line bg-panel/60 p-4 text-start transition-all hover:-translate-y-1 hover:border-accent/60"
                >
                  <span className="text-2xl" aria-hidden>
                    {v[m].emoji}
                  </span>
                  <p className="mt-2 font-semibold text-hi group-hover:text-accent">
                    {v[m].title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-mid">
                    {v[m].desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={close}
                className="font-mono text-xs tracking-wider text-low transition-colors hover:text-accent"
              >
                {v.skip} →
              </button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
