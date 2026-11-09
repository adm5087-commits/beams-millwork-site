"use client";
import { useState } from "react";
import { youtubeId } from "@/lib/youtube";

// Shows a still frame with a play button. YouTube only loads when someone presses play,
// which keeps the page fast and sets no tracking cookies until then.
export default function VideoFeature({ url, title }) {
  const id = youtubeId(url);
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = useState(id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : "");
  if (!id) return null;

  return (
    <div className="video">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video-poster" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            loading="lazy"
            onLoad={(e) => {
              // YouTube returns a small gray placeholder when no HD frame exists.
              if (e.currentTarget.naturalWidth < 200) setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
            }}
            onError={() => setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
          />
          <span className="video-play" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
          </span>
          <span className="video-label" aria-hidden="true">Play film</span>
        </button>
      )}
    </div>
  );
}
