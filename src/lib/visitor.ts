"use client";

export type VisitorMode = "hiring" | "engineer" | "curious";

export const VISITOR_KEY = "aa-visitor";
export const VISITOR_EVENT = "aa-visitor:change";

export function getVisitorMode(): VisitorMode | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(VISITOR_KEY);
  return v === "hiring" || v === "engineer" || v === "curious" ? v : null;
}

export function setVisitorMode(mode: VisitorMode | null) {
  if (typeof window === "undefined") return;
  if (mode) {
    window.localStorage.setItem(VISITOR_KEY, mode);
  } else {
    window.localStorage.removeItem(VISITOR_KEY);
  }
  window.dispatchEvent(
    new CustomEvent<VisitorMode | null>(VISITOR_EVENT, { detail: mode }),
  );
}

export const PERSONA_BY_MODE: Record<VisitorMode, "recruiter" | "engineer" | "student"> = {
  hiring: "recruiter",
  engineer: "engineer",
  curious: "student",
};
