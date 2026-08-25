"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { pick, useLang } from "@/i18n";
import { HUBS, SKILLS, type HubId, type Skill } from "@/content/data";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import SkillsGraph from "./SkillsGraph";
import EvidencePanel from "./EvidencePanel";
import SectionHeader from "./SectionHeader";

export default function SkillsMap() {
  const { locale, t } = useLang();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const activeIds = new Set<string>();
  if (hovered) {
    if (hovered.startsWith("hub:")) {
      activeIds.add(hovered.slice(4));
      SKILLS.filter((s) => s.hub === hovered.slice(4)).forEach((s) =>
        activeIds.add(s.id),
      );
    } else {
      activeIds.add(hovered);
      const s = SKILLS.find((x) => x.id === hovered);
      if (s) activeIds.add(s.hub);
    }
  }
  if (selectedSkill) {
    activeIds.add(selectedSkill.id);
    activeIds.add(selectedSkill.hub);
  }

  const handleGraphSelect = (id: string | null) => {
    setHovered(id);
    if (id && !id.startsWith("hub:")) {
      setSelectedSkill(SKILLS.find((s) => s.id === id) ?? null);
    }
  };

  return (
    <section id="skills" className="cv-auto relative py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute start-[-200px] top-1/3 size-[480px] rounded-full bg-accent/6 blur-[130px]"
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <m.div
          variants={staggerParent()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <SectionHeader
            index="02"
            label={t.skills.label}
            title={t.skills.heading}
            intro={t.skills.intro}
          />
        </m.div>

        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-10"
        >
          <p className="mb-2 flex items-center gap-2 font-mono text-xs tracking-widest text-low">
            <span className="inline-block size-1.5 animate-pulse-soft rounded-full bg-cyan" />
            {t.skills.hintHover} · {t.skills.hintClick}
          </p>

          <div className="hidden md:block">
            <SkillsGraph activeIds={activeIds} onSelect={handleGraphSelect} />
          </div>

          <div className="space-y-8 md:hidden">
            {HUBS.map((hub) => (
              <div key={hub.id}>
                <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-violet">
                  {pick(hub.label, locale)}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {SKILLS.filter((s) => s.hub === hub.id).map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => setSelectedSkill(s)}
                        className={`rounded-full border px-4 py-2 text-sm transition-all ${
                          selectedSkill?.id === s.id
                            ? "border-accent bg-panel-2 text-hi"
                            : "border-line bg-panel/60 text-mid hover:border-accent/40 hover:text-hi"
                        }`}
                      >
                        {pick(s.label, locale)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <EvidencePanel
            skill={selectedSkill}
            onClose={() => setSelectedSkill(null)}
          />
        </m.div>
      </div>
    </section>
  );
}

export type { HubId };
