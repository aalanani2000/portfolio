"use client";

import { m } from "framer-motion";
import { pick, useLang } from "@/i18n";
import { EXPERIENCE_REFS } from "@/content/data";
import SectionHeader from "./SectionHeader";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";

export default function About() {
  const { locale, t } = useLang();
  const facts: [string, string][] = [
    [t.about.factLabels.role, t.about.facts.role],
    [t.about.factLabels.base, t.about.facts.base],
    [t.about.factLabels.languages, t.about.facts.languages],
    [t.about.factLabels.degree, t.about.facts.degree],
    [t.about.factLabels.accreditation, t.about.facts.accreditation],
  ];

  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <m.div
          variants={staggerParent()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <SectionHeader
            index="01"
            label={t.about.label}
            title={t.about.heading}
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
            <div className="space-y-5">
              {[t.about.p1, t.about.p2, t.about.p3].map((p, i) => (
                <m.p
                  key={i}
                  variants={fadeUp}
                  className="leading-relaxed text-mid"
                >
                  {p}
                </m.p>
              ))}

              <m.blockquote
                variants={fadeUp}
                className="glass-panel mt-8 rounded-xl border-s-2 border-s-accent p-5 text-lg font-medium text-hi"
              >
                “{t.about.quote}”
              </m.blockquote>

              <m.div variants={fadeUp} className="pt-6">
                <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-low">
                  {t.about.expTitle}
                </h3>
                <div className="space-y-4">
                  {Object.values(EXPERIENCE_REFS).map((exp) => (
                    <div
                      key={exp.title.en}
                      className="glass-panel rounded-xl p-5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-semibold text-hi">
                          {pick(exp.title, locale)}
                        </p>
                        <p className="font-mono text-[11px] tracking-wide text-accent">
                          {pick(exp.period, locale)}
                        </p>
                      </div>
                      <p className="mt-0.5 font-mono text-xs text-low">
                        {pick(exp.org, locale)}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {exp.points.map((pt, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm leading-relaxed text-mid"
                          >
                            <span
                              aria-hidden
                              className="mt-[7px] size-1.5 shrink-0 rounded-[2px] bg-accent/70"
                            />
                            {pick(pt, locale)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </m.div>

              <m.div variants={fadeUp} className="pt-4">
                <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-low">
                  {t.about.strengthsTitle}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {t.about.strengths.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-line bg-panel/60 px-3.5 py-1.5 text-sm text-mid transition-colors hover:border-accent/40 hover:text-hi"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </m.div>
            </div>

            <m.aside
              variants={fadeUp}
              className="glass-panel h-fit rounded-2xl p-6 lg:sticky lg:top-24"
            >
              <h3 className="mono-label mb-5">{t.about.factsTitle}</h3>
              <dl className="space-y-4">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-low">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-hi">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </m.aside>
          </div>
        </m.div>
      </div>
    </section>
  );
}
