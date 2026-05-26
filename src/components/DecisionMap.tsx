import { useMemo, useState } from "react";
import type { DecisionData, SelectedItem } from "../lib/decision-store";

export type MapItemType = "value" | "motivation" | "fear" | "affected" | "next";

export interface MapItem {
  id: string;
  type: MapItemType;
  label: string;
  note: string;
  summary: string;
  why: string;
  importance: number;
  // Optional richer fields for the next-step item
  nextRationale?: string;
  nextExamples?: string[];
}


interface Props {
  centerText: string;
  items: MapItem[];
  nextStepTitle?: string;
  nextStepText?: string;
  nextRationale?: string;
  nextExamples?: string[];
  onSelect?: (it: MapItem) => void;
}

const W = 1520;
const H = 940;
const CX = 760;
const CY = 470;

export function DecisionMap({
  centerText,
  items,
  nextStepTitle,
  nextStepText,
  nextRationale,
  nextExamples,
  onSelect,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [opened, setOpened] = useState<MapItem | null>(null);

  const byType = useMemo(() => {
    const g: Record<MapItemType, MapItem[]> = { value: [], motivation: [], fear: [], affected: [], next: [] };
    for (const it of items) g[it.type].push(it);
    for (const k of Object.keys(g) as MapItemType[]) g[k].sort((a, b) => b.importance - a.importance);
    return g;
  }, [items]);

  // Main influence bubbles: top 2 values + top 1 affected, placed around the center.
  // Larger radii, pushed further from center; most important bubble is the largest.
  const mains = useMemo(() => {
  const arr = [...byType.value.slice(0, 2), ...byType.affected.slice(0, 1)];

  const positions = [
    { x: CX - 520, y: CY - 250, r: 152 },
    { x: CX - 500, y: CY + 285, r: 150 },
    { x: CX + 530, y: CY - 10, r: 150 },
  ];

  const radiusForLabel = (label: string, base: number) => {
    const len = (label || "").length;

    if (len >= 16) return base + 34;
    if (len >= 13) return base + 24;
    if (len >= 10) return base + 14;

    return base;
  };

  return arr.slice(0, 3).map((it, i) => ({
    ...it,
    x: positions[i].x,
    y: positions[i].y,
    r: radiusForLabel(it.label, positions[i].r),
    strength:
      it.importance >= 0.95
        ? "väga oluline"
        : it.importance >= 0.78
          ? "oluline"
          : "puudutab",
  }));
}, [byType]);

  // Left column: motivations. Right column: fears (flowing, not dashed).
  const colPositions = (n: number) => {
  if (n === 0) return [];
  const startY = 150;
  const endY = 830;
  if (n === 1) return [(startY + endY) / 2];
  const gap = (endY - startY) / (n - 1);
  return Array.from({ length: n }, (_, i) => startY + i * gap);
};

  const leftPills = useMemo(() => {
  const arr = byType.motivation.slice(0, 4);

  const positions = [
    { x: CX - 690, y: CY - 310 }, // üleval vasakul
    { x: CX - 760, y: CY - 70 },  // keskelt vasakul
    { x: CX - 650, y: CY + 300 }, // all vasakul
    { x: CX - 760, y: CY + 130 }, // lisakoht
  ];

  return arr.map((it, i) => ({
    ...it,
    x: positions[i]?.x ?? CX - 720,
    y: positions[i]?.y ?? CY - 260 + i * 150,
  }));
}, [byType]);

const rightPills = useMemo(() => {
  const arr = byType.fear.slice(0, 4);

  const positions = [
    { x: CX + 700, y: CY - 300 }, // üleval paremal
    { x: CX + 780, y: CY - 40 },  // keskelt paremal
    { x: CX + 670, y: CY + 300 }, // all paremal
    { x: CX + 780, y: CY + 130 }, // lisakoht
  ];

  return arr.map((it, i) => ({
    ...it,
    x: positions[i]?.x ?? CX + 720,
    y: positions[i]?.y ?? CY - 260 + i * 150,
  }));
}, [byType]);

  const handleClick = (it: MapItem) => {
    setOpened(it);
    onSelect?.(it);
  };

  return (
    <div className="relative">
      <div
        id="otsuse-kaart-svg"
        className="overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface via-background to-lavender/25 p-3 sm:p-5"
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Otsuse visuaalne kaart">
          <defs>
            <radialGradient id="center-fill" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="oklch(0.985 0.008 290)" />
              <stop offset="100%" stopColor="oklch(0.9 0.04 290)" />
            </radialGradient>
            <radialGradient id="halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.74 0.09 285)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="oklch(0.74 0.09 285)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="aura-purple" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="oklch(0.7 0.13 300)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="oklch(0.7 0.13 300)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="aura-lavender" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="oklch(0.7 0.1 285)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="oklch(0.7 0.1 285)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="aura-blue" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="oklch(0.7 0.11 260)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="oklch(0.7 0.11 260)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bubble-purple" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="oklch(0.94 0.045 305)" />
              <stop offset="100%" stopColor="oklch(0.84 0.07 300)" />
            </radialGradient>
            <radialGradient id="bubble-lavender" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="oklch(0.95 0.028 290)" />
              <stop offset="100%" stopColor="oklch(0.86 0.05 285)" />
            </radialGradient>
            <radialGradient id="bubble-blue" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="oklch(0.94 0.035 250)" />
              <stop offset="100%" stopColor="oklch(0.84 0.06 260)" />
            </radialGradient>
            <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Halo behind center — breathing aura, larger */}
          <ellipse cx={CX} cy={CY} rx={360} ry={220} fill="url(#halo)" className="animate-breathe-slow" />

          {/* Curved connections from center to main bubbles + "tugev mõju" badge */}
          {mains.map((it) => {
            const dx = it.x - CX;
            const dy = it.y - CY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / dist;
            const uy = dy / dist;
            const x1 = CX + ux * 200;
            const y1 = CY + uy * 120;
            const x2 = it.x - ux * (it.r + 6);
            const y2 = it.y - uy * (it.r + 6);
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            const isHover = hovered === it.id;
            return (
              <g key={"ml-" + it.id}>
                <path
                  d={`M ${x1} ${y1} Q ${mx + uy * 22} ${my - ux * 22}, ${x2} ${y2}`}
                  stroke="oklch(0.55 0.13 285)"
                  strokeWidth={isHover ? 3 : 2.2}
                  strokeLinecap="round"
                  fill="none"
                  opacity={hovered === null ? 0.6 : isHover ? 1 : 0.18}
                  className="animate-line-breathe transition-all duration-500"
                  style={{ animationDelay: `${(it.x % 5) * 0.4}s` }}
                />
              </g>
            );
          })}

          {/* Left pill connections — soft flowing curve */}
          {leftPills.map((it) => {
            const isHover = hovered === it.id;
            return (
              <path
                key={"ll-" + it.id}
                d={`M 220 ${it.y} C 360 ${it.y}, ${CX - 320} ${CY + (it.y - CY) * 0.3}, ${CX - 220} ${CY + (it.y - CY) * 0.18}`}
                stroke="oklch(0.55 0.13 285)"
                strokeWidth={isHover ? 1.9 : 1.1}
                strokeLinecap="round"
                fill="none"
                opacity={hovered === null ? 0.42 : isHover ? 0.95 : 0.1}
                className="animate-line-breathe transition-all duration-500"
                style={{ animationDelay: `${(it.y % 6) * 0.3}s` }}
              />
            );
          })}
          {/* Right pill connections — slightly tangled wave (no dashes) */}
          {rightPills.map((it) => {
            const isHover = hovered === it.id;
            const y = it.y;
            const startX = W - 220;
            const endX = CX + 220;
            const midX1 = startX - 70;
            const midX2 = startX - 180;
            // small irregular bend on this curve to suggest a soft "obstacle"
            const bend = (y % 60) - 30;
            return (
              <path
                key={"rl-" + it.id}
                d={`M ${startX} ${y} C ${midX1} ${y + bend}, ${midX2} ${y - bend * 0.6}, ${endX} ${CY + (y - CY) * 0.18}`}
                stroke="oklch(0.55 0.13 285)"
                strokeWidth={isHover ? 1.9 : 1.1}
                strokeLinecap="round"
                fill="none"
                opacity={hovered === null ? 0.45 : isHover ? 0.95 : 0.12}
                className="animate-line-breathe transition-all duration-500"
                style={{ animationDelay: `${(y % 5) * 0.35}s` }}
              />
            );
          })}

          {/* Main influence bubbles — shapes drift/breathe, text stays static */}
          {mains.map((it, idx) => {
            const grad = idx === 0 ? "url(#bubble-purple)" : idx === 1 ? "url(#bubble-lavender)" : "url(#bubble-blue)";
            const auraGrad = idx === 0 ? "url(#aura-purple)" : idx === 1 ? "url(#aura-lavender)" : "url(#aura-blue)";
            const driftClass = idx === 0 ? "animate-float-a" : idx === 1 ? "animate-float-b" : "animate-float-c";
            const isHover = hovered === it.id;
            const isTop = it.importance >= 0.95;
            const scale = isHover ? 1.06 : 1;
            // text sized relative to bubble radius; bigger bubbles get bigger text
            const labelSize = Math.min(40, Math.max(28, Math.round(it.r * 0.26)));
            const wrapped = wrapLabel(it.label, Math.max(14, Math.floor(it.r / 4.2)), 2);
            return (
              <g
                key={it.id}
                onMouseEnter={() => setHovered(it.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleClick(it)}
                className="cursor-pointer"
              >
                {/* Shape layer — drifts subtly, scales on hover */}
                <g
                  className={driftClass}
                  style={{ animationDelay: `${idx * 1.1}s`, transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <g
                    style={{
                      transformOrigin: `${it.x}px ${it.y}px`,
                      transform: `scale(${scale})`,
                      transition: "transform 380ms cubic-bezier(.2,.7,.2,1)",
                    }}
                  >
                    <circle
                      cx={it.x}
                      cy={it.y}
                      r={it.r + 46}
                      fill={auraGrad}
                      opacity={isHover ? 0.95 : 0.55}
                      style={{ transition: "opacity 400ms ease" }}
                    />
                    <circle cx={it.x} cy={it.y} r={it.r + 10} fill={grad} opacity="0.35" />
                    <circle
                      cx={it.x}
                      cy={it.y}
                      r={it.r}
                      fill={grad}
                      stroke="oklch(0.45 0.13 285)"
                      strokeWidth={isHover ? 1.8 : 1.2}
                      style={{ transition: "stroke-width 300ms ease" }}
                    />
                  </g>
                </g>
                {/* Text layer — static, never animated */}
                <g style={{ pointerEvents: "none" }}>
                  {/* tiny icon */}
                  <g transform={`translate(${it.x}, ${it.y - it.r * 0.5})`} opacity="0.7">
                    {it.type === "value" ? (
                      <path d="M 0 -7 L 2.5 -2 L 8 -2 L 3.8 1.5 L 5.5 7 L 0 3.5 L -5.5 7 L -3.8 1.5 L -8 -2 L -2.5 -2 Z" fill="oklch(0.45 0.13 285)" />
                    ) : (
                      <g stroke="oklch(0.45 0.13 285)" strokeWidth="1.4" fill="none" strokeLinecap="round">
                        <circle cx="-5" cy="-2" r="3" />
                        <circle cx="5" cy="-2" r="3" />
                        <path d="M -10 6 Q -5 2, 0 5 Q 5 2, 10 6" />
                      </g>
                    )}
                  </g>
                  {/* wrapped label, vertically centered */}
                  <text
                    x={it.x}
                    textAnchor="middle"
                    style={{
                      fontFamily: "Fraunces, serif",
                      fontSize: isTop ? labelSize + 2 : labelSize,
                      fontWeight: isTop ? 600 : 500,
                      fill: "oklch(0.22 0.07 275)",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {wrapped.map((line: string, i: number) => (
                      <tspan
                        key={i}
                        x={it.x}
                        y={it.y + (i - (wrapped.length - 1) / 2) * (labelSize + 4) + 6}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                  <text
                    x={it.x}
                    y={it.y + it.r * 0.55}
                    textAnchor="middle"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      fontWeight: 500,
                      fill: "oklch(0.5 0.05 285)",
                      letterSpacing: 0.6,
                      textTransform: "lowercase",
                    }}
                  >
                    {it.strength}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Side pills */}
          {leftPills.map((it, i) => (
            <PillButton
              key={it.id}
              x={it.x}
              y={it.y}
              label={it.label}
              hovered={hovered === it.id}
              delay={i * 0.6}
              onEnter={() => setHovered(it.id)}
              onLeave={() => setHovered(null)}
              onClick={() => handleClick(it)}
            />
          ))}
          {rightPills.map((it, i) => (
            <PillButton
              key={it.id}
              x={it.x}
              y={it.y}
              label={it.label}
              hovered={hovered === it.id}
              delay={i * 0.6 + 0.3}
              onEnter={() => setHovered(it.id)}
              onLeave={() => setHovered(null)}
              onClick={() => handleClick(it)}
            />
          ))}

          {/* Center organic decision blob — larger, shape breathes, text stays static */}
          <g>
            <g className="animate-float-soft" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <path
                d={`M ${CX - 270} ${CY - 10}
    C ${CX - 270} ${CY - 140}, ${CX - 145} ${CY - 165}, ${CX - 20} ${CY - 155}
    C ${CX + 150} ${CY - 145}, ${CX + 270} ${CY - 105}, ${CX + 270} ${CY + 8}
    C ${CX + 270} ${CY + 135}, ${CX + 130} ${CY + 165}, ${CX} ${CY + 154}
    C ${CX - 140} ${CY + 144}, ${CX - 270} ${CY + 120}, ${CX - 270} ${CY - 10} Z`}
                fill="url(#center-fill)"
                stroke="oklch(0.45 0.13 285)"
                strokeWidth="1.8"
              />
            </g>
            <g style={{ pointerEvents: "none" }}>
              <text
                x={CX}
                y={CY - 92}
                textAnchor="middle"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  fill: "oklch(0.55 0.1 285)",
                  letterSpacing: 2.4,
                }}
              >
                SINU OTSUS
              </text>
              <foreignObject x={CX - 245} y={CY - 92} width={490} height={230}>
               <div className="flex h-full w-full items-center justify-center px-2 text-center">
                  <p
                    style={{
                      fontFamily: "Fraunces, serif",
                      fontWeight: 600,
                      fontSize: centerFontSize(centerText),
                      lineHeight: 1.14,
                      letterSpacing: "-0.02em",
                      color: "oklch(0.22 0.07 275)",
                    }}
                  >
                    {clip(centerText || "Sinu otsus", 140)}
                  </p>
                </div>
              </foreignObject>
            </g>
          </g>
        </svg>
      </div>




      {/* Soovitatav järgmine samm — below the map */}
      {nextStepTitle && (
        <button
          onClick={() =>
            handleClick({
              id: "next",
              type: "next",
              label: nextStepTitle,
              note: "",
              summary: nextStepText || "",
              why: "",
              importance: 1,
              nextRationale,
              nextExamples,
            })
          }
          className="group mt-6 flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left transition hover:border-violet-soft hover:shadow-sm sm:gap-5 sm:p-6"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lavender">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="oklch(0.45 0.13 285)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-violet-soft">
              Soovitatav järgmine samm
            </p>
            <h3 className="mt-1 font-serif text-lg font-semibold text-navy sm:text-xl">{nextStepTitle}</h3>
            {nextStepText && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{nextStepText}</p>
            )}
          </div>
          <svg className="hidden shrink-0 text-violet-deep transition group-hover:translate-x-0.5 sm:block" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {opened && <DetailSheet item={opened} onClose={() => setOpened(null)} />}
    </div>
  );
}

function PillButton({
  x, y, label, hovered, onEnter, onLeave, onClick,
}: {
  x: number; y: number; label: string; hovered: boolean; delay?: number;
  onEnter: () => void; onLeave: () => void; onClick: () => void;
}) {
  const text = clip(label, 30);
  const width = Math.max(230, text.length * 12 + 76);
  return (
    <g
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="cursor-pointer"
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      <g
        style={{
          transformOrigin: `${x}px ${y}px`,
          transform: hovered ? "scale(1.07)" : "scale(1)",
          transition: "transform 300ms cubic-bezier(.2,.7,.2,1)",
        }}
      >
        {hovered && (
          <rect
            x={x - width / 2 - 10}
            y={y - 38}
            width={width + 20}
            height={76}
            rx={38}
            fill="oklch(0.7 0.13 290)"
            opacity="0.18"
          />
        )}
        <rect
          x={x - width / 2}
          y={y - 40}
          width={width}
          height={80}
          rx={40}
          fill="oklch(1 0 0)"
          stroke={hovered ? "oklch(0.45 0.13 285)" : "oklch(0.62 0.11 290)"}
          strokeWidth={hovered ? 1.7 : 1.1}
          opacity={hovered ? 1 : 0.95}
          style={{ transition: "stroke-width 200ms ease" }}
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            fontWeight: hovered ? 600 : 500,
            fill: "oklch(0.27 0.07 275)",
            letterSpacing: "-0.005em",
          }}
        >
          {text}
        </text>
      </g>
    </g>
  );
}


function DetailSheet({ item, onClose }: { item: MapItem; onClose: () => void }) {
  const isNext = item.type === "next";
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm animate-fade-in" />
      <aside
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[88vh] animate-fade-in overflow-auto rounded-t-3xl border-t border-border bg-card p-6 shadow-2xl
                   sm:bottom-auto sm:left-auto sm:right-6 sm:top-1/2 sm:max-h-[82vh] sm:w-[420px] sm:-translate-y-1/2 sm:rounded-2xl sm:border"
        role="dialog"
        aria-label={item.label}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-violet-soft">
              {typeLabel(item.type)}
            </p>
            <h3 className="mt-1.5 font-serif text-2xl font-semibold text-navy">{item.label}</h3>
          </div>
          <button onClick={onClose} aria-label="Sulge" className="rounded-full p-1.5 text-muted-foreground hover:bg-lavender/40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {item.note && (
          <section className="mt-5">
            <h4 className="text-[11px] font-medium uppercase tracking-[0.18em] text-violet-soft">Sinu seletus</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{item.note}</p>
          </section>
        )}

        {item.summary && !isNext && (
          <section className="mt-5">
            <h4 className="text-[11px] font-medium uppercase tracking-[0.18em] text-violet-soft">Lühikokkuvõte</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{item.summary}</p>
          </section>
        )}

        {!isNext && item.why && (
          <section className="mt-5">
            <h4 className="text-[11px] font-medium uppercase tracking-[0.18em] text-violet-soft">Miks see võib oluline olla?</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{item.why}</p>
          </section>
        )}

        {isNext && (
          <>
            {item.summary && (
              <section className="mt-5">
                <h4 className="text-[11px] font-medium uppercase tracking-[0.18em] text-violet-soft">Mida see samm tähendab</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{item.summary}</p>
              </section>
            )}
            {item.nextRationale && (
              <section className="mt-5">
                <h4 className="text-[11px] font-medium uppercase tracking-[0.18em] text-violet-soft">Miks see on mõistlik esimene samm?</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{item.nextRationale}</p>
              </section>
            )}
            {item.nextExamples && item.nextExamples.length > 0 && (
              <section className="mt-5">
                <h4 className="text-[11px] font-medium uppercase tracking-[0.18em] text-violet-soft">Kuidas see võiks praktiliselt välja näha</h4>
                <ul className="mt-2 space-y-1.5">
                  {item.nextExamples.map((ex, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground/85">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-violet-soft" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </aside>
    </>
  );
}

function typeLabel(t: MapItemType): string {
  return ({ value: "Väärtus", motivation: "Mis tõmbab", fear: "Mure", affected: "Mõjutaja", next: "Järgmine samm" } as const)[t];
}

function clip(s: string, n: number) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1).trim() + "…" : s;
}

// Greedy word-wrap into at most `maxLines` lines, fitting roughly `maxChars` per line.
function wrapLabel(s: string, maxChars: number, maxLines = 2): string[] {
  if (!s) return [""];
  const words = s.trim().split(/\s+/);
  if (words.length === 1) return [clip(words[0], maxChars + 4)];
  const lines: string[] = [];
  let cur = "";
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const candidate = cur ? cur + " " + w : w;
    if (candidate.length <= maxChars || !cur) {
      cur = candidate;
    } else {
      lines.push(cur);
      cur = w;
      if (lines.length === maxLines) {
        // overflow into last line + ellipsis with the rest joined
        const rest = words.slice(i).join(" ");
        let last = lines[lines.length - 1];
        if ((last + " " + rest).length > maxChars + 3) {
          last = clip(last + " " + rest, maxChars + 3);
        } else {
          last = last + " " + rest;
        }
        lines[lines.length - 1] = last;
        return lines;
      }
    }
  }
  if (cur) lines.push(cur);
  return lines;
}


// Scale center decision text down for long sentences.
function centerFontSize(s: string): number {
  const len = (s || "").length;
  if (len <= 40) return 40;
  if (len <= 70) return 34;
  if (len <= 110) return 28;
  return 24;
}


// ---------- Helpers to map DecisionData → MapItems ----------

export function buildMapItems(d: DecisionData): MapItem[] {
  const items: MapItem[] = [];
  const noteWeight = (s: SelectedItem) => Math.min(1, (s.note?.length || 0) / 80);

  d.values.forEach((v, i) => {
    items.push({
      id: "v-" + v.key,
      type: "value",
      label: v.label,
      note: v.note,
      summary: i === 0
        ? "See väärtus tundub olevat sinu jaoks selle otsuse keskmes."
        : "See väärtus mõjutab seda otsust olulisel määral.",
      why: whyForValue(v.key, v.label),
      importance: 0.62 + noteWeight(v) * 0.4 + (d.ratings.valuesFit / 5) * 0.2,
    });
  });

  d.attractions.forEach((m) => {
    const importance = 0.5 + noteWeight(m) * 0.4 + (d.ratings.intrinsic / 5) * 0.15;
    items.push({
      id: "m-" + m.key,
      type: "motivation",
      label: m.label,
      note: m.note,
      summary: "See on üks põhjustest, miks see mõte sind tõmbab.",
      why: whyForMotivation(m.key, m.label),
      importance,
    });
  });

  d.holdBacks.forEach((f) => {
    let boost = 0;
    if (f.key === "kahetseda") boost += d.ratings.regret / 10;
    if (f.key === "suhe-moju" || f.key === "partner-ei-toeta") boost += d.ratings.relationships >= 4 ? 0.1 : 0.18;
    if (f.key === "raha" || f.key === "rahaline-risk") boost += 0.1;
    const importance = 0.5 + noteWeight(f) * 0.4 + boost + (d.ratings.stress / 5) * 0.1;
    items.push({
      id: "f-" + f.key,
      type: "fear",
      label: f.label,
      note: f.note,
      summary: "See on miski, mis selle otsuse juures sind kõhklema paneb.",
      why: whyForFear(f.key, f.label),
      importance,
    });
  });

  d.affected.forEach((a) => {
    let boost = 0;
    if (a.key === "partnerit" && d.holdBacks.some((h) => h.key === "suhe-moju" || h.key === "partner-ei-toeta")) {
      boost += 0.25;
    }
    items.push({
      id: "a-" + a.key,
      type: "affected",
      label: a.label,
      note: a.note,
      summary: "See valdkond või inimene on otsusega seotud.",
      why: whyForAffected(a.key, a.label),
      importance: 0.45 + noteWeight(a) * 0.3 + boost,
    });
  });

  return items;
}

function whyForValue(key: string, label: string): string {
  const k = key.toLowerCase();
  if (k.includes("vabadus")) {
    return "See võib näidata, et sinu jaoks on selles otsuses oluline autonoomia ja võimalus ise oma suunda kujundada. Tasub mõelda, kas konkreetne valik toetab vabadust päriselt ka igapäevases elus või seostub see pigem sooviga praegusest rutiinist korraks eemalduda.";
  }
  if (k.includes("lähedus") || k.includes("lahedus") || k.includes("suhe")) {
    return "Kui lähedus on selle otsuse keskmes, võib küsimus olla pigem selles, kuidas suhted antud valiku sees alles jäävad või tugevnevad. Tasub vaadata, kuidas see otsus loob või vähendab ruumi olulistele inimestele.";
  }
  if (k.includes("turva") || k.includes("stabiil")) {
    return "Turvalisus võib siin tähendada nii välist (raha, kindlus) kui ka sisemist (ennustatavus, rahulik meel) vajadust. Tasub eristada, kumb pool praegu kaalub rohkem ja mida saab konkreetselt selle vajaduse hoidmiseks teha.";
  }
  if (k.includes("areng") || k.includes("kasv") || k.includes("õpp")) {
    return "Sinu jaoks võib selle otsuse väärtus olla pigem selles, mida see sulle juurde annab, mitte selles, kus täpselt välja jõuad. Tasub vaadata, kas valik avab uusi kogemusi ka siis, kui kõik ei õnnestu plaanitult.";
  }
  if (k.includes("tervis") || k.includes("rahu")) {
    return "Kui see väärtus on esiplaanil, võib otsuse mõju enesetundele olla olulisem kui välised tulemused. Tasub jälgida, milline variant hoiab pikemas plaanis sinu jõudu ja rahu.";
  }
  return `„${label}“ on selles otsuses tugevalt esindatud väärtus. Tasub uurida, kuidas konkreetne valik seda väärtust päriselt toetab või kahjustab — mitte ainult sõnades, vaid igapäevastes tegudes.`;
}

function whyForMotivation(key: string, label: string): string {
  const k = key.toLowerCase();
  if (k.includes("vabadus") || k.includes("uus")) {
    return "See tõmme võib viidata vajadusele midagi muuta — kuid muutust on võimalik proovida ka väiksemates sammudes. Tasub küsida, kas selle soovi saab täita osaliselt ka ilma kogu otsuseta korraga.";
  }
  if (k.includes("raha") || k.includes("kindlus")) {
    return "Praktiline tõmme on tihti tugev, kuid tasub kontrollida, kas see katab ka teisi vajadusi peale rahalise turvatunde. Mõnikord on rahaline mõte ka turvatunde otsing.";
  }
  if (k.includes("areng") || k.includes("kasv")) {
    return "Kui see valik tõmbab arengu pärast, võib olla kasulik küsida, milliseid konkreetseid oskusi või kogemusi sa otsid. See aitab näha, kas just see valik on parim viis seal liikuda.";
  }
  return `„${label}“ on üks põhjustest, miks see mõte sind tõmbab. Tasub küsida, kas see soov on püsiv või seotud praeguse hetkega, ning kas selle saavutamiseks on ka väiksemaid samme.`;
}

function whyForFear(key: string, label: string): string {
  const k = key.toLowerCase();
  if (k === "liiga-loplik" || k.includes("lõplik")) {
    return "Kui otsus tundub liiga lõplikuna, võib see mõjuda paralüseerivalt. Sageli aitab valikut ümber sõnastada — mitte kogu elu määrava sammuna, vaid katsetuse või järgmise sammuna, mida saab hiljem üle vaadata.";
  }
  if (k === "ei-ole-infot" || k.includes("info")) {
    return "Info puudus võib panna mõtted ringlema. See viitab, et järgmine samm pole tingimata otsustamine ise, vaid konkreetse info juurde minemine — paar selget küsimust võivad pinge oluliselt vähendada.";
  }
  if (k.includes("raha") || k.includes("rahaline")) {
    return "See mure ei pruugi tähendada ainult raha küsimust, vaid ka vajadust turvatunde ja ettearvatavuse järele. Kui rahaline pool on ebaselge, võib olla raske aru saada, kas kahtlus tuleb valiku sisust või ebapiisavast infost.";
  }
  if (k.includes("suhe") || k.includes("partner")) {
    return "Kui hirm puudutab suhet, ei pruugi see olla ainult sinu individuaalne kaal. Tasub vaadata, mis täpselt suhtes võib muutuda ja kas neid muutusi on võimalik koos läbi rääkida enne otsuse tegemist.";
  }
  if (k === "kahetseda" || k.includes("kahetsus")) {
    return "Hirm kahetseda võib tähendada, et see otsus on sinu jaoks tähenduslik. Tasub küsida, kas kahetsust saab ennetada parema infoga, väiksema sammuga või selgema ajaraamiga.";
  }
  if (k.includes("teiste") || k.includes("arvamus")) {
    return "Kui teiste arvamus on tugev pidur, tasub eristada, kelle hinnangud on sulle päriselt olulised ja millised on lihtsalt valju kõrvalheli. Mõnikord on kasu sellest, kui esmalt sõnastada otsus iseendale, alles siis teistele.";
  }
  return `„${label}“ võib viidata olulisele vajadusele või väärtusele, mida see otsus puudutab. Tasub uurida, mida selle hirmu maandamiseks oleks võimalik konkreetselt teha — info, vestlus, väike test või selgem ajaraam.`;
}

function whyForAffected(key: string, label: string): string {
  const k = key.toLowerCase();
  if (k.includes("partner")) {
    return "Kui partner on otsuses tugevalt nähtaval, ei pruugi see olla ainult individuaalne valik. Sel juhul võib esimene samm olla mitte lõplik otsus, vaid ühiste ootuste, piiride ja võimalike kompromisside rahulik läbivaatamine.";
  }
  if (k.includes("pere") || k.includes("laps")) {
    return "Pere ja lähedaste mõju võib otsuse kaalu palju suurendada. Tasub eraldada, mis on sinu enda vajadus ja mis on vastutus teiste ees — mõlemad on olulised, kuid neid on lihtsam hoida selgena, kui need on lahus.";
  }
  if (k.includes("töö") || k.includes("karjäär")) {
    return "Kui otsus puudutab tööd või karjääri, mõjutab see sageli ka aega, energiat ja igapäevast rütmi. Tasub vaadata, kuidas valik mõjub mitte ainult ametinimetusele, vaid kogu päevale.";
  }
  return `„${label}“ on otsusega seotud. Kui otsus mõjutab teisi, tasub enne suuremat sammu ootused ja vajadused üheskoos läbi rääkida.`;
}
