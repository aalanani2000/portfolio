"use client";

import { pick, useLang } from "@/i18n";
import type { L } from "@/i18n";

const ITEMS: L[] = [
  { en: "Python", ar: "Python" },
  { en: "YOLOv8", ar: "YOLOv8" },
  { en: "FastAPI", ar: "FastAPI" },
  { en: "OpenAI APIs", ar: "واجهات OpenAI" },
  { en: "RAG", ar: "RAG" },
  { en: "n8n", ar: "n8n" },
  { en: "Docker", ar: "Docker" },
  { en: "Ollama", ar: "Ollama" },
  { en: "Computer Vision", ar: "الرؤية الحاسوبية" },
  { en: "Raspberry Pi", ar: "Raspberry Pi" },
  { en: "SQLite", ar: "SQLite" },
  { en: "Prompt Engineering", ar: "هندسة الموجّهات" },
];

export default function Marquee() {
  const { locale } = useLang();
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      aria-hidden
      className="marquee-mask relative overflow-hidden border-y border-line bg-panel/30 py-5"
    >
      <div className="marquee-track flex items-center gap-12 pe-12">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-12 whitespace-nowrap font-mono text-sm uppercase tracking-[0.25em] text-low"
          >
            {pick(item, locale)}
            <span className="text-accent/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
