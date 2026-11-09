"use client";
import { useEffect, useRef, useState } from "react";

const PROFILE =
  "M60 60 H300 V78 H284 C280 120 232 118 210 150 C190 180 150 174 128 214 Q122 226 108 228 H96 V246 H86 V260 H60 Z";

export default function ProfileDrawing() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={`profile${shown ? " in" : ""}`} ref={ref}>
      <svg viewBox="0 0 400 320" role="img" aria-labelledby="pd-title">
        <title id="pd-title">Section drawing of a crown moulding profile with dimensions</title>
        <defs>
          <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" className="hatch-line" />
          </pattern>
        </defs>

        <g className="reveal context">
          <line x1="300" y1="60" x2="380" y2="60" />
          <line x1="60" y1="260" x2="60" y2="306" />
          <text x="378" y="52" textAnchor="end">Ceiling</text>
          <text x="68" y="300">Wall</text>
        </g>

        <path className="reveal" d={PROFILE} fill="url(#hatch)" />
        <path className="draw" d={PROFILE} pathLength="1400" />

        <g className="reveal dim">
          <line x1="60" y1="54" x2="60" y2="22" />
          <line x1="300" y1="54" x2="300" y2="22" />
          <line x1="60" y1="30" x2="300" y2="30" />
          <line x1="55" y1="35" x2="65" y2="25" />
          <line x1="295" y1="35" x2="305" y2="25" />
          <text x="180" y="22" textAnchor="middle">{'4 1/2"'}</text>
          <line x1="54" y1="60" x2="20" y2="60" />
          <line x1="54" y1="260" x2="20" y2="260" />
          <line x1="28" y1="60" x2="28" y2="260" />
          <line x1="23" y1="65" x2="33" y2="55" />
          <line x1="23" y1="265" x2="33" y2="255" />
          <text x="20" y="160" textAnchor="middle" transform="rotate(-90 20 160)">{'3 3/4"'}</text>
        </g>
      </svg>
      <figcaption>Every profile and shop drawing is produced in house before work reaches the floor.</figcaption>
    </figure>
  );
}
