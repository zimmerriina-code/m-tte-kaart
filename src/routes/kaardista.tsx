import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  emptyData,
  loadData,
  saveData,
  type DecisionData,
  type SelectedItem,
} from "../lib/decision-store";

export const Route = createFileRoute("/kaardista")({
  head: () => ({
    meta: [
      { title: "Kaardista oma mõte — Otsuse kaart" },
      { name: "description", content: "Vasta rahulikult mõnele küsimusele ja näe oma otsust visuaalselt." },
    ],
  }),
  component: Flow,
});

const TOTAL = 9;

// ---------- Option lists ----------

const areaOptions = [
  "Õpingud või eriala",
  "Töö ja karjäär",
  "Välismaale kolimine",
  "Suhe või lähedased",
  "Raha",
  "Elustiil",
  "Suur elumuutus",
  "Muu",
];

const attractionOptions: { key: string; label: string; followUp?: string }[] = [
  { key: "areng", label: "Areng", followUp: "Milles sa tahaksid selle otsuse kaudu areneda?" },
  { key: "vabadus", label: "Vabadus", followUp: "Mida vabadus selles otsuses sinu jaoks tähendab?" },
  { key: "seiklus", label: "Seiklus" },
  { key: "uus-algus", label: "Uus algus", followUp: "Millist uut algust sa sellelt valikult ootad?" },
  { key: "stabiilsus", label: "Stabiilsus" },
  { key: "tahendus", label: "Tähendus" },
  { key: "eneseteostus", label: "Eneseteostus" },
  { key: "elukvaliteet", label: "Parem elukvaliteet" },
  { key: "keskkond", label: "Parem keskkond või kliima" },
  { key: "aitamine", label: "Teiste aitamine" },
  { key: "rutiinist-valja", label: "Soov rutiinist välja saada" },
  { key: "muu", label: "Muu" },
];

const holdBackOptions: { key: string; label: string; followUp?: string }[] = [
  { key: "rahaline-risk", label: "Rahaline risk" },
  { key: "kahetseda", label: "Hirm kahetseda", followUp: "Mida sa kõige rohkem kardad hiljem kahetseda?" },
  { key: "ei-saa-hakkama", label: "Hirm, et ma ei saa hakkama" },
  { key: "stabiilsus-kaduda", label: "Hirm stabiilsust kaotada" },
  { key: "liiga-loplik", label: "Otsus tundub liiga lõplik", followUp: "Mis teeb selle otsuse sinu jaoks lõplikuna tunduvaks?" },
  { key: "ei-ole-infot", label: "Mul ei ole piisavalt infot", followUp: "Millist infot sul veel vaja oleks?" },
  { key: "palju-valikuid", label: "Liiga palju valikuid" },
  { key: "partner-ei-toeta", label: "Partner või lähedased ei toeta seda", followUp: "Kelle vajadused või arvamus sind selle otsuse juures mõjutavad?" },
  { key: "suhe-moju", label: "Otsus võib mõjutada suhet" },
  { key: "too-opingud", label: "Töö või õpingud võivad kannatada" },
  { key: "ajutine-motte", label: "Ma ei tea, kas see on päris soov või ajutine mõte" },
  { key: "teiste-ootused", label: "Teiste ootused mõjutavad mind" },
  { key: "muu", label: "Muu" },
];

const affectedOptions: { key: string; label: string; followUp?: string }[] = [
  { key: "mind", label: "Mind ennast" },
  { key: "partnerit", label: "Partnerit", followUp: "Kuidas see otsus võiks partnerit või suhet mõjutada?" },
  { key: "perekonda", label: "Perekonda" },
  { key: "sopru", label: "Sõpru" },
  { key: "tooandja", label: "Tööandjat" },
  { key: "opingud", label: "Õpinguid" },
  { key: "raha", label: "Rahaasju", followUp: "Mis on suurim rahaline küsimus või risk?" },
  { key: "vaimne", label: "Vaimset heaolu", followUp: "Kuidas see otsus võib sinu enesetunnet või stressitaset mõjutada?" },
  { key: "igapaev", label: "Igapäevast elukorraldust" },
  { key: "tulevik", label: "Tulevikuplaane" },
  { key: "muu", label: "Muu" },
];

const valueOptions: { key: string; label: string; followUp?: string }[] = [
  { key: "vabadus", label: "Vabadus" },
  { key: "stabiilsus", label: "Stabiilsus" },
  { key: "areng", label: "Areng", followUp: "Milles sa tahaksid selle otsuse kaudu areneda?" },
  { key: "turvatunne", label: "Turvatunne", followUp: "Mis aitaks sul selles otsuses rohkem turvatunnet tunda?" },
  { key: "lahedus", label: "Lähedus", followUp: "Kuidas lähedus selles otsuses väljendub?" },
  { key: "iseseisvus", label: "Iseseisvus" },
  { key: "tervis", label: "Tervis" },
  { key: "raha", label: "Raha" },
  { key: "loovus", label: "Loovus" },
  { key: "teadmised", label: "Teadmised" },
  { key: "tahenduslikkus", label: "Tähenduslikkus" },
  { key: "seiklus", label: "Seiklus" },
  { key: "aitamine", label: "Teiste aitamine" },
  { key: "rahu", label: "Rahu" },
  { key: "kuuluvus", label: "Kuuluvustunne" },
  { key: "muu", label: "Muu" },
];

const ratingItems: { key: keyof DecisionData["ratings"]; title: string; question: string }[] = [
  { key: "valuesFit", title: "Väärtustega sobivus", question: "Kui hästi see valik sobib sellega, mis on mulle oluline?" },
  { key: "intrinsic", title: "Sisemine huvi", question: "Kui palju see soov tuleb minu enda huvist, mitte teiste survest?" },
  { key: "longTerm", title: "Pikaajaline tähendus", question: "Kui oluline võiks see valik olla mulle ka aasta pärast?" },
  { key: "realism", title: "Realistlikkus", question: "Kui teostatav see praegu on aja, raha, energia ja võimaluste mõttes?" },
  { key: "capability", title: "Hakkamasaamise tunne", question: "Kui palju ma tunnen, et suudan sellega toime tulla?" },
  { key: "relationships", title: "Suhete mõju", question: "Kui hästi see sobib minu oluliste suhete ja lähedaste vajadustega?" },
  { key: "testability", title: "Katsetatavus", question: "Kui hästi saan seda enne lõplikku otsust väiksemas mahus proovida?" },
  { key: "stress", title: "Stressitase", question: "Kui palju see otsus mind praegu koormab?" },
  { key: "regret", title: "Kahetsuse hirm", question: "Kui palju mind takistab hirm hiljem kahetseda?" },
  { key: "info", title: "Info piisavus", question: "Kui palju mul on praegu infot otsustamiseks?" },
];

// ---------- Component ----------

function Flow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<DecisionData>(emptyData());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadData());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) saveData(data);
  }, [data, hydrated]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const next = () => {
    if (step < TOTAL) setStep(step + 1);
    else navigate({ to: "/tulemus" });
  };
  const prev = () => step > 1 && setStep(step - 1);

  const canNext = useMemo(() => {
    if (step === 1) return !!data.area && (data.area !== "Muu" || data.areaCustom.trim().length > 0);
    if (step === 3) return data.decision.trim().length > 0;
    return true;
  }, [step, data]);

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-16">
      <ProgressBar step={step} total={TOTAL} />

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(60,40,120,0.04)] sm:p-9">
        {step === 1 && <Step1 data={data} setData={setData} />}
        {step === 2 && <Step2 data={data} setData={setData} />}
        {step === 3 && <Step3 data={data} setData={setData} />}
        {step === 4 && (
          <StepSelectable
            title="Mis sind selle mõtte poole tõmbab?"
            text="Vali põhjused, mis selle valiku sinu jaoks huvitavaks või oluliseks teevad."
            microcopy="Vali see, mis sind päriselt kõnetab. Kui sobivat varianti ei ole, lisa oma sõnadega."
            options={attractionOptions}
            selected={data.attractions}
            onChange={(v) => setData({ ...data, attractions: v })}
          />
        )}
        {step === 5 && (
          <StepSelectable
            title="Mis sind tagasi hoiab?"
            text="Siia ei pea märkima ainult praktilisi põhjuseid. Ka hirmud, kahtlused ja ebamugavad mõtted on otsuse osa."
            microcopy="Sa ei pea vastama täiuslikult."
            options={holdBackOptions}
            selected={data.holdBacks}
            onChange={(v) => setData({ ...data, holdBacks: v })}
          />
        )}
        {step === 6 && (
          <StepSelectable
            title="Keda või mida see otsus puudutab?"
            text="Mõned otsused puudutavad ainult sind, teised mõjutavad ka suhteid, raha, õpinguid või igapäevast elukorraldust."
            defaultFollowUp="Kuidas see otsus seda inimest või valdkonda mõjutada võib?"
            options={affectedOptions}
            selected={data.affected}
            onChange={(v) => setData({ ...data, affected: v })}
          />
        )}
        {step === 7 && (
          <StepSelectable
            title="Mis on sulle selles otsuses päriselt oluline?"
            text="Vali kuni kolm väärtust, mis tunduvad selle otsuse puhul kõige olulisemad."
            microcopy="See ei ole lõplik otsus, vaid mõtte kaardistamine."
            defaultFollowUp="Kuidas see väärtus selles otsuses väljendub?"
            options={valueOptions}
            selected={data.values}
            onChange={(v) => setData({ ...data, values: v })}
            maxSelect={3}
          />
        )}
        {step === 8 && <Step8 data={data} setData={setData} />}
        {step === 9 && <Step9 data={data} setData={setData} />}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={prev}
          disabled={step === 1}
          className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-navy transition disabled:opacity-40 hover:bg-accent/20"
        >
          ← Tagasi
        </button>
        <button
          onClick={next}
          disabled={!canNext}
          className="rounded-full bg-violet-deep px-6 py-2.5 text-sm font-medium text-primary-foreground transition disabled:opacity-40 hover:opacity-90"
        >
          {step === TOTAL ? "Vaata oma otsuse kaarti" : "Edasi →"}
        </button>
      </div>
    </main>
  );
}

// ---------- Sub-components ----------

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Samm {step}/{total}</span>
        <span>Umbes 5–7 minutit</span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-lavender">
        <div
          className="h-full bg-violet-deep transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function StepHeader({ title, text, micro }: { title: string; text?: string; micro?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">{title}</h2>
      {text && <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{text}</p>}
      {micro && <p className="mt-2 text-xs italic text-violet-soft">{micro}</p>}
    </div>
  );
}

// Step 1
function Step1({ data, setData }: { data: DecisionData; setData: (d: DecisionData) => void }) {
  return (
    <>
      <StepHeader
        title="Mis valdkonnaga sinu otsus seotud on?"
        text="Vali kõige lähedasem teema. Kui otsus puudutab mitut valdkonda, vali see, mis tundub hetkel kõige olulisem."
      />
      <div className="grid gap-2 sm:grid-cols-2">
        {areaOptions.map((opt) => {
          const active = data.area === opt;
          return (
            <button
              key={opt}
              onClick={() => setData({ ...data, area: opt })}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                active
                  ? "border-violet-deep bg-lavender/50 text-navy"
                  : "border-border bg-card text-foreground hover:border-periwinkle hover:bg-lavender/20"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {data.area === "Muu" && (
        <div className="mt-4">
          <label className="text-sm font-medium text-navy">Kirjuta oma valdkond.</label>
          <input
            value={data.areaCustom}
            onChange={(e) => setData({ ...data, areaCustom: e.target.value })}
            className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:border-violet-soft focus:outline-none"
            placeholder="Nt vabatahtlik töö, loomeprojekt…"
          />
        </div>
      )}
    </>
  );
}

// Step 2
function Step2({ data, setData }: { data: DecisionData; setData: (d: DecisionData) => void }) {
  return (
    <>
      <StepHeader title="Kuidas see otsus praegu tundub?" />
      <Slider
        label="Kui suure kaaluga see otsus sulle praegu tundub?"
        value={data.weight}
        onChange={(v) => setData({ ...data, weight: v })}
        minLabel="pigem väike"
        maxLabel="väga suure kaaluga"
      />
      <div className="mt-8">
        <Slider
          label="Kui segane see otsus praegu sinu peas on?"
          value={data.confusion}
          onChange={(v) => setData({ ...data, confusion: v })}
          minLabel="üsna selge"
          maxLabel="väga segane"
        />
      </div>
    </>
  );
}

// Step 3
function Step3({ data, setData }: { data: DecisionData; setData: (d: DecisionData) => void }) {
  const [mode, setMode] = useState<"write" | "voice">("write");
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);

  const startVoice = () => {
    const SR = (typeof window !== "undefined") && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    if (!SR) {
      setVoiceSupported(false);
      return;
    }
    const rec = new SR();
    rec.lang = "et-EE";
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setData({ ...data, decision: (data.decision ? data.decision + " " : "") + text });
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  };

  return (
    <>
      <StepHeader
        title="Mis mõte sul peas keerleb?"
        text="Kirjuta või ütle ühe lausega, millist otsust sa tahad läbi mõelda. See ei pea olema täiuslikult sõnastatud."
        micro="Kirjuta nii, nagu mõte praegu peas on."
      />

      <div className="mb-4 inline-flex rounded-full border border-border bg-card p-1 text-xs">
        <button
          onClick={() => setMode("write")}
          className={`rounded-full px-3 py-1.5 ${mode === "write" ? "bg-lavender text-navy" : "text-muted-foreground"}`}
        >
          Kirjutan ise
        </button>
        <button
          onClick={() => setMode("voice")}
          className={`rounded-full px-3 py-1.5 ${mode === "voice" ? "bg-lavender text-navy" : "text-muted-foreground"}`}
        >
          Räägin häälega
        </button>
      </div>

      <label className="block text-sm font-medium text-navy">Ma mõtlen, kas…</label>
      <textarea
        value={data.decision}
        onChange={(e) => setData({ ...data, decision: e.target.value })}
        placeholder="Ma mõtlen, kas minna välismaale elama."
        rows={4}
        className="mt-2 w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm leading-relaxed focus:border-violet-soft focus:outline-none"
      />

      {mode === "voice" && (
        <div className="mt-3">
          <button
            onClick={startVoice}
            className="inline-flex items-center gap-2 rounded-full border border-violet-soft bg-lavender/30 px-4 py-2 text-sm text-navy hover:bg-lavender/60"
          >
            <span className={`h-2 w-2 rounded-full ${listening ? "bg-violet-deep animate-pulse" : "bg-violet-soft"}`} />
            {listening ? "Kuulan…" : "Salvesta mõte"}
          </button>
          {!voiceSupported && (
            <p className="mt-2 text-xs italic text-muted-foreground">
              Häälsisestus on prototüübis näidisfunktsioon — kasuta kirjutamist.
            </p>
          )}
        </div>
      )}
    </>
  );
}

// Generic selectable step (4, 5, 6, 7)
function StepSelectable({
  title, text, microcopy,
  options, selected, onChange,
  defaultFollowUp = "Miks see sinu puhul oluline on?",
  maxSelect,
}: {
  title: string;
  text?: string;
  microcopy?: string;
  options: { key: string; label: string; followUp?: string }[];
  selected: SelectedItem[];
  onChange: (v: SelectedItem[]) => void;
  defaultFollowUp?: string;
  maxSelect?: number;
}) {
  const toggle = (opt: { key: string; label: string }) => {
    const exists = selected.find((s) => s.key === opt.key);
    if (exists) {
      onChange(selected.filter((s) => s.key !== opt.key));
    } else {
      if (maxSelect && selected.length >= maxSelect) return;
      onChange([...selected, { key: opt.key, label: opt.label, note: "" }]);
    }
  };

  const updateNote = (key: string, note: string) => {
    onChange(selected.map((s) => (s.key === key ? { ...s, note } : s)));
  };
  const updateMuuLabel = (label: string) => {
    onChange(selected.map((s) => (s.key === "muu" ? { ...s, label: label || "Muu" } : s)));
  };

  return (
    <>
      <StepHeader title={title} text={text} micro={microcopy} />
      {maxSelect && (
        <p className="-mt-3 mb-4 text-xs text-violet-soft">
          Valitud {selected.length}/{maxSelect}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = !!selected.find((s) => s.key === opt.key);
          const disabled = !active && maxSelect ? selected.length >= maxSelect : false;
          return (
            <button
              key={opt.key}
              onClick={() => toggle(opt)}
              disabled={disabled}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                active
                  ? "border-violet-deep bg-violet-deep text-primary-foreground"
                  : disabled
                  ? "border-border bg-card text-muted-foreground opacity-50"
                  : "border-border bg-card text-foreground hover:border-periwinkle hover:bg-lavender/30"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="mt-6 space-y-4">
          {selected.map((s) => {
            const def = options.find((o) => o.key === s.key);
            const followUp = def?.followUp || defaultFollowUp;
            return (
              <div key={s.key} className="rounded-xl border border-border bg-lavender/15 p-4">
                {s.key === "muu" && (
                  <div className="mb-3">
                    <label className="text-xs font-medium text-navy">Lisa oma sõnadega:</label>
                    <input
                      value={s.label === "Muu" ? "" : s.label}
                      onChange={(e) => updateMuuLabel(e.target.value)}
                      placeholder="Kirjuta siia…"
                      className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-violet-soft focus:outline-none"
                    />
                  </div>
                )}
                <label className="text-xs font-medium text-navy">
                  {s.key !== "muu" ? s.label + " — " : ""}{followUp}
                </label>
                <textarea
                  value={s.note}
                  onChange={(e) => updateNote(s.key, e.target.value)}
                  rows={2}
                  placeholder="Paar sõna piisab…"
                  className="mt-1 w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm leading-relaxed focus:border-violet-soft focus:outline-none"
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// Step 8
function Step8({ data, setData }: { data: DecisionData; setData: (d: DecisionData) => void }) {
  const cols: { key: "nonNegotiable" | "flexible" | "needsDiscussion"; title: string; sub: string; placeholders: string[] }[] = [
    {
      key: "nonNegotiable", title: "Mittekaubeldav", sub: "Asjad, millest sa ei taha loobuda.",
      placeholders: ["tahan hoida oma suhet", "tahan vältida suurt rahalist riski", "tahan säilitada vaimset heaolu"],
    },
    {
      key: "flexible", title: "Paindlik", sub: "Asjad, mida saab muuta või kohandada.",
      placeholders: ["ajastus", "kestus", "riik või linn", "töövorm"],
    },
    {
      key: "needsDiscussion", title: "Vajab arutamist", sub: "Asjad, mida ei saa üksi otsustada või mis vajavad rohkem infot.",
      placeholders: ["partneriga kokkulepped", "raha", "töökorraldus", "tagasituleku plaan"],
    },
  ];

  return (
    <>
      <StepHeader
        title="Mis peab alles jääma ja milles saad paindlik olla?"
        text="Suur otsus ei pea alati olema jah/ei. Mõnikord tekib selgus siis, kui eristad, mis on vältimatu ja mille osas saab otsida kompromissi."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {cols.map((c) => (
          <ColumnEditor
            key={c.key}
            title={c.title}
            subtitle={c.sub}
            items={data[c.key]}
            placeholder={c.placeholders.join(", ")}
            onAdd={(v) => setData({ ...data, [c.key]: [...data[c.key], v] })}
            onRemove={(i) => setData({ ...data, [c.key]: data[c.key].filter((_, idx) => idx !== i) })}
          />
        ))}
      </div>
    </>
  );
}

function ColumnEditor({
  title, subtitle, items, placeholder, onAdd, onRemove,
}: {
  title: string; subtitle: string; items: string[]; placeholder: string;
  onAdd: (v: string) => void; onRemove: (i: number) => void;
}) {
  const [v, setV] = useState("");
  const submit = () => {
    if (v.trim()) { onAdd(v.trim()); setV(""); }
  };
  return (
    <div className="rounded-xl border border-border bg-lavender/15 p-4">
      <h3 className="font-serif text-base font-semibold text-navy">{title}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-3 space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="group flex items-center justify-between rounded-lg border border-border bg-card px-3 py-1.5 text-sm">
            <span>{it}</span>
            <button onClick={() => onRemove(i)} className="text-xs text-muted-foreground hover:text-violet-deep" aria-label="Kustuta">
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), submit())}
          placeholder={`nt ${placeholder.split(",")[0]}`}
          className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-violet-soft focus:outline-none"
        />
        <button onClick={submit} className="rounded-lg bg-violet-deep px-3 py-2 text-xs text-primary-foreground hover:opacity-90">
          Lisa
        </button>
      </div>
    </div>
  );
}

// Step 9
function Step9({ data, setData }: { data: DecisionData; setData: (d: DecisionData) => void }) {
  return (
    <>
      <StepHeader
        title="Hinda seda otsust mõne nurga alt"
        text="Need hinnangud aitavad hiljem visuaalselt näidata, mis mõjutab sinu otsust kõige tugevamalt."
        micro="Eesmärk ei ole täiuslik vastus, vaid natuke rohkem selgust."
      />
      <div className="space-y-7">
        {ratingItems.map((it) => (
          <div key={it.key}>
            <div className="mb-1 text-sm font-medium text-navy">{it.title}</div>
            <Slider
              label={it.question}
              value={data.ratings[it.key]}
              onChange={(v) => setData({ ...data, ratings: { ...data.ratings, [it.key]: v } })}
              minLabel="vähe"
              maxLabel="palju"
            />
          </div>
        ))}
      </div>
    </>
  );
}

function Slider({ label, value, onChange, minLabel, maxLabel }: {
  label: string; value: number; onChange: (v: number) => void; minLabel: string; maxLabel: string;
}) {
  return (
    <div>
      <p className="text-sm text-foreground/85">{label}</p>
      <input
        type="range" min={1} max={5} step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="mt-3 w-full accent-violet-deep"
      />
      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>1 — {minLabel}</span>
        <span className="font-medium text-violet-deep">{value}</span>
        <span>5 — {maxLabel}</span>
      </div>
    </div>
  );
}
