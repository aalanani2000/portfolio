"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { pick, useLang } from "@/i18n";
import {
  ALROUF_PIPELINES,
  LINKS,
  ML_METRICS,
} from "@/content/data";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import PipelineFlow from "./PipelineFlow";
import DroneSection from "./DroneSection";
import SectionHeader from "./SectionHeader";
import AskAiChip from "./AskAiChip";

function RepoLink({ href }: { href: string }) {
  const { t } = useLang();
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-5 text-sm font-medium text-hi transition-colors hover:border-accent/60 hover:text-accent"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
        <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.72c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9l-.01 2.81c0 .27.18.59.69.49A10.28 10.28 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
      </svg>
      {t.projects.viewGithub}
    </a>
  );
}

export default function ProjectsLab() {
  const { t, locale } = useLang();
  const [task, setTask] = useState("t1");
  const p = t.projects;
  const pipeline = ALROUF_PIPELINES.find((x) => x.id === task)!;

  return (
    <section id="projects" className="cv-auto relative py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute end-[-180px] top-24 size-[520px] rounded-full bg-violet/7 blur-[140px]"
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          index="03"
          label={p.label}
          title={p.heading}
          intro={p.intro}
        />
        <m.div
          variants={staggerParent()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <m.article
            variants={fadeUp}
            id="project-alrouf"
            className="mt-16 scroll-mt-24"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="mono-label">FLAGSHIP // 01</span>
              <RepoLink href={LINKS.repos.alrouf} />
              <AskAiChip
                question={
                  locale === "ar"
                    ? "اشرح لي منصة تكامل الذكاء الاصطناعي (مشروع AL ROUF) ببساطة: ما الذي تفعله أنظمتها الثلاث؟"
                    : "Explain the AL ROUF AI Integration Platform in simple terms — what do its three subsystems do?"
                }
              />
            </div>
            <h3 className="font-display mt-3 text-2xl font-bold sm:text-3xl">
              {p.alrouf.title}
            </h3>
            <p className="mt-1 font-mono text-sm text-cyan">{p.alrouf.subtitle}</p>
            <p className="mt-4 max-w-3xl leading-relaxed text-mid">
              {p.alrouf.summary}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                [p.roleTag, p.alrouf.role],
                [p.stackTag, "Python · OpenAI · n8n · FastAPI · SQLite · Docker · pytest"],
                [p.impactTag, p.alrouf.outcome],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-line bg-panel/50 p-4">
                  <p className="mono-label mb-1.5">{label}</p>
                  <p className="text-sm leading-relaxed text-mid">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["/projects/alrouf-n8n-canvas.png", p.alrouf.media.canvas],
                  ["/projects/alrouf-openapi.png", p.alrouf.media.api],
                ] as const
              ).map(([src, caption]) => (
                <figure
                  key={src}
                  className="group overflow-hidden rounded-xl border border-line bg-bg-deep/60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={caption}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <figcaption className="border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-low">
                    {caption}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-bg-deep/40 p-5 sm:p-7">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-low">
                {p.selectTask}
              </p>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label={p.selectTask}>
                {(
                  [
                    ["t1", p.alrouf.taskTabs.t1],
                    ["t2", p.alrouf.taskTabs.t2],
                    ["t3", p.alrouf.taskTabs.t3],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={task === id}
                    onClick={() => setTask(id)}
                    className={`h-11 rounded-full border px-5 text-sm font-medium transition-all ${
                      task === id
                        ? "border-accent/70 bg-panel-2 text-hi shadow-md shadow-accent/10"
                        : "border-line text-mid hover:border-line-strong hover:text-hi"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <PipelineFlow key={`${pipeline.id}-${locale}`} pipeline={pipeline} />
              </div>
            </div>
          </m.article>

          <DroneSection />

          <m.div variants={fadeUp} className="mt-24">
            <h3 className="font-display text-xl font-bold sm:text-2xl">{p.moreLabel}</h3>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="glass-panel flex flex-col rounded-2xl p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h4 className="text-lg font-bold">{p.llmJourney.title}</h4>
                  <span className="shrink-0 rounded-full border border-ok/50 bg-ok/10 px-2.5 py-1 font-mono text-[10px] tracking-wider text-ok">
                    IN PROGRESS
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-mid">
                  {p.llmJourney.summary}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-mid">
                  {p.llmJourney.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <span aria-hidden className="mt-[7px] size-1.5 shrink-0 self-start rounded-[2px] bg-accent/70" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <AskAiChip
                    question={
                      locale === "ar"
                    ? "ماذا بنيت في رحلة هندسة النماذج اللغوية حتى الآن؟"
                        : "Walk me through what you've built in the LLM Engineering Journey so far"
                    }
                  />
                </div>
                <div className="mt-auto pt-5">
                  <RepoLink href={LINKS.repos.llmJourney} />
                </div>
              </div>

              <div className="glass-panel flex flex-col rounded-2xl p-6">
                <h4 className="mb-3 text-lg font-bold">{p.mlInternship.title}</h4>
                <p className="text-sm leading-relaxed text-mid">
                  {p.mlInternship.summary}
                </p>
                <div className="mt-4">
                  <AskAiChip
                    question={
                      locale === "ar"
                        ? "اشرح نتائج مشروع تدريب تعلم الآلة: ما النماذج وما دقتها؟"
                        : "Explain the ML internship project: which models were trained and how accurate are they?"
                    }
                  />
                </div>
                <p className="mono-label mb-2 mt-4">{p.mlInternship.metricsTitle}</p>
                <figure className="overflow-hidden rounded-lg border border-line bg-bg-deep/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/projects/ml-chart-1.png"
                    alt={p.mlInternship.mediaCaption}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                  <figcaption className="border-t border-line px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-low">
                    {p.mlInternship.mediaCaption}
                  </figcaption>
                </figure>
                <div className="grid grid-cols-2 gap-2.5">
                  {ML_METRICS.map((metric) => (
                    <div
                      key={metric.value}
                      className="rounded-lg border border-line bg-panel/50 px-3 py-2.5"
                    >
                      <p className="font-mono text-base font-bold text-cyan">
                        {metric.value}
                      </p>
                      <p className="text-[11px] leading-snug text-low">
                        {pick(metric.label, locale)}
                      </p>
                    </div>
                  ))}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-mid">
                  {p.mlInternship.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <span aria-hidden className="mt-[7px] size-1.5 shrink-0 self-start rounded-[2px] bg-violet/70" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-5">
                  <RepoLink href={LINKS.repos.mlInternship} />
                </div>
              </div>
            </div>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
