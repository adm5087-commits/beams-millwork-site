import Link from "next/link";
import Photo from "@/components/Photo";
import ProfileDrawing from "@/components/ProfileDrawing";
import { getGallery, getHero } from "@/lib/gallery";
import { site, process, services } from "@/lib/site";

export default function Home() {
  const hero = getHero();
  const featured = getGallery().filter((g) => g.src !== hero.src).slice(0, 3);
  const a = site.address;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "Beam's Millwork",
    url: site.url,
    telephone: site.phone,
    address: { "@type": "PostalAddress", streetAddress: a.street, addressLocality: a.city, addressRegion: a.state, postalCode: a.zip, addressCountry: "US" },
    openingHours: "Mo-Fr 07:00-16:00",
    sameAs: [site.facebook],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hero">
        <div className="hero-copy">
          <h1>Architectural millwork, drawn, built and installed by one shop.</h1>
          <p className="lede">
            For more than 20 years Beam&rsquo;s has built custom casework, millwork and mouldings for homes and commercial
            projects from our shop in Morgantown, Pennsylvania.
          </p>
          <div className="actions">
            <Link className="btn" href="/contact">Request a bid</Link>
            <Link className="btn ghost" href="/work">See our work</Link>
          </div>
        </div>
        <div className="hero-media">
          <Photo src={hero.src} alt={hero.alt} fill priority sizes="(max-width: 900px) 100vw, 60vw" />
        </div>
      </section>

      <section className="section">
        <div className="wrap drawing-band">
          <ProfileDrawing />
          <div>
            <h2>From shop drawing to installation</h2>
            <p className="lede">One team owns your project from the first takeoff to the last piece of trim.</p>
            <ol className="steps">
              {process.map((s) => (
                <li key={s.title}>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="wrap">
          <div className="section-head">
            <h2>What we build</h2>
            <Link href="/capabilities" className="text-link">All capabilities</Link>
          </div>
          <div className="services">
            {services.map((s) => (
              <div className="service" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featured.length >= 3 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2>Recent work</h2>
              <Link href="/work" className="text-link">Full gallery</Link>
            </div>
            <div className="feature-grid">
              {featured.map((f, i) => (
                <Link href="/work" className="tile" key={f.src}>
                  <Photo src={f.src} alt={f.alt} fill sizes={i === 0 ? "(max-width: 700px) 100vw, 66vw" : "(max-width: 700px) 50vw, 33vw"} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section dark">
        <div className="wrap cta">
          <div>
            <h2>Have drawings ready?</h2>
            <p className="lede">Send plans, specs or a few photos and we&rsquo;ll follow up within one business day.</p>
          </div>
          <div className="actions">
            <Link className="btn" href="/contact">Request a bid</Link>
            <a className="btn ghost" href={site.phoneHref}>Call {site.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
