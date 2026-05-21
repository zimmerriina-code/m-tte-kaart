import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privaatsus")({
  head: () => ({
    meta: [
      { title: "Privaatsus — Otsuse kaart" },
      { name: "description", content: "Otsuse kaart ei nõua sisselogimist ega kogu isikuandmeid." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="font-serif text-4xl font-semibold text-navy">Privaatsus</h1>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/85">
        <p>
          Otsuse kaart ei nõua sisselogimist ega kogu isikuandmeid. Vastuseid kasutatakse
          ainult sinu otsuse kaardi loomiseks sinu seadmes. Kui sulged lehe, vastuseid ei
          salvestata. Kui soovid tulemuse alles hoida, laadi see PDF-ina alla.
        </p>
        <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          Ära sisesta tundlikke isikuandmeid, mida sa ei soovi tööriistas töödelda.
        </p>
      </div>
    </main>
  );
}
