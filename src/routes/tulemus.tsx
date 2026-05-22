import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { clearData, loadData, type DecisionData } from "../lib/decision-store";
import { buildInterpretation } from "../lib/interpretation";
import { buildMapItems, DecisionMap } from "../components/DecisionMap";
import { generatePdf } from "../lib/pdf";

export const Route = createFileRoute("/tulemus")({
  head: () => ({
    meta: [
      { title: "Sinu otsuse kaart — Otsuse kaart" },
      { name: "description", content: "Visuaalne kokkuvõte sellest, mis sinu otsust mõjutab." },
    ],
  }),
  component: Result,
});

function Result() {
  const [data, setData] = useState<DecisionData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setData(loadData());
  }, []);

  const interp = useMemo(() => (data ? buildInterpretation(data) : null), [data]);
  const items = useMemo(() => (data ? buildMapItems(data) : []), [data]);
  const firstStep = interp?.nextSteps[0];

  if (!data) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="text-muted-foreground">Laen…</p>
      </main>
    );
  }

  if (!data.decision) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold text-navy">
          Otsuse kaarti pole veel loodud
        </h1>
        <p className="mt-4 text-muted-foreground">
          Alusta kaardistamist, et näha visuaalset kokkuvõtet.
        </p>
        <Link
          to="/kaardista"
          className="mt-8 inline-flex rounded-full bg-violet-deep px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Kaardista oma mõte
        </Link>
      </main>
    );
  }

  const onDownload = () => {
    if (interp) generatePdf(data, interp);
  };

  const onRestart = () => {
    clearData();
    navigate({ to: "/kaardista" });
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold text-navy sm:text-5xl">
            Sinu mõttekaart
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Vaata, mis sinu otsust enim mõjutab ja mida tasub enne otsust kaaluda.
          </p>
        </div>
        <button
          onClick={onDownload}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-navy shadow-sm transition hover:border-violet-soft hover:bg-accent/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Laadi PDF alla
        </button>
      </header>

      {/* Map */}
      <section className="mt-12">
        <DecisionMap
          centerText={data.decision}
          items={items}
          nextStepTitle={firstStep?.title}
          nextStepText={firstStep?.text}
          nextRationale={firstStep?.rationale}
          nextExamples={firstStep?.examples}
        />
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Klõpsa elemendil, et näha üksikasju. Suurus näitab, kui tugevalt see vastuste põhjal mõjutab.
        </p>
      </section>

      {/* 3 summary cards — mockup-style */}
      <section className="mt-16 grid gap-5 sm:grid-cols-3">
        <SummaryCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4a7 7 0 0 1 7 7c0 4-3.5 6-7 6s-7-2-7-6a7 7 0 0 1 7-7z" />
              <path d="M11 11v6" />
            </svg>
          }
          title="Mida kaart näitab?"
        >
          <p>
            Kaart toob esile, mis sinu otsust kõige enam kujundab — sinu olulised
            väärtused, peamised tõmbed ja kõhklused. See ei ütle, mida valida,
            vaid aitab näha mustreid.
          </p>
        </SummaryCard>

        <SummaryCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6h13M8 12h13M8 18h13" />
              <circle cx="4" cy="6" r="1" fill="currentColor" />
              <circle cx="4" cy="12" r="1" fill="currentColor" />
              <circle cx="4" cy="18" r="1" fill="currentColor" />
            </svg>
          }
          title="Kuidas edasi?"
        >
          {interp && interp.nextSteps.length > 0 ? (
            <ol className="space-y-2">
              {interp.nextSteps.slice(0, 3).map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lavender text-[11px] font-medium text-violet-deep">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/85">{s.title}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p>Vali üks väike samm, mida sel nädalal proovida või uurida.</p>
          )}
        </SummaryCard>

        <SummaryCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
            </svg>
          }
          title="Hea meeles pidada"
        >
          <ul className="space-y-2">
            {[
              "Sa ei pea kõike täna otsustama.",
              "Kahtlused on loomulik osa protsessist.",
              "Selgus tuleb vestlusest ja kogemusest.",
            ].map((t, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
                <svg className="mt-1 shrink-0 text-violet-deep" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </SummaryCard>
      </section>

      {/* Deeper interpretation */}
      <section className="mt-16 rounded-2xl border border-border bg-card p-7 sm:p-10">
        <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">
          Mida see kaart võib näidata?
        </h2>
        <p className="mt-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
          {interp?.summary}
        </p>
      </section>

      {/* Next steps — expanded */}
      {interp && interp.nextSteps.length > 0 && (
        <section className="mt-14">
          <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">Võimalikud sammud</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Need on võimalikud väikesed sammud — mitte ettekirjutused. Vali see, mis tundub praegu jõukohane.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {interp.nextSteps.map((s, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 sm:p-7">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-violet-soft">
                  Samm {i + 1}
                </p>
                <h3 className="mt-2 font-serif text-xl font-semibold text-navy">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/85 sm:text-base">{s.text}</p>
                {s.rationale && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.rationale}</p>
                )}
                {s.examples && s.examples.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {s.examples.map((ex, j) => (
                      <li key={j} className="flex gap-2.5 text-sm text-foreground/80">
                        <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-violet-soft" />
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reflection */}
      {interp && interp.reflectionQuestions.length > 0 && (
        <section className="mt-14 rounded-2xl border border-border/60 bg-lavender/25 p-7 sm:p-10">
          <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Küsimused edasiseks mõtlemiseks
          </h2>
          <ul className="mt-5 space-y-3">
            {interp.reflectionQuestions.map((q, i) => (
              <li key={i} className="flex gap-3 text-base leading-relaxed text-navy/90 sm:text-lg">
                <span className="mt-1 text-violet-deep">—</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Bottom save / actions */}
      <section className="mt-16 rounded-2xl border border-border bg-card p-7 text-center sm:p-10">
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Kui soovid oma kaardi alles hoida, laadi see PDF-ina alla. Pärast lehe sulgemist
          vastuseid ei salvestata.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onDownload}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-deep px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 sm:w-auto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Laadi otsuse kaart PDF-ina alla
          </button>
          <Link
            to="/kaardista"
            className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-navy hover:bg-accent/30 sm:w-auto"
          >
            Muuda vastuseid
          </Link>
          <button
            onClick={onRestart}
            className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-navy hover:bg-accent/30 sm:w-auto"
          >
            Alusta uuesti
          </button>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lavender/70 text-violet-deep">
        {icon}
      </div>
      <h3 className="mt-4 font-serif text-lg font-semibold text-navy sm:text-xl">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed text-foreground/85">{children}</div>
    </div>
  );
}
