import type { DecisionData } from "./decision-store";

export interface NextStep {
  title: string;
  text: string;
}

export interface Interpretation {
  summary: string;
  nextSteps: NextStep[];
  reflectionQuestions: string[];
}

export function buildInterpretation(d: DecisionData): Interpretation {
  const partnerAffected = d.affected.some((a) => a.key === "partnerit");
  const relationshipFear = d.holdBacks.some((h) => h.key === "suhe-moju");
  const lowInfo = d.ratings.info <= 2;
  const highStress = d.ratings.stress >= 4;
  const highRegret = d.ratings.regret >= 4;
  const highTestability = d.ratings.testability >= 4;
  const highValuesFit = d.ratings.valuesFit >= 4;
  const lowRealism = d.ratings.realism <= 2;
  const tooFinal = d.holdBacks.some((h) => h.key === "liiga-loplik");
  const notEnoughInfo = d.holdBacks.some((h) => h.key === "ei-ole-infot");

  const steps: NextStep[] = [];
  if (partnerAffected || relationshipFear) {
    steps.push({
      title: "Alusta vestlusest",
      text: "Selgita ootusi, piire ja võimalusi enne suuremat sammu.",
    });
  }
  if (lowInfo || notEnoughInfo) {
    steps.push({
      title: "Kogu enne otsust rohkem infot",
      text: "Pane kirja kolm küsimust, millele vajad vastust.",
    });
  }
  if (highStress && highRegret) {
    steps.push({
      title: "Vähenda otsuse suurust",
      text: "Sõnasta see mitte lõpliku valikuna, vaid väikese katsetusena.",
    });
  }
  if (highTestability) {
    steps.push({
      title: "Proovi väikest testversiooni",
      text: "Katseta seda ideed lühema perioodi või väiksema riskiga.",
    });
  }
  if (highValuesFit && lowRealism) {
    steps.push({
      title: "Tee realistlik plaan",
      text: "Uuri aega, raha, tuge ja praktilisi tingimusi enne suuremat otsust.",
    });
  }
  if (steps.length === 0) {
    steps.push({
      title: "Leia üks väike järgmine samm",
      text: "Sa ei pea otsustama kõike korraga. Vali üks asi, mida saad sel nädalal proovida või uurida.",
    });
  }

  const attracts = d.attractions.slice(0, 2).map((a) => a.label.toLowerCase()).join(" ja ");
  const holds = d.holdBacks.slice(0, 2).map((a) => a.label.toLowerCase()).join(" ja ");
  const values = d.values.map((v) => v.label.toLowerCase()).join(", ");

  let summary = "Sinu vastuste põhjal tundub, ";
  if (attracts && holds) {
    summary += `et seda otsust mõjutavad nii ${attracts}, kui ka ${holds}. `;
  } else if (attracts) {
    summary += `et seda valikut tõmbab esile eelkõige ${attracts}. `;
  } else {
    summary += `et see otsus on sinu jaoks praegu oluline. `;
  }
  if (values) {
    summary += `Olulisteks väärtusteks tunduvad ${values}. `;
  }
  if (tooFinal) {
    summary += "Otsus võib praegu tunduda väga lõplikuna — sageli aitab seda näha pigem katsetuse või järgmise sammuna, mitte kogu elu määrava valikuna. ";
  }
  if (notEnoughInfo) {
    summary += "Järgmine samm võib olla pigem info kogumine kui otsustamine ise. ";
  }
  if (partnerAffected) {
    summary += "Kuna otsus puudutab ka lähedasi, võib enne suuremat sammu olla kasulik vajadused ja ootused omavahel läbi rääkida.";
  }

  const reflection: string[] = [
    "Mis osa sellest otsusest on minu jaoks kõige olulisem?",
    "Kas see otsus on päriselt pöördumatu või tundub see praegu nii?",
    "Mis oleks selle mõtte kõige väiksem testversioon?",
  ];
  if (lowInfo) reflection.push("Millist infot mul veel vaja on?");
  if (partnerAffected) reflection.push("Kelle vajadused peaksid selles otsuses veel nähtaval olema?");
  reflection.push("Kui ma ei peaks tegema ideaalset otsust, vaid piisavalt head järgmist sammu, siis mis see oleks?");

  return { summary, nextSteps: steps.slice(0, 4), reflectionQuestions: reflection.slice(0, 5) };
}
