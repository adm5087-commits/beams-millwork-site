"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/work/residential", label: "Residential" },
  { href: "/work/commercial", label: "Commercial" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/careers", label: "Careers" },
];

export default function Header({ logo, logoReverse }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the home page the header sits transparently over the hero photo until you scroll.
  const over = pathname === "/" && !scrolled && !open;
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`site-header${over ? " is-over" : ""}${scrolled ? " is-scrolled" : ""}`}>
      <div className="wrap">
        <Link href="/" className="brand" aria-label="Beam’s Millwork home">
          {logo ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="Beam&rsquo;s Millwork" className="brand-logo on-light" />
              {logoReverse && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoReverse} alt="" aria-hidden="true" className="brand-logo on-dark" />
              )}
            </>
          ) : (
            <span className="brand-text">Beam&rsquo;s Millwork</span>
          )}
        </Link>
        <button className="menu-btn" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
        <nav id="main-nav" className={`nav${open ? " open" : ""}`} aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link" aria-current={isActive(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className={`btn ${over ? "light" : "ghost"} nav-cta`} aria-current={pathname === "/contact" ? "page" : undefined}>
            <span>Request a bid</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
