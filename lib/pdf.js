import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Standard PDF fonts only cover basic Latin characters, so normalize the rest.
const clean = (s) =>
  String(s ?? "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\r/g, "")
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, "");

function wrap(str, font, size, maxWidth) {
  const out = [];
  for (const para of clean(str).split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        out.push(line);
        line = word;
      } else line = test;
    }
    out.push(line);
  }
  return out;
}

export async function applicationPdf(sections, { title, name }) {
  const doc = await PDFDocument.create();
  doc.setTitle(clean(`${title} - ${name}`));
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const W = 612, H = 792, M = 54, LABEL_W = 170, GAP = 14, LH = 13;
  const walnut = rgb(0.29, 0.18, 0.12);
  const gray = rgb(0.35, 0.37, 0.4);
  let page = doc.addPage([W, H]);
  let y = H - M;

  const ensure = (h) => {
    if (y - h < M + 20) {
      page = doc.addPage([W, H]);
      y = H - M;
    }
  };

  page.drawText("Beam's Millwork", { x: M, y, size: 20, font: bold, color: walnut });
  y -= 24;
  page.drawText(clean(title), { x: M, y, size: 12, font });
  y -= 16;
  page.drawText(clean(name), { x: M, y, size: 12, font: bold });
  y -= 10;

  for (const s of sections) {
    const rows = s.rows.filter((row) => row.sub || row[1]);
    if (!rows.length) continue;
    ensure(48);
    y -= 22;
    page.drawText(clean(s.title), { x: M, y, size: 13, font: bold, color: walnut });
    y -= 6;
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.75, color: rgb(0.8, 0.8, 0.78) });
    y -= 16;

    for (const row of rows) {
      if (row.sub) {
        ensure(30);
        y -= 4;
        page.drawText(clean(row.sub), { x: M, y, size: 10.5, font: bold });
        y -= 16;
        continue;
      }
      const labels = wrap(row[0], bold, 9, LABEL_W - GAP);
      const values = wrap(row[1], font, 10, W - M * 2 - LABEL_W);
      const h = Math.max(labels.length, values.length) * LH + 4;
      ensure(h);
      labels.forEach((l, i) => page.drawText(l, { x: M, y: y - i * LH, size: 9, font: bold, color: gray }));
      values.forEach((l, i) => page.drawText(l, { x: M + LABEL_W, y: y - i * LH, size: 10, font }));
      y -= h;
    }
  }

  const pages = doc.getPages();
  pages.forEach((p, i) =>
    p.drawText(`Page ${i + 1} of ${pages.length}`, { x: W - M - 60, y: M - 20, size: 8, font, color: gray })
  );

  return Buffer.from(await doc.save());
}
