import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata = {
  title: "Request a bid",
  description: "Send drawings and project details to Beam\u2019s Millwork for a millwork or casework estimate.",
};

export default function ContactPage() {
  const a = site.address;
  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <h1>Request a bid</h1>
          <p className="lede">Tell us about the project and attach what you have. We follow up within one business day.</p>
        </div>
      </div>
      <section className="section">
        <div className="wrap contact-layout">
          <ContactForm />
          <aside className="contact-info">
            <h2>Call or visit</h2>
            <p>
              <a href={site.phoneHref} className="big-phone">{site.phone}</a>
            </p>
            <p>
              <a href={site.mapUrl} target="_blank" rel="noopener noreferrer">
                {a.street}
                <br />
                {a.city}, {a.state} {a.zip}
              </a>
            </p>
            <h3>Hours</h3>
            <ul>
              {site.hours.map((h) => (
                <li key={h.days}>
                  {h.days}: {h.time}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
