"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLang } from "@/i18n";
import { getPipeline, type BuildGoal } from "@/content/data";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import SectionHeader from "./SectionHeader";
import PipelineFlow from "./PipelineFlow";

const GOALS: BuildGoal[] = [
  "chatbot",
  "rag",
  "vision",
  "automation",
  "app",
  "fullstack",
  "backend",
  "dataml",
];

export default function BuildWithMe() {
  const { t, locale } = useLang();
  const b = t.build;
  const [goal, setGoal] = useState<BuildGoal>("rag");

  return (
    <section id="build-with-me" className="cv-auto relative py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute end-[-140px] top-32 size-[420px] rounded-full bg-accent/6 blur-[130px]"
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader index="05" label={b.label} title={b.heading} intro={b.intro} />

        <m.div
          variants={staggerParent()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <m.p variants={fadeUp} className="mt-12 font-mono text-xs uppercase tracking-[0.25em] text-low">
            {b.pickLabel}
          </m.p>
          <m.div variants={fadeUp} className="mt-4 flex flex-wrap gap-2.5">
            {GOALS.map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                aria-pressed={goal === g}
                className={`h-12 rounded-full border px-6 text-sm font-semibold transition-all duration-300 ${
                  goal === g
                    ? "border-accent/70 bg-panel-2 text-hi shadow-lg shadow-accent/10"
                    : "border-line bg-panel/50 text-mid hover:border-line-strong hover:text-hi"
                }`}
              >
                {b.goals[g]}
              </button>
            ))}
          </m.div>

          <m.p
            variants={fadeUp}
            className="mt-5 max-w-2xl border-s-2 border-s-violet/50 ps-4 text-sm leading-relaxed text-mid"
          >
            {b.anythingNote}
          </m.p>

          <m.div variants={fadeUp} className="mt-10 rounded-2xl border border-line bg-bg-deep/40 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <m.div
                key={`${goal}-${locale}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <p className="mono-label mb-1">{b.note}</p>
                <h3 className="mb-6 text-lg font-bold text-hi sm:text-xl">
                  {b.goals[goal]}
                </h3>
                <PipelineFlow pipeline={getPipeline(goal)} />
              </m.div>
            </AnimatePresence>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
