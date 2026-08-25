"use client";

import { pick, useLang, useT } from "@/i18n";
import { EXPERIENCE_REFS, type Skill } from "@/content/data";

export function projectTitle(
  id: "alrouf" | "drone" | "llm-journey" | "ml-internship",
  t: ReturnType<typeof useT>,
) {
  if (id === "alrouf") return t.projects.alrouf.title;
  if (id === "drone") return t.projects.drone.title;
  if (id === "llm-journey") return t.projects.llmJourney.title;
  return t.projects.mlInternship.title;
}

export default function EvidencePanel({
  skill,
  onClose,
}: {
  skill: Skill | null;
  onClose: () => void;
}) {
  const { locale, t } = useLang();
  if (!skill) return null;

  return (
    <div className="glass-panel mx-auto mt-8 max-w-3xl rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="mono-label truncate">
          {t.skills.evidenceFor} · {pick(skill.label, locale)}
        </p>
        <button
          onClick={onClose}
          className="shrink-0 rounded-full border border-line px-3 py-1.5 font-mono text-xs text-mid transition-colors hover:border-accent/50 hover:text-accent"
        >
          {t.skills.closeEvidence} ✕
        </button>
      </div>

      <ul className="space-y-4">
        {skill.evidence.map((ev, i) =>
          ev.kind === "project" ? (
            <li key={`${ev.id}-${i}`}>
              <a
                href="#projects"
                className="group flex items-center justify-between rounded-xl border border-line bg-panel/70 px-5 py-4 transition-colors hover:border-accent/50"
              >
                <div>
                  <p className="font-semibold text-hi transition-colors group-hover:text-accent">
                    {projectTitle(ev.id, t)}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-low">
                    {t.skills.usedIn} → PROJECT LAB
                  </p>
                </div>
                <span
                  aria-hidden
                  className="text-accent transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                >
                  →
                </span>
              </a>
            </li>
          ) : (
            (() => {
              const ref = EXPERIENCE_REFS[ev.id];
              return (
                <li
                  key={`${ev.id}-${i}`}
                  className="rounded-xl border border-line bg-panel/70 px-5 py-4"
                >
                  <p className="font-semibold text-hi">{pick(ref.title, locale)}</p>
                  <p className="mt-0.5 font-mono text-xs text-low">
                    {pick(ref.org, locale)} · {pick(ref.period, locale)}
                  </p>
                  <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm leading-relaxed text-mid">
                    {ref.points.map((pt, j) => (
                      <li key={j}>{pick(pt, locale)}</li>
                    ))}
                  </ul>
                </li>
              );
            })()
          ),
        )}
      </ul>
    </div>
  );
}
