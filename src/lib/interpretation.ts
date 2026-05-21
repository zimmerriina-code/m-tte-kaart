import type { DecisionData } from "./decision-store";

export interface NextStep {
  title: string;
  text: string;
  rationale?: string;     // why this step is reasonable
  examples?: string[];    // concrete practical examples
}

export interface Interpretation {
  summary: string;
  nextSteps: NextStep[];
  reflectionQuestions: string[];
}

export function buildInterpretation(d: DecisionData): Interpretation {
  const partnerAffected = d.affected.some((a) => a.key === "partnerit");
  const familyAffected = d.affected.some((a) => a.key === "pere" || a.key === "lapsi");
  const relationshipFear = d.holdBacks.some((h) => h.key === "suhe-moju" || h.key === "partner-ei-toeta");
  const lowInfo = d.ratings.info <= 2;
  const highStress = d.ratings.stress >= 4;
  const highRegret = d.ratings.regret >= 4;
  const highTestability = d.ratings.testability >= 4;
  const highValuesFit = d.ratings.valuesFit >= 4;
  const lowRealism = d.ratings.realism <= 2;
  const tooFinal = d.holdBacks.some((h) => h.key === "liiga-loplik");
  const notEnoughInfo = d.holdBacks.some((h) => h.key === "ei-ole-infot");
  const financialFear = d.holdBacks.some((h) => h.key === "raha" || h.key === "rahaline-risk");

  const steps: NextStep[] = [];

  if (partnerAffected || relationshipFear) {
    steps.push({
      title: "Alusta vestlusest",
      text: "Ava otsus turvaliselt koos lähedasega, enne kui teed lõpliku valiku.",
      rationale:
        "Praegu ei pruugi esimene samm olla otsuse lõplik tegemine, vaid selle turvaline avamine. Kui otsus puudutab ka partnerit või lähedast inimest, võib vestlus aidata selgitada, millised ootused, hirmud ja piirid on mõlemal poolel. See võib vähendada ebamäärasust ja näidata, kas enne suurt otsust on võimalik katsetada väiksemat või paindlikumat varianti.",
      examples: [
        "leppige kokku rahulik aeg vestluseks",
        "rääkige eraldi ootustest ja hirmudest",
        "kaardistage, mis on mittekaubeldav ja mis on paindlik",
        "mõelge väikesele prooviversioonile enne lõplikku otsust",
      ],
    });
  }
  if (lowInfo || notEnoughInfo) {
    steps.push({
      title: "Kogu enne otsust rohkem infot",
      text: "Pane kirja kolm konkreetset küsimust, millele praegu vastust pole.",
      rationale:
        "Kui infot on vähe, võib kõhklus tulla pigem ebaselgusest kui valiku enda sisust. Konkreetsete küsimuste sõnastamine aitab näha, mis on tegelikult teada ja mida tasub enne suuremat sammu uurida.",
      examples: [
        "kirjuta üles kolm asja, mida sa veel ei tea",
        "leia üks inimene, kes on midagi sarnast läbi elanud",
        "uuri ühte praktilist tingimust korraga (aeg, raha, tugi)",
      ],
    });
  }
  if (highStress && highRegret) {
    steps.push({
      title: "Vähenda otsuse suurust",
      text: "Sõnasta valik mitte lõpliku otsusena, vaid väikese katsetusena.",
      rationale:
        "Kui pinge on suur ja hirm kahetseda tugev, võib otsus tunduda ühe sammuna, mida ei saa tagasi võtta. Sageli on võimalik leida sama mõtte väiksem versioon, mis annab kogemuse ilma kogu riskita.",
      examples: [
        "määra ajaline piir, mille jooksul midagi proovida",
        "alusta ühest väiksemast osast suuremast plaanist",
        "lepi endaga kokku punkt, kus uuesti hindad",
      ],
    });
  }
  if (highTestability) {
    steps.push({
      title: "Proovi väikest testversiooni",
      text: "Katseta seda mõtet lühema perioodi või väiksema riskiga.",
      rationale:
        "Kui valikut saab katsetada, ei pea otsus algusest peale olema lõplik. Väike test annab päris kogemuse, mille põhjal hilisem otsus on tugevamal pinnal.",
      examples: [
        "vali lühike periood, mille jooksul proovida",
        "lepi endaga kokku, mille põhjal hindad, kas töötab",
      ],
    });
  }
  if (highValuesFit && lowRealism) {
    steps.push({
      title: "Tee realistlik plaan",
      text: "Vaata üle aeg, raha, tugi ja praktilised tingimused.",
      rationale:
        "Kui valik tundub väärtustega kooskõlas, kuid praktiliselt raske, võib esimene samm olla mitte loobumine, vaid plaani konkreetsemaks tegemine.",
      examples: [
        "pane kirja vajalikud ressursid",
        "vaata, kus saab tuge küsida",
        "leia üks tingimus, mida saaks juba praegu lahendada",
      ],
    });
  }
  if (financialFear) {
    steps.push({
      title: "Selgita rahalist pilti",
      text: "Pane kirja, mis on teada ja mis ebaselge — raha või turvatunne?",
      rationale:
        "Rahaline mure ei pruugi tähendada ainult numbreid, vaid ka vajadust turvatunde ja ettearvatavuse järele. Selgem pilt aitab eristada, kas kahtlus tuleb valiku sisust või puuduvast infost.",
      examples: [
        "arvuta läbi üks halvim ja üks realistlik stsenaarium",
        "uuri, milline tugi või puhver on olemas",
      ],
    });
  }
  if (steps.length === 0) {
    steps.push({
      title: "Leia üks väike järgmine samm",
      text: "Sa ei pea otsustama kõike korraga. Vali üks asi, mida sel nädalal proovida või uurida.",
      rationale:
        "Sageli ei ole vaja kohe lõplikku otsust. Üks väike, konkreetne samm liigutab mõtet edasi rohkem kui pikk kaalutlemine.",
      examples: [
        "vali üks tegevus sel nädalal",
        "räägi sellest ühe usaldusväärse inimesega",
      ],
    });
  }

  const attracts = d.attractions.slice(0, 2).map((a) => a.label.toLowerCase()).join(" ja ");
  const holds = d.holdBacks.slice(0, 2).map((a) => a.label.toLowerCase()).join(" ja ");
  const values = d.values.map((v) => v.label.toLowerCase()).join(", ");

  let summary = "Sinu vastuste põhjal tundub, ";
  if (attracts && holds) {
    summary += `et seda otsust mõjutavad korraga nii ${attracts}, kui ka ${holds}. `;
  } else if (attracts) {
    summary += `et seda valikut tõmbab esile eelkõige ${attracts}. `;
  } else {
    summary += `et see otsus on sinu jaoks praegu oluline. `;
  }
  if (values) {
    summary += `Olulisteks väärtusteks tunduvad ${values}. `;
  }
  if (highValuesFit) {
    summary += "Valik tundub sinu väärtustega üsna kooskõlas. ";
  }
  if (tooFinal) {
    summary += "Otsus võib praegu tunduda väga lõplikuna — sageli aitab seda näha pigem katsetuse või järgmise sammuna, mitte kogu elu määrava valikuna. ";
  }
  if (notEnoughInfo || lowInfo) {
    summary += "Võib olla, et järgmine samm ei ole otsustamine ise, vaid pigem info kogumine. ";
  }
  if (partnerAffected || familyAffected) {
    summary += "Kuna otsus puudutab ka lähedasi, võib enne suuremat sammu olla kasulik ootused ja vajadused rahulikult koos läbi rääkida. ";
  }
  if (highStress) {
    summary += "Pinge tase on praegu kõrge — see ei tähenda, et otsus oleks vale, vaid et tasub leida hetk, kus saab rahulikumalt mõelda. ";
  }
  summary += "Seda tasub enne lõplikku otsust uurida väikeste sammude kaupa.";

  const reflection: string[] = [
    "Mis osa sellest otsusest on minu jaoks kõige olulisem?",
    "Kas see otsus on päriselt pöördumatu või tundub see praegu nii?",
    "Mis oleks selle mõtte kõige väiksem testversioon?",
  ];
  if (lowInfo) reflection.push("Millist infot mul veel vaja on, et tunda end kindlamana?");
  if (partnerAffected) reflection.push("Kelle vajadused peaksid selles otsuses veel nähtaval olema?");
  if (highStress) reflection.push("Mis aitaks mul selle teema juures pinget vähendada?");
  reflection.push("Kui ma ei peaks tegema ideaalset otsust, vaid piisavalt head järgmist sammu, mis see oleks?");

  return { summary, nextSteps: steps.slice(0, 4), reflectionQuestions: reflection.slice(0, 5) };
}
