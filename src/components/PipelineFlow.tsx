"use client";

import { Fragment, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import { pick, useLang } from "@/i18n";
import type { Pipeline } from "@/content/data";

export default function PipelineFlow({ pipeline }: { pipeline: Pipeline }) {
  const { locale, t } = useLang();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const live = useInView(rootRef, { margin: "200px 0px" });

  const selected =
    pipeline.nodes.find((n) => n.id === selectedId) ?? pipeline.nodes[0];

  return (
    <div ref={rootRef} data-live={live}>
      <div className="flex flex-col items-stretch gap-1 lg:flex-row lg:items-start">
        {pipeline.nodes.map((node, i) => {
          const active = selected.id === node.id;
          return (
            <Fragment key={node.id}>
              <button
                onClick={() => setSelectedId(node.id)}
                aria-pressed={active}
                className={`group relative flex h-full min-h-[96px] flex-1 basis-0 flex-col justify-between rounded-2xl border p-4 text-start transition-all duration-300 ${
                  active
                    ? "border-accent/70 bg-panel-2 shadow-lg shadow-accent/10"
                    : "border-line bg-panel/60 hover:border-line-strong"
                }`}
              >
                <span className="mb-2 flex items-center justify-between">
                  <span
                    className={`font-mono text-[10px] tracking-widest transition-colors ${
                      active ? "text-accent" : "text-low"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {node.tech && (
                    <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-mid">
                      {node.tech}
                    </span>
                  )}
                </span>
                <span
                  className={`block text-sm font-semibold leading-snug transition-colors ${
                    active ? "text-hi" : "text-mid group-hover:text-hi"
                  }`}
                >
                  {pick(node.label, locale)}
                </span>
              </button>

              {i < pipeline.nodes.length - 1 && (
                <>
                  <div
                    aria-hidden
                    className="flow-track mx-auto h-6 w-px shrink-0 lg:mx-0 lg:mt-[42px] lg:h-px lg:w-7"
                  />
                </>
              )}
            </Fragment>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={selected.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28 }}
          className="glass-panel mt-5 rounded-xl border-s-2 border-s-accent p-5"
        >
          <p className="mono-label mb-1">{pick(selected.label, locale)}</p>
          <p className="text-sm leading-relaxed text-mid">
            {pick(selected.detail, locale)}
          </p>
        </m.div>
      </AnimatePresence>

      <p className="mt-3 font-mono text-[11px] tracking-wider text-low">
        ◦ {t.projects.pipelineHint}
      </p>
    </div>
  );
}
