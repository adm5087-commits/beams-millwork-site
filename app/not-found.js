import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap">
        <h1>Page not found</h1>
        <p className="lede">That page moved or no longer exists.</p>
        <div className="actions">
          <Link className="btn" href="/"><span>Go to the home page</span></Link>
          <Link className="btn ghost" href="/work"><span>See our work</span></Link>
        </div>
      </div>
    </section>
  );
}
