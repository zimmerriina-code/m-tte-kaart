import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/abi")({
  head: () => ({
    meta: [
      { title: "Kuidas see toimib? — Otsuse kaart" },
      { name: "description", content: "Otsuse kaardi kasutusjuhend ja sammud." },
    ],
  }),
  component: Page,
});

const steps = [
  "Kirjelda otsust",
  "Märgi, mis sind tõmbab ja mis tagasi hoiab",
  "Vali väärtused ja mõjupiirkonnad",
  "Hinda otsust skaaladel",
  "Vaata visuaalset otsuse kaarti",
  "Mõtle läbi järgmised sammud",
  "Laadi kokkuvõte alla, kui soovid",
];

function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="font-serif text-4xl font-semibold text-navy">Kuidas see toimib?</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Otsuse kaart on lühike eneserefleksiooni teekond. Sa vastad rahulikult kuni 9 sammule
        ning saad lõpuks visuaalse kokkuvõtte sellest, mis sinu otsust kõige rohkem mõjutab.
      </p>

      <ol className="mt-10 space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
            <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lavender text-sm font-medium text-violet-deep">
              {i + 1}
            </span>
            <span className="text-foreground/90">{s}</span>
          </li>
        ))}
      </ol>

      <p className="mt-10 rounded-xl border border-border/60 bg-lavender/30 p-5 text-sm leading-relaxed text-navy/85">
        Tööriist ei anna valmis vastust. See aitab sul näha, mis sinu otsust mõjutab.
      </p>

      <div className="mt-10">
        <Link
          to="/kaardista"
          className="inline-flex items-center justify-center rounded-full bg-violet-deep px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Kaardista oma mõte
        </Link>
      </div>
    </main>
  );
}
