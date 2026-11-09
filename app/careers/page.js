import ApplicationForm from "@/components/ApplicationForm";
import { positions } from "@/lib/site";

export const metadata = {
  title: "Careers",
  description: "Join the team at Beam\u2019s Millwork in Morgantown, PA. Estimating, project management, drafting, shop and sales roles.",
};

export default function CareersPage() {
  const roles = [...positions].sort((a, b) => Number(!!b.hiring) - Number(!!a.hiring));
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
          <div className="section-head">
            <h2>Positions</h2>
          </div>
          <p className="lede">We accept applications for every role year-round. Roles marked hiring now are being actively filled.</p>
          <ul className="positions">
            {roles.map((p) => (
              <li key={p.title}>
                <div>
                  <h3>
                    {p.title}
                    {p.hiring && <span className="hiring-tag">Hiring now</span>}
                  </h3>
                  <p className="meta">{p.type}, Morgantown, PA</p>
                  <p>{p.text}</p>
                </div>
                <a className="btn ghost" href={`?position=${encodeURIComponent(p.title)}#apply`}><span>Apply</span></a>
              </li>
            ))}
          </ul>
          <p className="muted">Don&rsquo;t see your role? Send a general application and we&rsquo;ll keep it on file.</p>
        </div>
      </section>

      <section className="section tint" id="apply">
        <div className="wrap">
          <h2>Apply</h2>
          <p className="lede">This is our full employment application. It takes about 15 minutes. Have your work history handy.</p>
          <ApplicationForm positions={roles} />
        </div>
      </section>
    </>
  );
}
