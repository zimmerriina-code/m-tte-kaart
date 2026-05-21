import jsPDF from "jspdf";
import type { DecisionData } from "./decision-store";
import type { Interpretation } from "./interpretation";

const NAVY: [number, number, number] = [50, 40, 95];
const VIOLET: [number, number, number] = [95, 80, 165];
const MUTED: [number, number, number] = [110, 105, 140];

export function generatePdf(d: DecisionData, interp: Interpretation) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;
  let y = M;

  const ensure = (need: number) => {
    if (y + need > H - M - 40) {
      footer();
      doc.addPage();
      y = M;
    }
  };

  const footer = () => {
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("Otsuse kaart ei tee otsust sinu eest ega asenda professionaalset nõustamist.", M, H - M);
    doc.text("© 2026 Otsuse kaart · Loodud Tartu Ülikooli aine „Digitaalne maailmapilt“ raames.", M, H - M + 12);
  };

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...NAVY);
  doc.text("Otsuse kaart", M, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text("Sinu otsuse kokkuvõte", M, y);
  y += 28;

  // Decision
  section("Sinu otsus");
  paragraph(d.decision || "—");

  // Simple visual block
  ensure(80);
  doc.setDrawColor(...VIOLET);
  doc.setLineWidth(1);
  doc.roundedRect(M, y, W - M * 2, 56, 10, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...NAVY);
  const c = d.decision || "Sinu otsus";
  const lines = doc.splitTextToSize(c, W - M * 2 - 24);
  doc.text(lines.slice(0, 2), W / 2, y + 32, { align: "center" });
  y += 76;

  // Values
  if (d.values.length) {
    section("Olulised väärtused");
    d.values.forEach((v) => bullet(v.label, v.note));
  }

  // Motivations
  if (d.attractions.length) {
    section("Mis tõmbab");
    d.attractions.forEach((m) => bullet(m.label, m.note));
  }

  // Fears
  if (d.holdBacks.length) {
    section("Mis hoiab tagasi");
    d.holdBacks.forEach((m) => bullet(m.label, m.note));
  }

  // Affected
  if (d.affected.length) {
    section("Keda või mida see puudutab");
    d.affected.forEach((m) => bullet(m.label, m.note));
  }

  // Columns
  if (d.nonNegotiable.length || d.flexible.length || d.needsDiscussion.length) {
    section("Mittekaubeldav · Paindlik · Vajab arutamist");
    if (d.nonNegotiable.length) labelList("Mittekaubeldav", d.nonNegotiable);
    if (d.flexible.length) labelList("Paindlik", d.flexible);
    if (d.needsDiscussion.length) labelList("Vajab arutamist", d.needsDiscussion);
  }

  // Ratings
  section("Hinnangud (1–5)");
  const rt = d.ratings;
  const rows: [string, number][] = [
    ["Väärtustega sobivus", rt.valuesFit],
    ["Sisemine huvi", rt.intrinsic],
    ["Pikaajaline tähendus", rt.longTerm],
    ["Realistlikkus", rt.realism],
    ["Hakkamasaamise tunne", rt.capability],
    ["Suhete mõju", rt.relationships],
    ["Katsetatavus", rt.testability],
    ["Stressitase", rt.stress],
    ["Kahetsuse hirm", rt.regret],
    ["Info piisavus", rt.info],
  ];
  rows.forEach(([k, v]) => {
    ensure(16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(k, M, y);
    doc.setTextColor(...VIOLET);
    doc.text(String(v) + " / 5", W - M, y, { align: "right" });
    y += 14;
  });
  y += 6;

  // Interpretation
  section("Mida see võib tähendada?");
  paragraph(interp.summary);

  // Next steps
  if (interp.nextSteps.length) {
    section("Kuidas edasi?");
    interp.nextSteps.forEach((s) => {
      bullet(s.title, s.text);
    });
  }

  // Reflection
  if (interp.reflectionQuestions.length) {
    section("Küsimused edasiseks mõtlemiseks");
    interp.reflectionQuestions.forEach((q) => bullet("•", q));
  }

  // Disclaimer
  section("Märkus");
  paragraph(
    "Otsuse kaart ei tee otsust sinu eest ega asenda professionaalset nõustamist. See on eneseanalüüsi tööriist, mis aitab mõtteid struktureerida ja otsustamist rahulikumaks muuta."
  );

  footer();
  doc.save("otsuse-kaart.pdf");

  // ---- helpers ----
  function section(title: string) {
    ensure(36);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(title, M, y);
    y += 6;
    doc.setDrawColor(220, 215, 235);
    doc.line(M, y, W - M, y);
    y += 12;
  }
  function paragraph(text: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...NAVY);
    const ls = doc.splitTextToSize(text, W - M * 2);
    ls.forEach((line: string) => {
      ensure(14);
      doc.text(line, M, y);
      y += 14;
    });
    y += 4;
  }
  function bullet(label: string, note: string) {
    ensure(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...NAVY);
    doc.text("• " + label, M, y);
    y += 13;
    if (note) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      const ls = doc.splitTextToSize(note, W - M * 2 - 14);
      ls.forEach((line: string) => {
        ensure(13);
        doc.text(line, M + 14, y);
        y += 13;
      });
    }
    y += 2;
  }
  function labelList(title: string, items: string[]) {
    ensure(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...VIOLET);
    doc.text(title, M, y);
    y += 13;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...NAVY);
    items.forEach((it) => {
      ensure(13);
      doc.text("· " + it, M + 12, y);
      y += 13;
    });
    y += 4;
  }
}
