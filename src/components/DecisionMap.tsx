import { useMemo, useState } from "react";
import type { DecisionData, SelectedItem } from "../lib/decision-store";

export type MapItemType = "value" | "motivation" | "fear" | "affected" | "next";

export interface MapItem {
  id: string;
  type: MapItemType;
  label: string;
  note: string;
  summary: string;     // short auto summary
  why: string;         // why it matters
  importance: number;  // 0..1
}

interface PositionedItem extends MapItem {
  x: number;
  y: number;
  r: number;
}

interface Props {
  centerText: string;
  items: MapItem[];
  nextStepTitle?: string;
  nextStepText?: string;
  onSelect?: (it: MapItem) => void;
}

// Visual constants
const W = 900;
const H = 620;
const CX = W / 2;
const CY = H / 2 - 30;

export function DecisionMap({ centerText, items, nextStepTitle, nextStepText, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [opened, setOpened] = useState<MapItem | null>(null);

  // Limit to most important per type to avoid clutter
  const limited = useMemo(() => {
    const byType: Record<MapItemType, MapItem[]> = { value: [], motivation: [], fear: [], affected: [], next: [] };
    for (const it of items) byType[it.type].push(it);
    for (const k of Object.keys(byType) as MapItemType[]) {
      byType[k] = byType[k].sort((a, b) => b.importance - a.importance).slice(0, 4);
    }
    return [...byType.value, ...byType.motivation, ...byType.fear, ...byType.affected];
  }, [items]);

  // Position items in rings
  const positioned: PositionedItem[] = useMemo(() => {
    // Values closer; motivations slightly further; affected as satellites; fears outer ring.
    const rings: Record<MapItemType, number> = {
      value: 165,
      motivation: 235,
      fear: 270,
      affected: 290,
      next: 0,
    };
    const grouped: Record<MapItemType, MapItem[]> = { value: [], motivation: [], fear: [], affected: [], next: [] };
    for (const it of limited) grouped[it.type].push(it);

    const out: PositionedItem[] = [];
    for (const type of ["value", "motivation", "fear", "affected"] as MapItemType[]) {
      const arr = grouped[type];
      const n = arr.length;
      const radius = rings[type];
      // Distribute around full circle with a slight offset per type
      const offset = type === "value" ? -Math.PI / 2 : type === "motivation" ? -Math.PI / 6 : type === "fear" ? Math.PI / 2.2 : Math.PI / 4;
      arr.forEach((it, i) => {
        const angle = offset + (i / Math.max(1, n)) * Math.PI * 2;
        const x = CX + Math.cos(angle) * radius;
        const y = CY + Math.sin(angle) * radius * 0.78; // slight vertical squash
        const baseR = type === "value" ? 38 : type === "motivation" ? 30 : type === "fear" ? 28 : 24;
        const r = baseR + it.importance * 18;
        out.push({ ...it, x, y, r });
      });
    }
    return out;
  }, [limited]);

  const handleClick = (it: MapItem) => {
    setOpened(it);
    onSelect?.(it);
  };

  return (
    <div className="relative">
      <div id="otsuse-kaart-svg" className="overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface to-lavender/30 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Otsuse visuaalne kaart">
          <defs>
            <radialGradient id="center-fill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.98 0.01 290)" />
              <stop offset="100%" stopColor="oklch(0.92 0.03 290)" />
            </radialGradient>
          </defs>

          {/* Connection lines from center to each item (breathing) */}
          {positioned.map((it) => (
            <line
              key={"l-" + it.id}
              x1={CX} y1={CY} x2={it.x} y2={it.y}
              stroke="oklch(0.62 0.11 290)"
              strokeWidth={it.type === "value" ? 1.4 : 1}
              strokeOpacity={hovered === null || hovered === it.id ? 0.35 : 0.1}
              strokeDasharray={it.type === "fear" ? "4 4" : undefined}
              className="transition-opacity duration-300"
            />
          ))}

          {/* Cross-links: connect related semantic pairs */}
          <CrossLinks items={positioned} hovered={hovered} />

          {/* Items */}
          {positioned.map((it) => (
            <g
              key={it.id}
              onMouseEnter={() => setHovered(it.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(it)}
              className="cursor-pointer"
              style={{ transformOrigin: `${it.x}px ${it.y}px`, transform: hovered === it.id ? "scale(1.06)" : "scale(1)", transition: "transform 240ms ease" }}
            >
              {renderShape(it, hovered === it.id)}
              <text
                x={it.x} y={it.y + 4}
                textAnchor="middle"
                className="pointer-events-none select-none"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: it.type === "value" ? 13 : 11,
                  fontWeight: it.type === "value" ? 600 : 500,
                  fill: "oklch(0.27 0.07 275)",
                }}
              >
                {truncate(it.label, it.type === "value" ? 16 : 14)}
              </text>
            </g>
          ))}

          {/* Center decision */}
          <g>
            <ellipse cx={CX} cy={CY} rx={140} ry={70} fill="url(#center-fill)" stroke="oklch(0.45 0.13 285)" strokeWidth="1.5" />
            <foreignObject x={CX - 130} y={CY - 55} width={260} height={110}>
              <div className="flex h-full w-full items-center justify-center px-3 text-center">
                <p style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 17, lineHeight: 1.25, color: "oklch(0.27 0.07 275)" }}>
                  {truncate(centerText || "Sinu otsus", 90)}
                </p>
              </div>
            </foreignObject>
          </g>

          {/* Next step — horizontal card below */}
          {nextStepTitle && (
            <g
              onClick={() => handleClick({ id: "next", type: "next", label: nextStepTitle, note: nextStepText || "", summary: nextStepText || "", why: "", importance: 1 })}
              className="cursor-pointer"
            >
              <rect x={CX - 175} y={CY + 150} width={350} height={64} rx={32}
                fill="oklch(0.45 0.13 285)" />
              <text x={CX} y={CY + 178} textAnchor="middle" style={{ fontFamily: "Fraunces, serif", fontSize: 14, fontWeight: 600, fill: "white" }}>
                Järgmine samm
              </text>
              <text x={CX} y={CY + 198} textAnchor="middle" style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "oklch(0.92 0.04 290)" }}>
                {truncate(nextStepTitle, 50)}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Detail panel */}
      {opened && (
        <DetailSheet item={opened} onClose={() => setOpened(null)} />
      )}
    </div>
  );
}

function renderShape(it: PositionedItem, isHover: boolean) {
  const opacity = isHover ? 1 : 0.92;
  switch (it.type) {
    case "value":
      return (
        <ellipse
          cx={it.x} cy={it.y} rx={it.r + 16} ry={it.r}
          fill="oklch(0.74 0.09 285)"
          stroke="oklch(0.45 0.13 285)"
          strokeWidth="1"
          opacity={opacity}
        />
      );
    case "motivation":
      return (
        <circle
          cx={it.x} cy={it.y} r={it.r}
          fill="oklch(0.88 0.04 290)"
          stroke="oklch(0.62 0.11 290)"
          strokeWidth="0.8"
          opacity={isHover ? 0.95 : 0.8}
          className="animate-breathe"
        />
      );
    case "fear":
      return (
        <ellipse
          cx={it.x} cy={it.y} rx={it.r + 8} ry={it.r - 4}
          fill="none"
          stroke="oklch(0.55 0.13 285)"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          opacity={isHover ? 0.85 : 0.6}
        />
      );
    case "affected":
      return (
        <circle
          cx={it.x} cy={it.y} r={it.r - 4}
          fill="oklch(0.96 0.012 290)"
          stroke="oklch(0.62 0.11 290)"
          strokeWidth="1"
          opacity={opacity}
        />
      );
    default:
      return null;
  }
}

function CrossLinks({ items, hovered }: { items: PositionedItem[]; hovered: string | null }) {
  // Pairs: value+fear with matching theme, affected+fear about relationships, etc.
  const pairs: [PositionedItem, PositionedItem][] = [];
  const find = (type: MapItemType, keyIncludes: string) =>
    items.find((i) => i.type === type && (i.id.toLowerCase().includes(keyIncludes) || i.label.toLowerCase().includes(keyIncludes)));

  const lahedus = find("value", "lähedus") || find("value", "lahedus");
  const suheMoju = find("fear", "suhe");
  if (lahedus && suheMoju) pairs.push([lahedus, suheMoju]);

  const vabadus = find("motivation", "vabadus") || find("value", "vabadus");
  const stabKaduda = find("fear", "stab");
  if (vabadus && stabKaduda) pairs.push([vabadus, stabKaduda]);

  const partner = find("affected", "partner");
  const partnerFear = find("fear", "partner") || find("fear", "suhe");
  if (partner && partnerFear) pairs.push([partner, partnerFear]);

  return (
    <>
      {pairs.map(([a, b], i) => (
        <path
          key={"cl-" + i}
          d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2 + 20} ${(a.y + b.y) / 2 - 30}, ${b.x} ${b.y}`}
          stroke="oklch(0.62 0.11 290)"
          strokeWidth="1"
          fill="none"
          strokeOpacity={hovered === a.id || hovered === b.id ? 0.55 : 0.2}
          strokeDasharray="2 3"
          className="transition-opacity duration-300"
        />
      ))}
    </>
  );
}

function DetailSheet({ item, onClose }: { item: MapItem; onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm" />
      <aside
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-auto rounded-t-3xl border-t border-border bg-card p-6 shadow-xl
                   sm:bottom-auto sm:left-auto sm:right-6 sm:top-1/2 sm:max-h-[80vh] sm:w-[380px] sm:-translate-y-1/2 sm:rounded-2xl sm:border"
        role="dialog"
        aria-label={item.label}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-violet-soft">{typeLabel(item.type)}</p>
            <h3 className="mt-1 font-serif text-2xl font-semibold text-navy">{item.label}</h3>
          </div>
          <button onClick={onClose} aria-label="Sulge" className="rounded-full p-1.5 text-muted-foreground hover:bg-lavender/40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {item.note && (
          <section className="mt-5">
            <h4 className="text-xs font-medium uppercase tracking-wider text-violet-soft">Sinu seletus</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{item.note}</p>
          </section>
        )}

        {item.summary && (
          <section className="mt-5">
            <h4 className="text-xs font-medium uppercase tracking-wider text-violet-soft">Lühikokkuvõte</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{item.summary}</p>
          </section>
        )}

        {item.why && (
          <section className="mt-5">
            <h4 className="text-xs font-medium uppercase tracking-wider text-violet-soft">Miks see võib oluline olla</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{item.why}</p>
          </section>
        )}
      </aside>
    </>
  );
}

function typeLabel(t: MapItemType): string {
  return ({ value: "Väärtus", motivation: "Mis tõmbab", fear: "Mis hoiab tagasi", affected: "Mõjutab", next: "Järgmine samm" } as const)[t];
}

function truncate(s: string, n: number) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1).trim() + "…" : s;
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
      summary: `See väärtus tundub olevat sinu jaoks selle otsuse keskmes${i === 0 ? "." : "."}`,
      why: "Kui valik toetab seda väärtust, võib otsus tunduda õigem. Tasub uurida, kuidas konkreetne valik seda väärtust tegelikult toetab või kahjustab.",
      importance: 0.6 + noteWeight(v) * 0.4 + (d.ratings.valuesFit / 5) * 0.2,
    });
  });

  d.attractions.forEach((m) => {
    const importance = 0.45 + noteWeight(m) * 0.4 + (d.ratings.intrinsic / 5) * 0.15;
    items.push({
      id: "m-" + m.key,
      type: "motivation",
      label: m.label,
      note: m.note,
      summary: "See on üks põhjustest, miks see mõte sind tõmbab.",
      why: "Tasub küsida, kas see soov on püsiv või seotud praeguse hetkega, ning kas selle saavutamiseks on ka väiksemaid samme.",
      importance,
    });
  });

  d.holdBacks.forEach((f) => {
    let boost = 0;
    if (f.key === "kahetseda") boost += d.ratings.regret / 10;
    if (f.key === "suhe-moju" || f.key === "partner-ei-toeta") boost += d.ratings.relationships >= 4 ? 0.1 : 0.15;
    const importance = 0.45 + noteWeight(f) * 0.4 + boost + (d.ratings.stress / 5) * 0.1;
    items.push({
      id: "f-" + f.key,
      type: "fear",
      label: f.label,
      note: f.note,
      summary: "See on miski, mis selle otsuse juures sind kõhklema paneb.",
      why: f.key === "liiga-loplik"
        ? "Mõnikord aitab otsust ümber sõnastada — mitte lõpliku valikuna, vaid väikse katse või järgmise sammuna."
        : f.key === "ei-ole-infot"
        ? "See võib tähendada, et järgmine samm pole otsustamine, vaid info kogumine."
        : "Hirm võib viidata olulisele vajadusele. Tasub uurida, mida selle hirmu maandamiseks saaks teha.",
      importance,
    });
  });

  d.affected.forEach((a) => {
    let boost = 0;
    if (a.key === "partnerit" && d.holdBacks.some((h) => h.key === "suhe-moju" || h.key === "partner-ei-toeta")) {
      boost += 0.2;
    }
    items.push({
      id: "a-" + a.key,
      type: "affected",
      label: a.label,
      note: a.note,
      summary: "See valdkond või inimene on otsusega seotud.",
      why: "Kui otsus mõjutab teisi, tasub enne suuremat sammu ootused ja vajadused üheskoos läbi rääkida.",
      importance: 0.4 + noteWeight(a) * 0.3 + boost,
    });
  });

  return items;
}
