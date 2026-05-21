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
  nextRationale?: string;
  nextExamples?: string[];
  onSelect?: (it: MapItem) => void;
}

const W = 940;
const H = 680;
const CX = W / 2;
const CY = H / 2 - 30;

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

  const limited = useMemo(() => {
    const byType: Record<MapItemType, MapItem[]> = { value: [], motivation: [], fear: [], affected: [], next: [] };
    for (const it of items) byType[it.type].push(it);
    for (const k of Object.keys(byType) as MapItemType[]) {
      byType[k] = byType[k].sort((a, b) => b.importance - a.importance).slice(0, 4);
    }
    return [...byType.value, ...byType.motivation, ...byType.fear, ...byType.affected];
  }, [items]);

  const positioned: PositionedItem[] = useMemo(() => {
    const rings: Record<MapItemType, number> = {
      value: 175,
      motivation: 250,
      fear: 290,
      affected: 310,
      next: 0,
    };
    const grouped: Record<MapItemType, MapItem[]> = { value: [], motivation: [], fear: [], affected: [], next: [] };
    for (const it of limited) grouped[it.type].push(it);

    const out: PositionedItem[] = [];
    for (const type of ["value", "motivation", "fear", "affected"] as MapItemType[]) {
      const arr = grouped[type];
      const n = arr.length;
      const radius = rings[type];
      const offset =
        type === "value" ? -Math.PI / 2 :
        type === "motivation" ? -Math.PI / 6 :
        type === "fear" ? Math.PI / 2.2 :
        Math.PI / 4;
      arr.forEach((it, i) => {
        const angle = offset + (i / Math.max(1, n)) * Math.PI * 2;
        const x = CX + Math.cos(angle) * radius;
        const y = CY + Math.sin(angle) * radius * 0.82;
        const baseR =
          type === "value" ? 44 :
          type === "motivation" ? 36 :
          type === "fear" ? 34 :
          30;
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
      <div
        id="otsuse-kaart-svg"
        className="overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface via-background to-lavender/30 p-2 sm:p-3"
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Otsuse visuaalne kaart">
          <defs>
            <radialGradient id="center-fill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.985 0.008 290)" />
              <stop offset="100%" stopColor="oklch(0.9 0.04 290)" />
            </radialGradient>
            <radialGradient id="halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.74 0.09 285)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="oklch(0.74 0.09 285)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft halo behind center */}
          <circle cx={CX} cy={CY} r={210} fill="url(#halo)" className="animate-breathe-slow" />

          {/* Connection lines from center to each item */}
          {positioned.map((it) => (
            <line
              key={"l-" + it.id}
              x1={CX} y1={CY} x2={it.x} y2={it.y}
              stroke="oklch(0.62 0.11 290)"
              strokeWidth={it.type === "value" ? 1.4 : 1}
              strokeOpacity={hovered === null ? 0.28 : hovered === it.id ? 0.55 : 0.08}
              strokeDasharray={it.type === "fear" ? "4 5" : undefined}
              className="transition-opacity duration-500"
            />
          ))}

          <CrossLinks items={positioned} hovered={hovered} />

          {/* Items */}
          {positioned.map((it, idx) => (
            <g
              key={it.id}
              onMouseEnter={() => setHovered(it.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(it)}
              className="cursor-pointer animate-float-soft"
              style={{
                transformOrigin: `${it.x}px ${it.y}px`,
                transform: hovered === it.id ? "scale(1.07)" : "scale(1)",
                transition: "transform 260ms ease",
                animationDelay: `${(idx % 5) * 0.6}s`,
              }}
            >
              {renderShape(it, hovered === it.id)}
              <WrappedLabel
                text={it.label}
                cx={it.x}
                cy={it.y}
                maxWidth={(it.type === "value" ? it.r + 14 : it.r) * 2 - 8}
                type={it.type}
              />
            </g>
          ))}

          {/* Center decision */}
          <g>
            <ellipse cx={CX} cy={CY} rx={160} ry={78} fill="url(#center-fill)" stroke="oklch(0.45 0.13 285)" strokeWidth="1.6" />
            <foreignObject x={CX - 150} y={CY - 62} width={300} height={124}>
              <div className="flex h-full w-full items-center justify-center px-4 text-center">
                <p style={{
                  fontFamily: "Fraunces, serif",
                  fontWeight: 600,
                  fontSize: 18,
                  lineHeight: 1.28,
                  color: "oklch(0.27 0.07 275)",
                }}>
                  {clip(centerText || "Sinu otsus", 110)}
                </p>
              </div>
            </foreignObject>
          </g>

          {/* Next step pill */}
          {nextStepTitle && (
            <g
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
              className="cursor-pointer"
              style={{ transformOrigin: `${CX}px ${CY + 195}px`, transition: "transform 240ms ease" }}
            >
              <rect x={CX - 195} y={CY + 170} width={390} height={72} rx={36} fill="oklch(0.45 0.13 285)" />
              <text x={CX} y={CY + 198} textAnchor="middle" style={{
                fontFamily: "Fraunces, serif", fontSize: 14, fontWeight: 600,
                fill: "white", letterSpacing: 0.4, textTransform: "uppercase",
              }}>
                Järgmine samm
              </text>
              <text x={CX} y={CY + 222} textAnchor="middle" style={{
                fontFamily: "Inter, sans-serif", fontSize: 13, fill: "oklch(0.96 0.012 290)",
              }}>
                {clip(nextStepTitle, 56)}
              </text>
            </g>
          )}
        </svg>
      </div>

      {opened && (
        <DetailSheet item={opened} onClose={() => setOpened(null)} />
      )}
    </div>
  );
}

function renderShape(it: PositionedItem, isHover: boolean) {
  const opacity = isHover ? 1 : 0.94;
  switch (it.type) {
    case "value":
      return (
        <ellipse
          cx={it.x} cy={it.y} rx={it.r + 14} ry={it.r}
          fill="oklch(0.78 0.07 285)"
          stroke="oklch(0.45 0.13 285)"
          strokeWidth="1.1"
          opacity={opacity}
        />
      );
    case "motivation":
      return (
        <circle
          cx={it.x} cy={it.y} r={it.r}
          fill="oklch(0.9 0.035 290)"
          stroke="oklch(0.62 0.11 290)"
          strokeWidth="0.9"
          opacity={isHover ? 0.98 : 0.85}
        />
      );
    case "fear":
      return (
        <>
          <ellipse
            cx={it.x} cy={it.y} rx={it.r + 6} ry={it.r - 2}
            fill="oklch(0.96 0.012 290)"
            opacity={isHover ? 0.55 : 0.35}
          />
          <ellipse
            cx={it.x} cy={it.y} rx={it.r + 6} ry={it.r - 2}
            fill="none"
            stroke="oklch(0.55 0.13 285)"
            strokeWidth="1.2"
            strokeDasharray="5 5"
            opacity={isHover ? 0.95 : 0.7}
          />
        </>
      );
    case "affected":
      return (
        <circle
          cx={it.x} cy={it.y} r={it.r - 2}
          fill="oklch(0.99 0.005 290)"
          stroke="oklch(0.62 0.11 290)"
          strokeWidth="1"
          opacity={opacity}
        />
      );
    default:
      return null;
  }
}

// Wrap label across up to 2 lines, ellipsis if still too long.
function WrappedLabel({ text, cx, cy, maxWidth, type }: { text: string; cx: number; cy: number; maxWidth: number; type: MapItemType }) {
  const fontSize = type === "value" ? 13 : 12;
  const fontWeight = type === "value" ? 600 : 500;
  // approx chars per line based on width
  const approxChar = fontSize * 0.55;
  const maxChars = Math.max(8, Math.floor(maxWidth / approxChar));
  const lines = wrap(text, maxChars, 2);
  const lineHeight = fontSize + 2;
  const totalH = lines.length * lineHeight;
  const startY = cy - totalH / 2 + fontSize - 1;
  return (
    <text
      textAnchor="middle"
      className="pointer-events-none select-none"
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize,
        fontWeight,
        fill: "oklch(0.27 0.07 275)",
      }}
    >
      {lines.map((ln, i) => (
        <tspan key={i} x={cx} y={startY + i * lineHeight}>{ln}</tspan>
      ))}
    </text>
  );
}

function wrap(text: string, maxChars: number, maxLines: number): string[] {
  if (!text) return [""];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (test.length <= maxChars) cur = test;
    else {
      if (cur) lines.push(cur);
      cur = w;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  // If last line plus remaining doesn't fit, ellipsize
  if (lines.length === maxLines) {
    const joined = lines.join(" ");
    if (joined.length < text.length) {
      let last = lines[maxLines - 1];
      while ((last + "…").length > maxChars && last.length > 0) last = last.slice(0, -1);
      lines[maxLines - 1] = last.replace(/[\s,.;:-]+$/, "") + "…";
    }
  }
  return lines;
}

function CrossLinks({ items, hovered }: { items: PositionedItem[]; hovered: string | null }) {
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
          strokeOpacity={hovered === a.id || hovered === b.id ? 0.55 : 0.18}
          strokeDasharray="2 4"
          className="transition-opacity duration-500"
        />
      ))}
    </>
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
