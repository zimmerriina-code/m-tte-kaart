import { createFileRoute, Link } from "@tanstack/react-router";
import { FlowingLines } from "../components/FlowingLines";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const scrollToExplain = () => {
    document.getElementById("selgitus")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero — fills first viewport, calm and centered */}
      <section className="relative flex min-h-[calc(100svh-65px)] items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <FlowingLines className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        </div>

        <div className="mx-auto w-full max-w-2xl px-5 py-16 text-center sm:px-8 sm:py-24">
          <h1 className="font-serif text-[2.5rem] leading-[1.08] font-semibold tracking-tight text-navy text-balance sm:text-6xl">
            Sa ei pea kohe teadma vastust.
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Otsuse kaart aitab sul lahti mõtestada suure või segase otsuse eri tahud
            ja näha selgemalt, mis seda mõjutab.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/kaardista"
              className="inline-flex w-full items-center justify-center rounded-full bg-violet-deep px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 sm:w-auto"
            >
              Kaardista oma mõte
            </Link>
            <button
              onClick={scrollToExplain}
              className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card/80 px-7 py-3.5 text-sm font-medium text-navy backdrop-blur-sm transition hover:bg-accent/30 sm:w-auto"
            >
              Uuri lähemalt
            </button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Võtab umbes 5–7 minutit. Vastuseid ei salvestata.
          </p>
        </div>
      </section>

      {/* Explanation */}
      <section id="selgitus" className="relative">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
          <h2 className="font-serif text-3xl font-semibold text-navy text-balance sm:text-4xl">
            Mõnikord tundub otsus liiga suur, liiga lõplik või liiga segane.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Otsuse kaart aitab sul hetkeks peatuda ja vaadata, mis sind selle mõtte poole
            tõmbab, mis tekitab kõhklust ning millised väärtused või praktilised asjaolud
            võivad valikut mõjutada.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {[
              { t: "Too mõtted nähtavale", b: "Kirjuta või räägi oma otsus välja ning märgi, mis sind selle poole tõmbab ja mis tekitab kõhklust." },
              { t: "Märka seoseid", b: "Näe, kuidas sinu väärtused, hirmud, suhted ja praktilised asjaolud võivad otsust koos mõjutada." },
              { t: "Leia järgmine väike samm", b: "Sa ei pea tegema lõplikku valikut. Mõnikord piisab sellest, et tead, mida järgmisena uurida, arutada või proovida." },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(60,40,120,0.04)]">
                <div className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-lavender text-xs font-medium text-violet-deep">
                  {i + 1}
                </div>
                <h3 className="font-serif text-lg font-semibold text-navy">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.b}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border/60 bg-lavender/30 p-6 text-sm leading-relaxed text-navy/80">
            Otsuse kaart ei tee otsust sinu eest ega asenda professionaalset nõustamist.
            See on eneseanalüüsi tööriist, mis aitab mõtteid struktureerida ja otsustamist rahulikumaks muuta.
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/kaardista"
              className="inline-flex items-center justify-center rounded-full bg-violet-deep px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
            >
              Kaardista oma mõte
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
