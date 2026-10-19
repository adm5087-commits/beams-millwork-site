import { site } from "@/lib/site";

export const metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <h1>Privacy policy</h1>
        </div>
      </div>
      <section className="section">
        <div className="wrap prose">
          <p>
            Beam&rsquo;s Millwork collects the information you choose to send through the forms on this site, such as
            your name, contact details, project information, drawings and resumes. We use it only to respond to your
            inquiry or evaluate your application.
          </p>
          <p>
            Form submissions are delivered to us by email. We do not sell or share your information with third parties
            for marketing. Resumes and project files are kept only as long as needed for hiring or the project.
          </p>
          <p>
            This site does not use advertising or tracking cookies. To ask about or remove information you sent us, call{" "}
            <a href={site.phoneHref}>{site.phone}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
