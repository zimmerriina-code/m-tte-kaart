import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/abi")({
  head: () => ({
    meta: [
      { title: "Abi — Otsuse kaart" },
      { name: "description", content: "Otsuse kaardi taust, kontakt ja kasutusjuhised." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="font-serif text-4xl font-semibold text-navy sm:text-5xl">Abi</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Lühike ülevaade projektist, kontaktist ja sellest, kuidas vastuseid käsitletakse.
      </p>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-7">
        <h2 className="font-serif text-lg font-semibold text-navy">Projekti taust</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85">
          Otsuse kaart on loodud õppetöö jaoks Tartu Ülikooli aine „Digitaalne maailmapilt“ raames.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-card p-6 sm:p-7">
        <h2 className="font-serif text-lg font-semibold text-navy">Kontakt</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85">
          Riina Zimmer ·{" "}
          <a href="mailto:riinazim@ut.ee" className="text-violet-deep underline-offset-4 hover:underline">
            riinazim@ut.ee
          </a>
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-border/60 bg-lavender/30 p-6 sm:p-7">
        <h2 className="font-serif text-lg font-semibold text-navy">Oluline märkus</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/85">
          Otsuse kaart ei tee otsust kasutaja eest ega asenda professionaalset nõustamist.
          Tegemist on eneseanalüüsi tööriistaga, mis aitab mõtteid struktureerida ja
          otsustamist rahulikumaks muuta.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-card p-6 sm:p-7">
        <h2 className="font-serif text-lg font-semibold text-navy">Vastused ja salvestamine</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85">
          Veebileht ei salvesta sinu vastuseid. Kui soovid oma tulemuse alles hoida, saad
          lõpus laadida otsuse kaardi PDF-ina alla.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/kaardista"
          className="inline-flex items-center justify-center rounded-full bg-violet-deep px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Kaardista oma mõte
        </Link>
        <Link
          to="/kuidas-see-toimib"
          className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-navy hover:bg-accent/30"
        >
          Kuidas see toimib?
        </Link>
      </div>
    </main>
  );
}
