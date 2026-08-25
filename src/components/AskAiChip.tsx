"use client";

import { useLang } from "@/i18n";

export default function AskAiChip({ question }: { question: string }) {
  const { t } = useLang();
  return (
    <button
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("aa-chat:ask", { detail: { question } }),
        )
      }
      className="inline-flex items-center gap-2 h-10 rounded-full border border-violet/50 bg-violet/10 px-5 text-sm font-medium text-violet transition-all hover:-translate-y-0.5 hover:border-violet"
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet opacity-70" />
        <span className="relative inline-flex size-2 rounded-full bg-violet" />
      </span>
      {t.chat.askAboutProject}
    </button>
  );
}
