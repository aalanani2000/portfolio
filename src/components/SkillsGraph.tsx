"use client";

import { useLang } from "@/i18n";
import { HUBS, SKILLS, type HubId } from "@/content/data";

const W = 980;
const H = 720;
const CX = W / 2;
const CY = H / 2;
const HUB_R = 205;
const LEAF_R = 322;

type Pos = { x: number; y: number };

const { hubs, leaves } = (() => {
  const hubs = new Map<HubId, Pos>();
  const leaves = new Map<string, Pos>();

  HUBS.forEach((hub, hi) => {
    const a = ((-90 + hi * 72) * Math.PI) / 180;
    hubs.set(hub.id, {
      x: CX + Math.cos(a) * HUB_R,
      y: CY + Math.sin(a) * HUB_R,
    });

    const sector = SKILLS.filter((s) => s.hub === hub.id);
    const halfFan = Math.min(32, sector.length * 5.5);
    sector.forEach((s, si) => {
      const t = sector.length === 1 ? 0 : (si / (sector.length - 1)) * 2 - 1;
      const la = a + (t * halfFan * Math.PI) / 180;
      leaves.set(s.id, {
        x: CX + Math.cos(la) * LEAF_R,
        y: CY + Math.sin(la) * LEAF_R,
      });
    });
  });

  return { hubs, leaves };
})();

function labelAnchor(p: Pos): {
  anchor: "start" | "end" | "middle";
  dx: number;
  dy: number;
} {
  const dx = p.x - CX;
  const dy = p.y - CY;
  if (Math.abs(dx) > Math.abs(dy) * 1.2) {
    return dx > 0
      ? { anchor: "start", dx: 30, dy: 4 }
      : { anchor: "end", dx: -30, dy: 4 };
  }
  return dy > 0
    ? { anchor: "middle", dx: 0, dy: 38 }
    : { anchor: "middle", dx: 0, dy: -30 };
}

export default function SkillsGraph({
  activeIds,
  onSelect,
}: {
  activeIds: Set<string>;
  onSelect: (id: string | null) => void;
}) {
  const { locale } = useLang();

  const isActive = (id: string) => activeIds.has(id);

  return (
    <svg
      viewBox={`0 -40 ${W} ${H + 40}`}
      className="mx-auto w-full max-w-4xl"
      role="group"
      aria-label="Engineering intelligence map"
    >
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CX} cy={CY} r={120} fill="url(#coreGlow)" opacity={0.35} />

      {[90, 150, 210].map((r) => (
        <circle
          key={r}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke="rgba(125,180,255,0.07)"
          strokeDasharray="3 7"
        />
      ))}

      {SKILLS.map((s) => {
        const lp = leaves.get(s.id)!;
        const hp = hubs.get(s.hub)!;
        const active = isActive(s.id);
        return (
          <line
            key={`e-${s.id}`}
            x1={hp.x}
            y1={hp.y}
            x2={lp.x}
            y2={lp.y}
            stroke={active ? "#3b82f6" : "rgba(125,180,255,0.16)"}
            strokeWidth={active ? 1.6 : 1}
            className="transition-all duration-300"
          />
        );
      })}

      {HUBS.map((h) => {
        const hp = hubs.get(h.id)!;
        return (
          <line
            key={`c-${h.id}`}
            x1={CX}
            y1={CY}
            x2={hp.x}
            y2={hp.y}
            stroke={
              isActive(h.id)
                ? "rgba(56,189,248,0.65)"
                : "rgba(125,180,255,0.18)"
            }
            strokeWidth={isActive(h.id) ? 1.8 : 1.1}
            className="transition-all duration-300"
          />
        );
      })}

      {HUBS.map((h) => {
        const p = hubs.get(h.id)!;
        const active = isActive(h.id);
        return (
          <g
            key={`hub-${h.id}`}
            onMouseEnter={() => onSelect(`hub:${h.id}`)}
            onMouseLeave={() => onSelect(null)}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={34}
              fill="#181d24"
              stroke={active ? "#3b82f6" : "rgba(167,139,250,0.45)"}
              strokeWidth={active ? 2 : 1.3}
              className="transition-all duration-300"
            />
            <text
              x={p.x}
              y={p.y + 52}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              fill={active ? "#eaf2fc" : "#9fb3c8"}
              className="transition-colors duration-300 select-none"
            >
              {h.label[locale]}
            </text>
          </g>
        );
      })}

      {SKILLS.map((s) => {
        const p = leaves.get(s.id)!;
        const active = isActive(s.id);
        const la = labelAnchor(p);
        return (
          <g
            key={`leaf-${s.id}`}
            role="button"
            tabIndex={0}
            aria-label={s.label[locale]}
            aria-pressed={active}
            className="cursor-pointer outline-none focus-visible:[&>circle]:stroke-accent"
            onClick={() => onSelect(s.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(s.id);
              }
            }}
            onMouseEnter={() => onSelect(s.id)}
            onFocus={() => onSelect(s.id)}
            onMouseLeave={() => onSelect(null)}
            onBlur={() => onSelect(null)}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={20}
              fill={active ? "#1b2531" : "#12161c"}
              stroke={active ? "#3b82f6" : "rgba(125,180,255,0.28)"}
              strokeWidth={active ? 2 : 1.2}
              style={{ transition: "all .3s" }}
            />
            <circle cx={p.x} cy={p.y} r={5} fill={active ? "#3b82f6" : "#3d5872"} style={{ transition: "fill .3s" }} />
            <text
              x={p.x + la.dx}
              y={p.y + la.dy}
              textAnchor={la.anchor}
              fontSize={13}
              fill={active ? "#eaf2fc" : "#9fb3c8"}
              className="transition-colors duration-300 select-none"
              style={{ direction: locale === "ar" ? "rtl" : "ltr" }}
            >
              {s.label[locale]}
            </text>
          </g>
        );
      })}

      <g>
        <circle
          cx={CX}
          cy={CY}
          r={46}
          fill="#181d24"
          stroke="#3b82f6"
          strokeWidth={1.6}
        />
        <text
          x={CX}
          y={CY - 2}
          textAnchor="middle"
          fontSize={17}
          fontWeight={700}
          fontFamily="var(--font-mono)"
          fill="#3b82f6"
          className="select-none"
        >
          AA
        </text>
        <text
          x={CX}
          y={CY + 18}
          textAnchor="middle"
          fontSize={10.5}
          fill="#9fb3c8"
          className="select-none"
          style={{ letterSpacing: "0.08em" }}
        >
          AI ENGINEER
        </text>
      </g>
    </svg>
  );
}
