"use client";

import { m } from "framer-motion";
import { useLang } from "@/i18n";
import { kbStats } from "@/lib/retrieval";
import type { Pipeline } from "@/content/data";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import SectionHeader from "./SectionHeader";
import PipelineFlow from "./PipelineFlow";

export default function PortfolioArchitecture() {
  const { t } = useLang();
  const h = t.how;
  const stats = kbStats();

  const pipeline: Pipeline = {
    id: "portfolio-rag",
    nodes: [
      {
        id: "visitor",
        label: { en: "Visitor Question", ar: "سؤال الزائر" },
        detail: {
          en: "You type a question in Arabic or English and pick an answer style: Recruiter, Engineer, or Student.",
          ar: "تكتب سؤالك بالعربية أو الإنجليزية وتختار أسلوب الإجابة: مسؤول توظيف، مهندس، أو طالب.",
        },
      },
      {
        id: "route",
        label: { en: "/api/chat", ar: "/api/chat" },
        detail: {
          en: "A Next.js route handler receives the message history, applies per-IP rate limiting, and orchestrates the pipeline server-side so the API key never reaches the browser.",
          ar: "يتلقى مسار Next.js سجل المحادثة ويطبق تحديد المعدل لكل IP، ويدير خط الأنابيب من جهة الخادم حتى لا يصل مفتاح API للمتصفح أبداً.",
        },
        tech: "Next.js",
      },
      {
        id: "retrieve",
        label: { en: "Retriever", ar: "المسترجِع" },
        detail: {
          en: "The query is tokenized (Unicode-aware, Arabic-normalized), expanded through an Arabic↔English synonym map, vectorized in the same TF-IDF term space as the knowledge base, and ranked by cosine similarity — fully in-memory, no external vector DB.",
          ar: "يُجزَّأ السؤال (بوعي يونيكود وتطبيع عربي)، ويُوسَّع عبر خريطة مرادفات عربي↔إنجليزي، ويُمثَّل في فضاء TF-IDF نفسه المعتمد في قاعدة المعرفة، ثم يُرتّب بتشابه جيب التمام — داخل الذاكرة بالكامل وبدون قاعدة بيانات متجهات خارجية.",
        },
        tech: "TF-IDF · cosine",
      },
      {
        id: "kb",
        label: { en: "Knowledge Base", ar: "قاعدة المعرفة" },
        detail: {
          en: `Built at build-time by scripts/build-kb from markdown documents: ${stats.docCount} docs → ${stats.chunkCount} chunks over a ${stats.vocabSize}-term vocabulary, stored as sparse vectors in kb.json.`,
          ar: `تُبنى وقت البناء بسكربت build-kb من مستندات Markdown: ${stats.docCount} مستندات → ${stats.chunkCount} مقاطع على معجم من ${stats.vocabSize} مصطلحاً، مخزنة كمتجهات متناثرة في kb.json.`,
        },
      },
      {
        id: "llm",
        label: { en: "DeepSeek", ar: "DeepSeek" },
        detail: {
          en: "deepseek-chat receives ONLY the retrieved context plus strict grounding rules: no invention, explicit refusal when information is missing, citations [S1]…[Sk], reply in the user's language.",
          ar: "يستقبل deepseek-chat السياق المسترجَع حصراً مع قواعد تثبيت صارمة: لا اختلاق، ورفض صريح عند غياب المعلومة، واستشهادات [S1]…[Sk]، والإجابة بلغة المستخدم.",
        },
        tech: "deepseek-chat",
      },
      {
        id: "answer",
        label: { en: "Streamed Answer", ar: "إجابة مباشرة" },
        detail: {
          en: "Tokens stream back as NDJSON events; source chips appear under every answer so you can verify each claim against the underlying document.",
          ar: "تعود الرموز مبثقاً كأحداث NDJSON، وتظهر رقائق المصادر تحت كل إجابة لتتحقق من كل معلومة مقابل المستند الأصلي.",
        },
      },
    ],
  };

  return (
    <section id="how" className="cv-auto relative py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute start-[-160px] top-24 size-[460px] rounded-full bg-cyan/6 blur-[130px]"
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader index="04" label={h.label} title={h.heading} intro={h.intro} />

        <m.div
          variants={staggerParent()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <m.div variants={fadeUp} className="mt-12 grid gap-3 sm:grid-cols-3">
            {(
              [
                [stats.chunkCount.toString(), h.statsChunks],
                [stats.vocabSize.toString(), h.statsVocab],
                ["< 5 ms", h.statsLatency],
              ] as const
            ).map(([value, label]) => (
              <div
                key={label}
                className="glass-panel rounded-xl p-5 text-center"
              >
                <p className="bg-gradient-to-r from-accent to-cyan bg-clip-text font-mono text-3xl font-bold text-transparent">
                  {value}
                </p>
                <p className="mt-1.5 font-mono text-[11px] uppercase tracking-widest text-low">
                  {label}
                </p>
              </div>
            ))}
          </m.div>

          <m.div variants={fadeUp} className="mt-8">
            <PipelineFlow key={`how-${t.how.label}`} pipeline={pipeline} />
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
