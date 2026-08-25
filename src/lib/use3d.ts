"use client";

import { useEffect, useState } from "react";

export function use3DCapability() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          return;
        }
        const canvas = document.createElement("canvas");
        const webgl = !!(
          canvas.getContext("webgl2") || canvas.getContext("webgl")
        );
        if (!webgl) return;

        const cores = navigator.hardwareConcurrency ?? 4;
        const memory = (navigator as Navigator & { deviceMemory?: number })
          .deviceMemory;
        if (cores < 4 || (memory !== undefined && memory < 4)) return;

        setOk(true);
      } catch {
        setOk(false);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return ok;
}
