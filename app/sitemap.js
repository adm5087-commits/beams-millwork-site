import { site } from "@/lib/site";

export default function sitemap() {
  return ["", "/work", "/work/residential", "/work/commercial", "/capabilities", "/careers", "/contact", "/privacy"].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: new Date(),
  }));
}
