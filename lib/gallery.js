import fs from "node:fs";
import path from "node:path";

// Two galleries. Drop photos into public/gallery/residential/ or public/gallery/commercial/
// and redeploy. The file name becomes the caption: "01-walnut-library.jpg" shows as
// "Walnut library". Leading numbers set the order and are hidden.
export const categories = [
  {
    key: "residential",
    label: "Residential",
    title: "Residential work",
    intro: "Kitchens, libraries, built-ins, paneling and trim made for one specific house.",
  },
  {
    key: "commercial",
    label: "Commercial",
    title: "Commercial work",
    intro: "Reception desks, casework, fixtures and architectural woodwork for offices, clubs, schools and institutions.",
  },
];

const EXT = /\.(jpe?g|png|webp|avif)$/i;

// Temporary: photos from the current GoDaddy site, shown only until you add your own.
// These stop working once the GoDaddy site is cancelled.
const W = "https://img1.wsimg.com/isteam/ip/ad8ba19f-cca3-46af-863d-9f6daccd6ac4/";
const FALLBACK = [
  { src: W + "AV_230726_7266098-Edit-Edit.jpg/:/rs=w:1800,cg:true", alt: "Custom millwork by Beam\u2019s Millwork", category: null },
  { src: W + "IMG_0279-HDR.jpg/:/rs=w:1800,cg:true", alt: "Custom casework installation", category: null },
  { src: W + "IMG_7870.jpeg/:/rs=w:1800,cg:true", alt: "Millwork and materials detail", category: null },
  { src: W + "Dobilas%20Pictures%20034.tif/:/rs=w:1800,cg:true", alt: "Architectural woodwork project", category: null },
];

function caption(file) {
  const c = file.replace(EXT, "").replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim();
  return c ? c.charAt(0).toUpperCase() + c.slice(1) : "Project photo";
}

function readFolder(key) {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "public", "gallery", key))
      .filter((f) => EXT.test(f))
      .sort()
      .map((f) => ({ src: `/gallery/${key}/${encodeURIComponent(f)}`, alt: caption(f), category: key }));
  } catch {
    return [];
  }
}

// All photos, or one category. Falls back to the GoDaddy photos only when no photos
// have been added anywhere yet.
export function getGallery(category) {
  const all = categories.flatMap((c) => readFolder(c.key));
  if (!all.length) return FALLBACK;
  return category ? all.filter((i) => i.category === category) : all;
}

export function getCategory(key) {
  return categories.find((c) => c.key === key);
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
