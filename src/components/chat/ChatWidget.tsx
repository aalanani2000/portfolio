"use client";

import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLang } from "@/i18n";
import { sfx } from "@/lib/sound";

const ChatPanel = lazy(() => import("./ChatPanel"));

export default function ChatWidget() {
  const { t } = useLang();
  const c = t.chat;

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [queued, setQueued] = useState<string | null>(null);

  useEffect(() => {
    const onAsk = (e: Event) => {
      const q = (e as CustomEvent<{ question: string }>).detail?.question;
      if (!q) return;
      setQueued(q);
      setMounted(true);
      setOpen(true);
    };
    window.addEventListener("aa-chat:ask", onAsk);
    return () => window.removeEventListener("aa-chat:ask", onAsk);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <m.button
            key="launcher"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            onClick={() => {
              sfx.open();
              setMounted(true);
              setOpen(true);
            }}
            className="fixed bottom-6 end-6 z-[80] flex items-center gap-2.5 rounded-full border border-accent/40 bg-panel-2/95 py-3 ps-4 pe-5 text-sm font-semibold text-hi shadow-xl shadow-accent/20 backdrop-blur transition-transform hover:-translate-y-0.5"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-ok" />
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
              className="size-4 text-accent"
              aria-hidden
            >
              <path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9L12 3zM19 16l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1z" />
            </svg>
            {c.launcher}
          </m.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && mounted && (
          <m.div
            key="panel-wrap"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Suspense fallback={null}>
              <ChatPanel onClose={close} autoQuestion={queued} />
            </Suspense>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
