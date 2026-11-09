"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Photo from "./Photo";

export default function Gallery({ items, categories }) {
  const present = categories.filter((c) => items.some((i) => i.category === c.key));
  const [filter, setFilter] = useState("all");
  const [index, setIndex] = useState(null);
  const closeRef = useRef(null);
  const touchX = useRef(null);

  const shown = filter === "all" ? items : items.filter((i) => i.category === filter);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d) => setIndex((i) => (i + d + shown.length) % shown.length), [shown.length]);

  useEffect(() => {
    if (index === null) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, close, step]);

  const current = index !== null ? shown[index] : null;

  return (
    <>
      {present.length > 1 && (
        <div className="filters" role="group" aria-label="Filter projects">
          {[{ key: "all", label: "All work" }, ...present].map((c) => (
            <button key={c.key} className="filter" aria-pressed={filter === c.key} onClick={() => setFilter(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
      )}

      <ul className="gallery">
        {shown.map((item, i) => (
          <li key={item.src}>
            <button onClick={() => setIndex(i)} aria-label={`View larger: ${item.alt}`}>
              <Photo src={item.src} alt={item.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw" />
              <span className="tile-cap">{item.alt}</span>
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - (touchX.current ?? 0);
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          <figure>
            <div className="lb-frame">
              <Photo src={current.src} alt={current.alt} fill sizes="100vw" className="contain" />
            </div>
            <figcaption>
              {current.alt}
              <span className="lb-count">
                {index + 1} of {shown.length}
              </span>
            </figcaption>
          </figure>
          <button ref={closeRef} className="lb-btn lb-close" onClick={close} aria-label="Close">&times;</button>
          {shown.length > 1 && (
            <>
              <button className="lb-btn lb-prev" onClick={() => step(-1)} aria-label="Previous photo">&lsaquo;</button>
              <button className="lb-btn lb-next" onClick={() => step(1)} aria-label="Next photo">&rsaquo;</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
