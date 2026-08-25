"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { pick, useLang } from "@/i18n";
import { THINK_STAGES } from "@/content/data";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import SectionHeader from "./SectionHeader";

export default function HowIThink() {
  const { locale, t } = useLang();
  const th = t.think;
  const [active, setActive] = useState(0);
  const stage = THINK_STAGES[active];

  return (
    <section id="how-i-think" className="cv-auto relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader index="04" label={th.label} title={th.heading} intro={th.intro} />

        <m.div
          variants={staggerParent()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <m.div variants={fadeUp} className="mt-12">
            <div className="flex gap-2 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible">
              {THINK_STAGES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={`group flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2.5 transition-all duration-300 ${
                    active === i
                      ? "border-accent/70 bg-panel-2 shadow-lg shadow-accent/10"
                      : "border-line bg-panel/50 hover:border-line-strong"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] tracking-widest ${
                      active === i ? "text-accent" : "text-low"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`whitespace-nowrap text-sm font-medium transition-colors ${
                      active === i ? "text-hi" : "text-mid group-hover:text-hi"
                    }`}
                  >
                    {pick(s.label, locale)}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-2 h-px w-full bg-gradient-to-r from-line-strong to-transparent" />
          </m.div>

          <AnimatePresence mode="wait">
            <m.div
              key={`${stage.id}-${locale}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="glass-panel mt-8 grid gap-8 rounded-2xl p-6 sm:p-8 lg:grid-cols-[1fr_1fr]"
            >
              <div>
                <p className="mono-label mb-2">
                  STAGE {String(active + 1).padStart(2, "0")} /{" "}
                  {THINK_STAGES.length}
                </p>
                <h3 className="text-xl font-bold sm:text-2xl">
                  {pick(stage.label, locale)}
                </h3>
                <p className="mt-3 leading-relaxed text-mid">
                  {pick(stage.detail, locale)}
                </p>
              </div>
              <div className="rounded-xl border-s-2 border-s-cyan bg-bg-deep/50 p-5">
                <p className="mono-label mb-2">APPLIED IN REALITY // واقعياً</p>
                <p className="leading-relaxed text-hi">
                  {pick(stage.example, locale)}
                </p>
                <p className="mt-4 font-mono text-[11px] tracking-wider text-low">
                  ◦ {th.stageHint}
                </p>
              </div>
            </m.div>
          </AnimatePresence>
        </m.div>
      </div>
    </section>
  );
}
