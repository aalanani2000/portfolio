"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Persona = "recruiter" | "engineer" | "student";
export type Source = { key: string; title: string };
export type Msg = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

const HISTORY_KEY = "aa-chat-history";
const MAX_SAVED = 40;

function loadHistory(): Msg[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Msg[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0,
      )
      .slice(-MAX_SAVED);
  } catch {
    return [];
  }
}

function saveHistory(messages: Msg[]) {
  try {
    const trimmed = messages
      .filter((m) => m.role === "user" || (m.role === "assistant" && m.content.trim()))
      .slice(-MAX_SAVED);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    /* storage full/unavailable */
  }
}

export function clearChatHistory() {
  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("aa-chat:cleared"));
}

export function useChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<
    "errorNoKey" | "errorNoCredits" | "errorGeneric" | null
  >(null);
  const [restored, setRestored] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const personaRef = useRef<Persona>("recruiter");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setMessages(loadHistory());
      setRestored(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!restored) return;
    saveHistory(messages);
  }, [messages, restored]);

  useEffect(() => {
    const onCleared = () => setMessages([]);
    window.addEventListener("aa-chat:cleared", onCleared);
    return () => window.removeEventListener("aa-chat:cleared", onCleared);
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, []);

  const send = useCallback(
    async (question: string, opts?: { persona?: Persona }) => {
      const trimmed = question.trim();
      if (!trimmed || abortRef.current) return;
      if (opts?.persona) personaRef.current = opts.persona;

      setError(null);
      setInput("");
      const history: Msg[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages([...history, { role: "assistant", content: "" }]);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map(({ role, content }) => ({ role, content })),
            persona: personaRef.current,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          let code: "errorNoKey" | "errorGeneric" = "errorGeneric";
          try {
            const j = await res.json();
            if (j.error === "no_key") code = "errorNoKey";
          } catch {
            /* non-json error */
          }
          setError(code);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const evt = JSON.parse(line) as
                | { t: "s"; v: Source[] }
                | { t: "a"; v: string }
                | { t: "e"; v: string }
                | { t: "d" };

              if (evt.t === "s") {
                setMessages((prev) => {
                  const next = [...prev];
                  const last = next.length - 1;
                  if (last >= 0 && next[last].role === "assistant")
                    next[last] = { ...next[last], sources: evt.v };
                  return next;
                });
              } else if (evt.t === "a") {
                setMessages((prev) => {
                  const next = [...prev];
                  const last = next.length - 1;
                  if (last >= 0 && next[last].role === "assistant")
                    next[last] = {
                      ...next[last],
                      content: next[last].content + evt.v,
                    };
                  return next;
                });
              } else if (evt.t === "e") {
                setError(
                  evt.v === "no_credits" ? "errorNoCredits" : "errorGeneric",
                );
              }
            } catch {
              /* ignore malformed line */
            }
          }
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError("errorGeneric");
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages],
  );

  useEffect(() => () => abortRef.current?.abort(), []);

  return { messages, input, setInput, streaming, error, send, stop };
}
