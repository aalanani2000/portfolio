"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, m, useInView } from "framer-motion";
import { pick, useLang } from "@/i18n";
import {
  DRONE_HARDWARE,
  DRONE_METRICS,
  DRONE_PIPELINE,
  DRONE_SOFTWARE,
} from "@/content/data";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import PipelineFlow from "./PipelineFlow";
import AskAiChip from "./AskAiChip";
import { use3DCapability } from "@/lib/use3d";

const DroneScene = dynamic(() => import("./drone/DroneScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full min-h-[380px] place-items-center">
      <p className="animate-pulse font-mono text-xs tracking-[0.25em] text-low">
        LOADING 3D…
      </p>
    </div>
  ),
});

type PartKey = "vision" | "pi" | "fc" | "motors" | "cam" | "payload";

const PART_POS: Record<PartKey, { x: number; y: number }> = {
  cam: { x: 150, y: 60 },
  vision: { x: 150, y: 150 },
  pi: { x: 150, y: 240 },
  fc: { x: 150, y: 320 },
  motors: { x: 268, y: 62 },
  payload: { x: 242, y: 205 },
};

const PART_DETAIL: Record<PartKey, { en: string; ar: string }> = {
  cam: {
    en: "Raspberry Pi camera module capturing live imagery during autonomous patrol flights.",
    ar: "وحدة كاميرا Raspberry Pi تلتقط صوراً حية أثناء جولات المراقبة الذاتية.",
  },
  vision: {
    en: "Custom-trained YOLOv8 model detecting fire in real time (mAP@50 ≈ 0.824 · Precision ≈ 0.83), trained through data collection, processing and model training on ~754 validation images.",
        ar: "نموذج YOLOv8 مدرَّب خصيصاً يكشف الحرائق في الزمن الحقيقي (mAP@50 ≈ 0.824 · دقة ≈ 0.83)، عبر جمع البيانات ومعالجتها وتدريب النموذج على ~754 صورة تحقق.",
  },
  pi: {
    en: "Raspberry Pi 3 — the drone's primary brain: runs YOLOv8 inference, bridges the PS4 controller to the flight controller over serial, and coordinates mission logic.",
        ar: "Raspberry Pi 3 — العقل المدبر للطائرة: يشغّل استدلال YOLOv8، ويربط يد PS4 بوحدة الطيران عبر المنفذ التسلسلي، وينسّق منطق المهمة.",
  },
  fc: {
    en: "APM 2.8 running ArduCopter: stabilized flight, position hold and waypoint missions; calibrated (motors/ESC/compass) via Mission Planner.",
        ar: "وحدة APM 2.8 تعمل بنظام ArduCopter: طيران مستقر، وتثبيت الموقع، ومهام بنقاط مسار؛ معايرة كاملة (محركات/ESC/بوصلة) عبر Mission Planner.",
  },
  motors: {
    en: "Four 2200kV brushless motors with PWM speed controllers on an aluminum frame, powered by a LiPo pack through power distribution and a voltage regulator.",
        ar: "أربعة محركات Brushless بقوة 2200kV مع متحكمات سرعة PWM على هيكل ألمنيوم، تغذى ببطارية LiPo عبر منظومة توزيع قدرة ومنظم جهد.",
  },
  payload: {
    en: "Designed suppression payload: an AFO fire-extinguishing ball that auto-activates 3–5 seconds after flame contact, dispersing non-toxic ABC dry powder over ~4 m². Documented in the project report; the ball itself was restricted to institutional buyers.",
        ar: "حمولة إطفاء مصممة: كرة AFO لإطفاء الحرائق تنشط تلقائياً بعد 3–5 ثوانٍ من ملامسة اللهب، وتتناثر مسحوق ABC غير السام فوق ~4 م². موثقة في تقرير المشروع؛ لم تتوفر الكرة للشراء لقصر بيعها على المؤسسات.",
  },
};

const PART_KEYS = Object.keys(PART_POS) as PartKey[];

function Hotspot({
  k,
  active,
  onSelect,
  label,
}: {
  k: PartKey;
  active: boolean;
  onSelect: (k: PartKey) => void;
  label: string;
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      className="cursor-pointer outline-none"
      onClick={() => onSelect(k)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(k);
        }
      }}
      onMouseEnter={() => onSelect(k)}
    >
      <circle
        cx={PART_POS[k].x}
        cy={PART_POS[k].y}
        r={11}
        fill={active ? "#3b82f6" : "#12161c"}
        stroke="#3b82f6"
        strokeWidth={1.6}
        className="transition-all duration-300"
      />
      <circle cx={PART_POS[k].x} cy={PART_POS[k].y} r={3.5} fill={active ? "#0b0d10" : "#3b82f6"} />
      {active && (
        <circle
          cx={PART_POS[k].x}
          cy={PART_POS[k].y}
          r={16}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={1}
          opacity={0.6}
          className="animate-ping"
        />
      )}
    </g>
  );
}

function DroneSchematic({
  active,
  onSelect,
}: {
  active: PartKey;
  onSelect: (k: PartKey) => void;
}) {
  const { t } = useLang();

  return (
    <svg
      viewBox="0 0 320 400"
      className="mx-auto w-full max-w-[300px]"
      role="img"
      aria-label="Drone subsystem schematic"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1b2531" />
          <stop offset="100%" stopColor="#12161c" />
        </linearGradient>
      </defs>

      {[70, 250].map((cx) =>
        [55, 345].map((cy) => (
          <g key={`${cx}-${cy}`} className="animate-spin-slow" style={{ transformOrigin: `${cx}px ${cy}px` }}>
            <circle cx={cx} cy={cy} r={34} fill="none" stroke="rgba(148,163,184,0.22)" strokeWidth={1.4} />
            <circle cx={cx} cy={cy} r={26} fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth={1} />
          </g>
        )),
      )}

      {[
        [95, 80, 128, 128],
        [225, 80, 192, 128],
        [95, 320, 128, 272],
        [225, 320, 192, 272],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(148,163,184,0.3)" strokeWidth={5} strokeLinecap="round" />
      ))}

      <rect x={100} y={110} width={120} height={190} rx={18} fill="url(#bodyGrad)" stroke="rgba(59,130,246,0.4)" strokeWidth={1.4} />
      <rect x={116} y={130} width={88} height={54} rx={8} fill="#0b0d10" stroke="rgba(59,130,246,0.35)" strokeWidth={1} />

      <polygon points="160,100 147,82 173,82" fill="none" stroke="rgba(59,130,246,0.55)" strokeWidth={1.6} />
      <line x1={160} y1={82} x2={160} y2={68} stroke="rgba(59,130,246,0.55)" strokeWidth={1.6} />

      <Hotspot k="cam" active={active === "cam"} onSelect={onSelect} label={t.projects.drone.components.cam} />
      <Hotspot k="vision" active={active === "vision"} onSelect={onSelect} label={t.projects.drone.components.vision} />
      <Hotspot k="pi" active={active === "pi"} onSelect={onSelect} label={t.projects.drone.components.pi} />
      <Hotspot k="fc" active={active === "fc"} onSelect={onSelect} label={t.projects.drone.components.fc} />
      <Hotspot k="motors" active={active === "motors"} onSelect={onSelect} label={t.projects.drone.components.motors} />
      <Hotspot k="payload" active={active === "payload"} onSelect={onSelect} label={t.projects.drone.components.payload} />

      <text x={160} y={382} textAnchor="middle" fontSize={10} fill="#6e7885" style={{ letterSpacing: "0.3em", fontFamily: "var(--font-mono)" }}>
        FIRE-SCAN v1
      </text>
    </svg>
  );
}

export default function DroneSection() {
  const { locale, t } = useLang();
  const [part, setPart] = useState<PartKey>("vision");
  const d = t.projects.drone;

  const can3D = use3DCapability();
  const [mode, setMode] = useState<"schematic" | "3d">("schematic");
  const [exploded, setExploded] = useState(false);
  const [fire, setFire] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const inView = useInView(viewportRef, { margin: "300px 0px" });

  const metricValues: Record<string, string> = {
    map50: DRONE_METRICS[0].value,
    precision: DRONE_METRICS[1].value,
    images: DRONE_METRICS[2].value,
    grade: DRONE_METRICS[3].value,
  };

  return (
    <m.article
      variants={staggerParent()}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="mt-24 scroll-mt-24"
      id="project-drone"
    >
      <m.p variants={fadeUp} className="mono-label mb-3">
        FLAGSHIP // 02
      </m.p>
      <m.h3 variants={fadeUp} className="font-display text-2xl font-bold sm:text-3xl">
        {d.title}
        <span className="ms-3 inline-block rounded-md border border-violet/50 bg-violet/10 px-2.5 py-1 align-middle text-xs font-semibold text-violet">
          {d.subtitle}
        </span>
      </m.h3>
      <div className="mt-3">
        <AskAiChip
          question={
            locale === "ar"
              ? "حدثني عن مشروع الدرون: كيف يكشف الحرائق وما الذي صممته لإطفائها؟"
              : "Tell me about the drone project: how does it detect fire, and what was designed for extinguishing it?"
          }
        />
      </div>
      <m.p variants={fadeUp} className="mt-4 max-w-3xl leading-relaxed text-mid">
        {d.summary}
      </m.p>

      <m.div
        variants={fadeUp}
        className="glass-panel mt-8 overflow-hidden rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-line bg-bg-deep/60 px-5 py-3">
          <p className="font-mono text-xs tracking-[0.3em] text-accent">
            ◉ {d.missionControl}
          </p>
          <div className="flex items-center gap-3">
            {can3D && (
              <div className="flex rounded-md border border-line p-0.5" role="tablist" aria-label={d.viewLabel}>
                {(
                  [
                    ["schematic", d.modeSchematic],
                    ["3d", d.mode3d],
                  ] as const
                ).map(([m2, label]) => (
                  <button
                    key={m2}
                    role="tab"
                    aria-selected={mode === m2}
                    onClick={() => setMode(m2)}
                    className={`rounded px-2.5 py-1 font-mono text-[10px] tracking-widest transition-colors ${
                      mode === m2
                        ? "bg-accent/15 text-accent"
                        : "text-low hover:text-mid"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            <p className="hidden items-center gap-2 font-mono text-[11px] text-ok sm:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-ok" />
              LIVE TELEMETRY
            </p>
          </div>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-[340px_1fr] lg:p-8">
          <div className="relative" ref={viewportRef}>
            {mode === "3d" && can3D ? (
              <div className="relative h-[440px] overflow-hidden rounded-xl border border-line bg-bg-deep/50">
                {inView && (
                  <DroneScene
                    exploded={exploded}
                    fire={fire}
                    activePart={part}
                    onSelect={setPart}
                  />
                )}
                <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center p-2">
                  <span
                    className={`rounded-full border px-3 py-1 font-mono text-[10px] tracking-widest ${
                      fire
                        ? "animate-pulse border-ember/70 bg-ember/10 text-ember"
                        : "border-line bg-panel/80 text-low"
                    }`}
                  >
                    {fire ? `▲ ${d.hudDetected}` : d.hudScanning}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-2 p-3">
                  <button
                    onClick={() => setExploded((v) => !v)}
                    aria-pressed={exploded}
                    className={`h-9 rounded-full border px-4 font-mono text-[10px] tracking-widest transition-all ${
                      exploded
                        ? "border-accent/70 bg-accent/15 text-hi"
                        : "border-line bg-panel/80 text-mid hover:text-hi"
                    }`}
                  >
                    {exploded ? d.assemble : d.exploded}
                  </button>
                  <button
                    onClick={() => setFire((v) => !v)}
                    aria-pressed={fire}
                    className={`h-9 rounded-full border px-4 font-mono text-[10px] tracking-widest transition-all ${
                      fire
                        ? "border-ember/70 bg-ember/15 text-hi"
                        : "border-line bg-panel/80 text-mid hover:text-hi"
                    }`}
                  >
                    {fire ? d.fireReset : d.fireTest}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`mission-svg relative rounded-xl border border-line bg-bg-deep/50 p-4 ${
                  inView ? "svg-live" : ""
                }`}
              >
                <DroneSchematic active={part} onSelect={setPart} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div
              role="tablist"
              aria-label={d.layersTitle}
              className="grid grid-cols-2 gap-1.5 rounded-[28px] border border-line bg-bg-deep/60 p-1.5 sm:flex sm:rounded-full"
            >
              {PART_KEYS.map((k, i) => {
                const isActive = part === k;
                return (
                  <button
                    key={k}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setPart(k)}
                    className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-2 py-2 transition-all duration-300 sm:rounded-none sm:py-2.5 sm:not-first:border-s sm:not-first:border-line/70 ${
                      i === 0 ? "sm:rounded-s-full" : ""
                    } ${
                      i === PART_KEYS.length - 1 ? "sm:rounded-e-full" : ""
                    } ${
                      isActive
                        ? "bg-accent/15 text-hi shadow-[inset_0_0_18px_rgba(59,130,246,0.18)]"
                        : "text-mid hover:bg-panel-2 hover:text-hi"
                    }`}
                  >
                    <span
                      className={`font-mono text-[9px] tracking-widest transition-colors ${
                        isActive ? "text-accent" : "text-low"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="w-full truncate px-1 text-center text-[11px] font-medium sm:text-xs">
                      {d.components[k]}
                    </span>
                    <span
                      aria-hidden
                      className={`absolute bottom-1 h-px transition-all duration-300 ${
                        isActive
                          ? "inset-x-6 bg-gradient-to-r from-transparent via-accent to-transparent"
                          : "inset-x-1/2 w-4 bg-line-strong"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <m.div
                key={part + locale}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl border-s-2 border-s-cyan bg-panel/70 p-4"
              >
                <p className="mono-label mb-1">{d.components[part]}</p>
                <p className="text-sm leading-relaxed text-mid">
                  {pick(PART_DETAIL[part], locale)}
                </p>
              </m.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(
                [
                  ["map50", d.metricMap50],
                  ["precision", d.metricPrecision],
                  ["images", d.metricImages],
                  ["grade", d.metricGrade],
                ] as const
              ).map(([key, label]) => (
                <div
                  key={key}
                  className="rounded-xl border border-line bg-panel/60 p-3.5 text-center"
                >
                  <p className="bg-gradient-to-r from-accent to-cyan bg-clip-text text-xl font-bold text-transparent">
                    {metricValues[key]}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-low">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <p className="rounded-lg border border-line bg-panel/40 px-4 py-3 font-mono text-[11px] leading-relaxed text-low">
              {d.suppressionNote}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-panel/40 p-4">
                <h4 className="mono-label mb-3">{d.hardwareTitle}</h4>
                <ul className="space-y-2 text-sm text-mid">
                  {DRONE_HARDWARE.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-[2px] bg-accent/60" />
                      <span>{pick(h, locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-line bg-panel/40 p-4">
                <h4 className="mono-label mb-3">{d.softwareTitle}</h4>
                <ul className="space-y-2 text-sm text-mid">
                  {DRONE_SOFTWARE.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-[2px] bg-accent/60" />
                      <span>{pick(s, locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-line bg-bg-deep/40 p-6 lg:p-8">
          <h4 className="mono-label mb-4">{d.pipelineTitle}</h4>
          <PipelineFlow pipeline={DRONE_PIPELINE} />
        </div>
      </m.div>
    </m.article>
  );
}
