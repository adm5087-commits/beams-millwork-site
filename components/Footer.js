import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer({ logo }) {
  const a = site.address;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="Beam&rsquo;s Millwork" className="footer-logo" />
            ) : (
              <h2>Beam&rsquo;s Millwork</h2>
            )}
            <p>Architectural millwork, casework and mouldings, built in Morgantown, Pennsylvania.</p>
          </div>
          <div>
            <h3>Visit</h3>
            <p>
              <a href={site.mapUrl} target="_blank" rel="noopener noreferrer">
                {a.street}
                <br />
                {a.city}, {a.state} {a.zip}
              </a>
            </p>
            <p>
              <a href={site.phoneHref}>{site.phone}</a>
            </p>
          </div>
          <div>
            <h3>Hours</h3>
            <ul>
              {site.hours.map((h) => (
                <li key={h.days}>
                  {h.days}
                  <br />
                  {h.time}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Site</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/work/residential">Residential work</Link></li>
              <li><Link href="/work/commercial">Commercial work</Link></li>
              <li><Link href="/capabilities">Capabilities</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Request a bid</Link></li>
              <li><a href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>&copy; {new Date().getFullYear()} Beam&rsquo;s Millwork. All rights reserved.</span>
          <Link href="/privacy">Privacy policy</Link>
        </div>
      </div>
    </footer>
  );
}
