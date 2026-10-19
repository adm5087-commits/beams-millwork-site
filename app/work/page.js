import Link from "next/link";
import Gallery from "@/components/Gallery";
import { categories, getGallery } from "@/lib/gallery";

export const metadata = {
  title: "Our work",
  description: "Residential, commercial and institutional millwork and casework projects by Beam\u2019s Millwork.",
};

export default function WorkPage() {
  const items = getGallery();
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="page-head">
        <div className="wrap">
          <h1>Our work</h1>
          <p className="lede">Casework, paneling, mouldings and fixtures from recent residential and commercial projects.</p>
        </div>
      </div>
      <div className="wrap">
        <Gallery items={items} categories={categories} />
        <p className="after-gallery">
          Want to see something similar for your project? <Link href="/contact">Send us your drawings</Link>.
        </p>
      </div>
    </section>
  );
}
