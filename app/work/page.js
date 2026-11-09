import Link from "next/link";
import Photo from "@/components/Photo";
import { categories, getGallery } from "@/lib/gallery";

export const metadata = {
  title: "Our work",
  description: "Residential and commercial millwork projects by Beam\u2019s Millwork.",
};

export default function WorkPage() {
  const all = getGallery();
  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <h1>Our work</h1>
          <p className="lede">Two galleries, one standard. Choose a collection to explore.</p>
        </div>
      </div>
      <section className="work-split">
        {categories.map((c, i) => {
          const items = getGallery(c.key);
          const cover = items[0] || all[i] || all[0];
          return (
            <Link key={c.key} href={`/work/${c.key}`} className="work-panel">
              <Photo src={cover.src} alt="" fill sizes="(max-width: 860px) 100vw, 50vw" />
              <span className="work-panel-shade" aria-hidden="true" />
              <span className="work-panel-copy">
                <span className="work-panel-title">{c.label}</span>
                <span className="work-panel-intro">{c.intro}</span>
                <span className="work-panel-cta">View the gallery</span>
              </span>
            </Link>
          );
        })}
      </section>
    </>
  );
}
