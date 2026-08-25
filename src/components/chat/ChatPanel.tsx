"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n";
import { useChat, type Persona } from "@/lib/useChat";
import { clearChatHistory } from "@/lib/useChat";
import { PERSONA_BY_MODE, getVisitorMode } from "@/lib/visitor";

const PERSONAS: Persona[] = ["recruiter", "engineer", "student"];

export default function ChatPanel({
  onClose,
  autoQuestion,
}: {
  onClose: () => void;
  autoQuestion?: string | null;
}) {
  const { t, locale } = useLang();
  const c = t.chat;
  const { messages, input, setInput, streaming, error, send, stop } = useChat();
  const [persona, setPersona] = useState<Persona>(() => {
    const m = getVisitorMode();
    return m ? PERSONA_BY_MODE[m] : "recruiter";
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, streaming]);

  useEffect(() => {
    if (autoQuestion) void send(autoQuestion, { persona });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
    if (!input.trim() || streaming) return;
    void send(input, { persona });
  };

  const empty = messages.length === 0;

  return (
    <div
      className="glass-panel backdrop-blur-xl fixed bottom-4 end-4 z-[80] flex h-[min(600px,calc(100dvh-2rem))] w-[min(430px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl"
      role="dialog"
      aria-modal="false"
      aria-label={c.title}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !streaming) onClose();
      }}
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg border border-accent/40 bg-bg-deep font-mono text-xs font-bold text-accent">
            AI
          </span>
          <div>
            <p className="text-sm font-bold leading-tight">{c.title}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-low">
              {c.subtitle}
            </p>
          </div>
        </div>
              <button
                onClick={() => clearChatHistory()}
                disabled={streaming || messages.length === 0}
                aria-label={c.clear}
                title={c.clear}
                className="rounded-md p-2 text-low transition-colors hover:bg-panel hover:text-hi disabled:opacity-30"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="size-4" aria-hidden>
                  <path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" />
                </svg>
              </button>
              <button
                onClick={onClose}
                aria-label="Close chat"
                className="rounded-md p-2 text-mid transition-colors hover:bg-panel hover:text-hi"
              >
                ✕
              </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-b border-line px-3 py-2">
        <span className="me-1 font-mono text-[10px] uppercase tracking-wider text-low">
          {c.personaLabel}
        </span>
        {PERSONAS.map((p) => (
          <button
            key={p}
            onClick={() => setPersona(p)}
            aria-pressed={persona === p}
            className={`rounded-full border px-2.5 py-1 text-xs transition-all ${
              persona === p
                ? "border-accent/70 bg-accent/15 text-hi"
                : "border-line text-mid hover:border-line-strong hover:text-hi"
            }`}
          >
            {c.personas[p]}
          </button>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4" dir="auto">
        {empty && (
          <div className="space-y-3 pt-2">
            <p className="text-sm leading-relaxed text-mid">{c.disclaimer}</p>
            <div className="space-y-2 pt-1">
              {c.suggested.map((q) => (
                <button
                  key={q}
                  onClick={() => void send(q, { persona })}
                  disabled={streaming}
                  className="block w-full rounded-full border border-line bg-panel/60 px-4 py-2.5 text-start text-sm text-mid transition-all hover:border-accent/50 hover:text-hi disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] rounded-xl rounded-ee-sm bg-accent/15 px-3.5 py-2.5 text-sm leading-relaxed text-hi">
                {m.content}
              </p>
            </div>
          ) : (
            <div key={i}>
              {m.content ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-hi">
                  {m.content}
                  {streaming && i === messages.length - 1 && (
                    <span className="ms-1 inline-block h-3.5 w-1.5 animate-pulse bg-accent align-middle" />
                  )}
                </p>
              ) : streaming && i === messages.length - 1 ? (
                <p className="flex items-center gap-2 font-mono text-xs text-low">
                  <span className="size-1.5 animate-pulse rounded-full bg-cyan" />
                  {c.thinking}
                </p>
              ) : null}

              {m.sources && m.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.sources.map((s) => (
                    <span
                      key={s.key}
                      title={s.title}
                      className="rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 font-mono text-[10px] text-violet"
                    >
                      [{s.key}] {s.title.slice(0, 34)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ),
        )}

        {error && (
          <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {c[error]}
          </p>
        )}
      </div>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={c.placeholder}
            aria-label={c.placeholder}
            dir="auto"
            className="min-w-0 flex-1 rounded-full border border-line bg-bg-deep/70 px-4 py-2.5 text-sm text-hi placeholder:text-low focus:border-accent/60 focus:outline-none"
          />
          {streaming ? (
            <button
              onClick={stop}
              aria-label={c.stop}
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-red-400/40 text-red-300 transition-colors hover:bg-red-500/10"
            >
              ■ 
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!input.trim()}
              aria-label={c.send}
              className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-bg-deep transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 rtl:-scale-x-100" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-2 truncate font-mono text-[10px] tracking-wide text-low">
          {locale === "ar" ? "AR / EN · مدعوم بـ DeepSeek + RAG محلي" : "AR / EN · powered by DeepSeek + local RAG"}
        </p>
      </div>
    </div>
  );
}
