import Link from "next/link";
import Gallery from "@/components/Gallery";
import Photo from "@/components/Photo";
import VideoFeature from "@/components/VideoFeature";
import { youtubeId } from "@/lib/youtube";
import { featuredVideo } from "@/lib/site";
import { categories, getCategory, getGallery, getHero } from "@/lib/gallery";

export default function GalleryPage({ category }) {
  const cat = getCategory(category);
  const other = categories.find((c) => c.key !== category);
  const items = getGallery(category);
  const cover = items[0] || getHero();

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-media">
          <Photo src={cover.src} alt="" fill priority sizes="100vw" />
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="wrap page-hero-copy">
          <h1>{cat.title}</h1>
          <p className="hero-lede">{cat.intro}</p>
        </div>
      </section>

      <section className="section gallery-section">
        <div className="wrap">
          {category === "commercial" && youtubeId(featuredVideo.url) && (
            <div className="gallery-film">
              <VideoFeature url={featuredVideo.url} title={featuredVideo.title} />
              <div className="gallery-film-cap">
                <h2>{featuredVideo.title}</h2>
                <p>{featuredVideo.text}</p>
              </div>
            </div>
          )}
          {items.length ? (
            <Gallery items={items} categories={[]} />
          ) : (
            <p className="after-gallery">New project photos are on the way.</p>
          )}
          <div className="gallery-foot">
            <Link href={`/work/${other.key}`} className="text-link">View {other.label.toLowerCase()} work</Link>
            <Link href="/contact" className="btn ghost"><span>Request a bid</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
