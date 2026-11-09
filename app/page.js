import Link from "next/link";
import Photo from "@/components/Photo";
import ProfileDrawing from "@/components/ProfileDrawing";
import VideoFeature from "@/components/VideoFeature";
import { youtubeId } from "@/lib/youtube";
import { getGallery, getHero } from "@/lib/gallery";
import { site, process, services, featuredVideo } from "@/lib/site";

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
        <div className="hero-media">
          <Photo src={hero.src} alt={hero.alt} fill priority sizes="100vw" />
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="wrap hero-copy">
          <h1>Fine millwork, made for the room it lives in.</h1>
          <p className="hero-lede">
            Custom casework, paneling and mouldings, drawn, built and installed by one shop in Morgantown, Pennsylvania.
          </p>
          <div className="actions">
            <Link className="btn light" href="/contact"><span>Request a bid</span></Link>
            <Link className="btn outline-light" href="/work"><span>View our work</span></Link>
          </div>
        </div>
      </section>

      <section className="section statement">
        <div className="wrap">
          <p>
            Every piece we make begins as a drawing and ends as part of the architecture. For more than twenty years, the
            same team has carried that work from the first sketch to the final scribe.
          </p>
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

      {youtubeId(featuredVideo.url) && (
        <section className="section dark featured-film">
          <div className="wrap">
            <div className="film-head">
              <div>
                <p className="film-kicker">{featuredVideo.location}</p>
                <h2>{featuredVideo.title}</h2>
              </div>
              <div>
                <p className="lede">{featuredVideo.text}</p>
                <Link href="/work/commercial" className="text-link light">View commercial work</Link>
              </div>
            </div>
            <VideoFeature url={featuredVideo.url} title={featuredVideo.title} />
          </div>
        </section>
      )}

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
                  <span className="tile-cap">{f.alt}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section dark">
        <div className="wrap cta">
          <h2>Bring us your drawings.</h2>
          <p className="lede">Send plans, specifications or a few photographs. We respond within one business day.</p>
          <div className="actions">
            <Link className="btn light" href="/contact"><span>Request a bid</span></Link>
            <a className="btn outline-light" href={site.phoneHref}><span>Call {site.phone}</span></a>
          </div>
        </div>
      </section>
    </>
  );
}
