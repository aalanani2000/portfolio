"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { en, type Dict } from "./en";
import { ar } from "./ar";

export type Locale = "en" | "ar";
export type L = { en: string; ar: string };

const dicts: Record<Locale, Dict> = { en, ar };

type LangContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dict;
  setLocale: (l: Locale) => void;
  toggle: () => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export const pick = (value: L, locale: Locale) => value[locale];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const restoredRef = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem("aa-locale");
        if (stored === "ar" || stored === "en") {
          setLocaleState(stored);
        }
      } catch {
        /* ignore */
      }
      restoredRef.current = true;
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!restoredRef.current) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    try {
      window.localStorage.setItem("aa-locale", locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggle = useCallback(
    () => setLocaleState((prev) => (prev === "en" ? "ar" : "en")),
    [],
  );

  return (
    <LangContext.Provider
      value={{
        locale,
        dir: locale === "ar" ? "rtl" : "ltr",
        t: dicts[locale],
        setLocale,
        toggle,
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

export function useT() {
  return useLang().t;
}
