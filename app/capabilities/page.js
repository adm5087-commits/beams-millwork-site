import Link from "next/link";
import Photo from "@/components/Photo";
import { getGallery, getHero } from "@/lib/gallery";
import { site, services, markets, process } from "@/lib/site";

export const metadata = {
  title: "Capabilities",
  description: "Custom casework, architectural woodwork, mouldings and commercial fixtures, drafted in Microvellum and built in Morgantown, PA.",
};

export default function CapabilitiesPage() {
  const hero = getHero();
  const photos = getGallery().filter((g) => g.src !== hero.src);
  const headPhoto = photos[0] || hero;
  const shopPhoto = photos[1] || hero;

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-media">
          <Photo src={headPhoto.src} alt="" fill priority sizes="100vw" />
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="wrap page-hero-copy">
          <h1>Capabilities</h1>
          <p className="hero-lede">
            We estimate, draft, build and install architectural woodwork for residential, commercial and institutional projects.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap services-layout">
          <div className="services-intro">
            <h2>What we build</h2>
            <p className="lede">Every piece is made to order from approved shop drawings, in the species and finish you specify.</p>
            <Link href="/contact" className="text-link">Start a project</Link>
          </div>
          <ul className="service-list">
            {services.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section dark markets">
        <div className="wrap">
          <h2>Who we work with</h2>
          <div className="market-grid">
            {markets.map((m) => (
              <div className="market" key={m.title}>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            <h2>How a project runs</h2>
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
          <div className="shop">
            <div className="shop-photo">
              <Photo src={shopPhoto.src} alt={shopPhoto.alt} fill sizes="(max-width: 860px) 100vw, 50vw" />
            </div>
            <h2>The shop</h2>
            <p>
              Everything we build comes out of our shop at {site.address.street} in {site.address.city}, PA. Estimating,
              drafting, fabrication and installation sit under one roof, so the people pricing your job talk to the people
              building it.
            </p>
            <p>
              Shop drawings are produced in Microvellum, which ties the approved drawings directly to the cut lists our
              shop builds from.
            </p>
          </div>
        </div>
      </section>

      <section className="section walnut cta">
        <div className="wrap">
          <h2>Have a project in mind?</h2>
          <p className="lede">Send plans, specifications or a few photographs and we&rsquo;ll respond within one business day.</p>
          <div className="actions">
            <Link className="btn light" href="/contact"><span>Request a bid</span></Link>
            <a className="btn outline-light" href={site.phoneHref}><span>Call {site.phone}</span></a>
          </div>
        </div>
      </section>
    </>
  );
}
