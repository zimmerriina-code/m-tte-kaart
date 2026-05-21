import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privaatsus")({
  head: () => ({
    meta: [
      { title: "Privaatsus — Otsuse kaart" },
      { name: "description", content: "Otsuse kaart ei nõua sisselogimist ega salvesta vastuseid püsivalt." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="font-serif text-4xl font-semibold text-navy sm:text-5xl">Privaatsus</h1>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/85">
        <p>
          Otsuse kaart ei nõua sisselogimist ega kogu kasutajaprofiili andmeid. Vastuseid
          kasutatakse ainult selleks, et luua sinu otsuse kaart käesoleva kasutussessiooni
          jooksul.
        </p>
        <p>
          Vastuseid ei salvestata püsivalt. Kui sulged lehe või alustad uuesti, ei tohiks
          eelmised vastused olla järgmisele kasutajale nähtavad.
        </p>
        <p>
          Kui soovid tulemuse alles hoida, laadi otsuse kaart lõpus PDF-ina alla.
        </p>
        <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          Ära sisesta tundlikke isikuandmeid, mida sa ei soovi tööriistas töödelda.
        </p>
      </div>
    </main>
  );
}
