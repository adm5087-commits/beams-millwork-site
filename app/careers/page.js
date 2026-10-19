import ApplicationForm from "@/components/ApplicationForm";
import { positions } from "@/lib/site";

export const metadata = {
  title: "Careers",
  description: "Join the team at Beam\u2019s Millwork in Morgantown, PA. Open positions in estimating, drafting and the shop.",
};

export default function CareersPage() {
  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <h1>Build with us</h1>
          <p className="lede">
            We&rsquo;re a growing millwork shop in Morgantown, PA. Steady work, a skilled crew, and a Monday to Friday
            schedule from 7 to 4.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <h2>Open positions</h2>
          <ul className="positions">
            {positions.map((p) => (
              <li key={p.title}>
                <div>
                  <h3>{p.title}</h3>
                  <p className="meta">{p.type}, Morgantown, PA</p>
                  <p>{p.text}</p>
                </div>
                <a className="btn ghost" href={`?position=${encodeURIComponent(p.title)}#apply`}>
                  Apply for {p.title.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
          <p className="muted">Don&rsquo;t see your role? Send a general application and we&rsquo;ll keep it on file.</p>
        </div>
      </section>

      <section className="section tint" id="apply">
        <div className="wrap">
          <h2>Apply</h2>
          <p className="lede">This is our full employment application. It takes about 15 minutes. Have your work history and two professional references handy.</p>
          <ApplicationForm positions={positions} />
        </div>
      </section>
    </>
  );
}
