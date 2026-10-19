import fs from "node:fs";
import path from "node:path";

// Drop photos into public/gallery/<category>/ and redeploy. The file name becomes
// the caption: "01-walnut-library.jpg" shows as "Walnut library". Leading numbers
// set the order and are hidden.
export const categories = [
  { key: "residential", label: "Residential" },
  { key: "commercial", label: "Commercial" },
  { key: "institutional", label: "Institutional" },
];

const EXT = /\.(jpe?g|png|webp|avif)$/i;

// Temporary: photos from the current GoDaddy site. Replace by adding your own
// files to public/gallery. These stop working once the GoDaddy site is cancelled.
const W = "https://img1.wsimg.com/isteam/ip/ad8ba19f-cca3-46af-863d-9f6daccd6ac4/";
const FALLBACK = [
  { src: W + "AV_230726_7266098-Edit-Edit.jpg/:/rs=w:1800,cg:true", alt: "Custom millwork by Beam\u2019s Millwork", category: null },
  { src: W + "IMG_0279-HDR.jpg/:/rs=w:1800,cg:true", alt: "Custom casework installation", category: null },
  { src: W + "IMG_7870.jpeg/:/rs=w:1800,cg:true", alt: "Millwork and materials detail", category: null },
  { src: W + "Dobilas%20Pictures%20034.tif/:/rs=w:1800,cg:true", alt: "Architectural woodwork project", category: null },
];

function caption(file) {
  const c = file
    .replace(EXT, "")
    .replace(/^\d+[-_ ]*/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return c ? c.charAt(0).toUpperCase() + c.slice(1) : "Project photo";
}

export function getGallery() {
  const root = path.join(process.cwd(), "public", "gallery");
  const items = [];
  for (const c of categories) {
    let files = [];
    try {
      files = fs.readdirSync(path.join(root, c.key)).filter((f) => EXT.test(f)).sort();
    } catch {}
    for (const f of files) {
      items.push({ src: `/gallery/${c.key}/${encodeURIComponent(f)}`, alt: caption(f), category: c.key });
    }
  }
  return items.length ? items : FALLBACK;
}

// Put a file named hero.jpg (or .png/.webp) in /public to set the home page photo.
export function getHero() {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", `hero.${ext}`))) {
      return { src: `/hero.${ext}`, alt: "Architectural millwork by Beam\u2019s Millwork" };
    }
  }
  return FALLBACK[0];
}
