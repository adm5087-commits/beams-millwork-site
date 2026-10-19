import Link from "next/link";
import { site, services, markets, process } from "@/lib/site";

export const metadata = {
  title: "Capabilities",
  description: "Custom casework, architectural woodwork, mouldings and commercial fixtures, drafted in Microvellum and built in Morgantown, PA.",
};

export default function CapabilitiesPage() {
  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <h1>Capabilities</h1>
          <p className="lede">
            We estimate, draft, build and install architectural woodwork for residential, commercial and institutional
            projects.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <h2>What we build</h2>
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

      <section className="section tint">
        <div className="wrap">
          <h2>Who we work with</h2>
          <div className="services">
            {markets.map((m) => (
              <div className="service" key={m.title}>
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
          <div>
            <h2>The shop</h2>
            <p>
              Everything we build comes out of our shop at {site.address.street} in {site.address.city}, PA. Estimating,
              drafting, fabrication and installation all sit under one roof, so the people pricing your job talk to the
              people building it.
            </p>
            <p>
              Shop drawings are produced in Microvellum, which ties the approved drawings directly to the cut lists our
              shop builds from.
            </p>
            <p>
              <Link href="/contact">Send us a project to price</Link> or call <a href={site.phoneHref}>{site.phone}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
