import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/kuidas-see-toimib")({
  head: () => ({
    meta: [
      { title: "Kuidas see toimib? — Otsuse kaart" },
      { name: "description", content: "Otsuse kaardi sammud ja tööpõhimõte." },
    ],
  }),
  component: Page,
});

const steps: { title: string; text: string }[] = [
  {
    title: "Sõnasta otsus",
    text: "Kirjuta või räägi välja mõte, mida tahad läbi mõelda. See ei pea olema täiuslikult sõnastatud.",
  },
  {
    title: "Too välja, mis sind tõmbab",
    text: "Märgi põhjused, mis muudavad selle valiku sinu jaoks huvitavaks, oluliseks või tähenduslikuks.",
  },
  {
    title: "Märka, mis sind tagasi hoiab",
    text: "Lisa ka hirmud, kõhklused ja praktilised takistused. Need aitavad mõista, miks otsus võib tunduda raske.",
  },
  {
    title: "Vali väärtused ja mõjutatud valdkonnad",
    text: "Vaata, millised väärtused, suhted või eluvaldkonnad on selle otsusega seotud.",
  },
  {
    title: "Hinda otsust mõne nurga alt",
    text: "Skaalad aitavad näha, kui tugevad on näiteks huvi, stress, realistlikkus, info piisavus või kahetsuse hirm.",
  },
  {
    title: "Vaata oma otsuse kaarti",
    text: "Tulemuseks saad visuaalse kaardi, mis koondab sinu mõtted, väärtused, mured ja võimalikud järgmised sammud.",
  },
  {
    title: "Laadi PDF alla",
    text: "Kui soovid tulemuse alles hoida, saad lõpus otsuse kaardi PDF-ina alla laadida. Vastuseid ei salvestata.",
  },
];

function Page() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="font-serif text-4xl font-semibold text-navy text-balance sm:text-5xl">
        Kuidas see toimib?
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        Otsuse kaart aitab sul ühe suure või segase otsuse rahulikult lahti mõtestada.
        Tööriist ei anna valmis vastust, vaid aitab sul märgata, mis sinu mõtet mõjutab
        ja milline võiks olla järgmine väike samm.
      </p>

      <ol className="mt-12 space-y-4">
        {steps.map((s, i) => (
          <li
            key={i}
            className="flex items-start gap-5 rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(60,40,120,0.04)]"
          >
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lavender text-sm font-medium text-violet-deep">
              {i + 1}
            </span>
            <div>
              <h2 className="font-serif text-lg font-semibold text-navy">{s.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-2xl border border-border/60 bg-lavender/30 p-6 text-sm leading-relaxed text-navy/85">
        Otsuse kaart ei tee otsust sinu eest ega asenda professionaalset nõustamist.
        See aitab mõtteid struktureerida ja otsustamist rahulikumaks muuta.
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/kaardista"
          className="inline-flex items-center justify-center rounded-full bg-violet-deep px-7 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Kaardista oma mõte
        </Link>
      </div>
    </main>
  );
}
