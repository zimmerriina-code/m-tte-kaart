import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/abi")({
  head: () => ({
    meta: [
      { title: "Abi — Otsuse kaart" },
      { name: "description", content: "Otsuse kaardi taust, kontakt ja kasutusjuhend." },
    ],
  }),
  component: Page,
});

const steps = [
  "Kirjelda otsust, mille üle mõtled",
  "Märgi, mis sind tõmbab ja mis tagasi hoiab",
  "Vali väärtused ja mõjupiirkonnad",
  "Hinda otsust rahulikult mõnel skaalal",
  "Vaata oma visuaalset otsuse kaarti",
  "Mõtle läbi väike järgmine samm",
  "Soovi korral laadi kokkuvõte PDF-ina alla",
];

function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="font-serif text-4xl font-semibold text-navy sm:text-5xl">Abi</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Otsuse kaart on lühike eneserefleksiooni teekond. Sa vastad rahulikult kuni 9 sammule
        ning saad lõpuks visuaalse kokkuvõtte sellest, mis sinu otsust kõige rohkem mõjutab.
      </p>

      {/* Background */}
      <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-7">
        <h2 className="font-serif text-lg font-semibold text-navy">Projekti taust</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85">
          Otsuse kaart on loodud õppetöö jaoks Tartu Ülikooli aine „Digitaalne maailmapilt“ raames.
        </p>
      </section>

      {/* Contact */}
      <section className="mt-4 rounded-2xl border border-border bg-card p-6 sm:p-7">
        <h2 className="font-serif text-lg font-semibold text-navy">Kontakt</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85">
          Riina Zimmer ·{" "}
          <a href="mailto:riinazim@ut.ee" className="text-violet-deep underline-offset-4 hover:underline">
            riinazim@ut.ee
          </a>
        </p>
      </section>

      {/* Disclaimer */}
      <section className="mt-4 rounded-2xl border border-border/60 bg-lavender/30 p-6 sm:p-7">
        <h2 className="font-serif text-lg font-semibold text-navy">Oluline märkus</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/85">
          Otsuse kaart ei tee otsust kasutaja eest ega asenda professionaalset nõustamist.
          Tegemist on eneseanalüüsi tööriistaga, mis aitab mõtteid struktureerida ja
          otsustamist rahulikumaks muuta.
        </p>
      </section>

      {/* How it works */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-navy">Kuidas see toimib?</h2>
        <ol className="mt-5 space-y-2.5">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lavender text-sm font-medium text-violet-deep">
                {i + 1}
              </span>
              <span className="text-sm text-foreground/90">{s}</span>
            </li>
          ))}
        </ol>
      </section>

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
