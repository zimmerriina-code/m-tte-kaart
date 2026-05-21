import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { loadData, type DecisionData } from "../lib/decision-store";
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

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-semibold text-navy sm:text-5xl">
          Sinu otsuse kaart
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
          Visuaalne kokkuvõte sellest, mis sinu mõtet praegu kõige rohkem mõjutab.
        </p>
      </header>

      {/* Map */}
      <section className="mt-10">
        <DecisionMap
          centerText={data.decision}
          items={items}
          nextStepTitle={firstStep?.title}
          nextStepText={firstStep?.text}
          nextRationale={firstStep?.rationale}
          nextExamples={firstStep?.examples}
        />
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Klõpsa elementidel, et näha üksikasju. Suurus näitab, kui tugevalt see vastuste põhjal mõjutab.
        </p>
      </section>

      {/* Interpretation */}
      <section className="mt-14 rounded-2xl border border-border bg-card p-7 sm:p-9">
        <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">
          Mida see kaart võib näidata?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-foreground/90">
          {interp?.summary}
        </p>

        {/* PDF button — prominent right after summary */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
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
        </div>
      </section>

      {/* Next steps */}
      {interp && interp.nextSteps.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-navy sm:text-3xl">Kuidas edasi?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Need on võimalikud väikesed sammud — mitte ettekirjutused. Vali see, mis tundub praegu jõukohane.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {interp.nextSteps.map((s, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-violet-soft">
                  Samm {i + 1}
                </p>
                <h3 className="mt-1.5 font-serif text-lg font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{s.text}</p>
                {s.rationale && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.rationale}
                  </p>
                )}
                {s.examples && s.examples.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {s.examples.map((ex, j) => (
                      <li key={j} className="flex gap-2 text-sm text-foreground/80">
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
        <section className="mt-10 rounded-2xl border border-border/60 bg-lavender/25 p-7 sm:p-9">
          <h2 className="font-serif text-2xl font-semibold text-navy">Küsimused edasiseks mõtlemiseks</h2>
          <ul className="mt-4 space-y-2.5">
            {interp.reflectionQuestions.map((q, i) => (
              <li key={i} className="flex gap-3 text-base text-navy/90">
                <span className="mt-0.5 text-violet-deep">—</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Bottom actions */}
      <section className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
      </section>
    </main>
  );
}
