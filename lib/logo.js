import fs from "node:fs";
import path from "node:path";

// Logo files in /public:
//   logo.*          horizontal, dark (header on light backgrounds)
//   logo-reverse.*  horizontal, white (header over the home page photo)
//   logo-white.*    stacked, white (footer)
function find(base) {
  for (const ext of ["svg", "png", "webp", "jpg", "jpeg"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", `${base}.${ext}`))) return `/${base}.${ext}`;
  }
  return null;
}

export function getLogos() {
  return { logo: find("logo"), logoReverse: find("logo-reverse"), logoLight: find("logo-white") };
}
