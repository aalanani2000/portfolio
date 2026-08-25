"use client";

import { m } from "framer-motion";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";

export default function SectionHeader({
  index,
  label,
  title,
  intro,
}: {
  index: string;
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <m.div
      variants={staggerParent()}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="relative"
    >
      <span
        aria-hidden
        className="ghost-index pointer-events-none absolute -top-10 start-0 sm:-top-16"
      >
        {index}
      </span>
      <m.p variants={fadeUp} className="mono-label relative mb-3">
        {label}
      </m.p>
      <m.h2
        variants={fadeUp}
        className="relative max-w-3xl text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-tight"
      >
        {title}
      </m.h2>
      {intro && (
        <m.p
          variants={fadeUp}
          className="relative mt-5 max-w-2xl text-lg leading-relaxed text-mid"
        >
          {intro}
        </m.p>
      )}
      <m.div
        variants={fadeUp}
        className="mt-8 h-px w-full bg-gradient-to-r from-line-strong via-line to-transparent"
      />
    </m.div>
  );
}
