"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import { LogoMark } from "./LogoMark";

type NavCopy = {
  about: string;
  publications: string;
  people: string;
  gallery: string;
  highlights: string;
  workWithUs: string;
  menu: string;
  language: string;
};

export function Header({
  lang,
  copy,
  brand,
}: {
  lang: Locale;
  copy: NavCopy;
  brand: { top: string; bottom: string };
}) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  const links = useMemo(
    () => [
      [copy.about, withLocale(lang, "/about")],
      [copy.publications, withLocale(lang, "/publications")],
      [copy.people, withLocale(lang, "/people")],
      [copy.highlights, withLocale(lang, "/highlights")],
      [copy.gallery, withLocale(lang, "/gallery")],
    ],
    [copy, lang],
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 980px)");
    const update = () => setIsMobile(query.matches);
    setMounted(true);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  /* Fade the header in proportion to the scroll position, so its surface
     follows the reader instead of toggling between two visual states. */
  useEffect(() => {
    let lastY = window.scrollY;
    let queued = false;

    const update = () => {
      const y = window.scrollY;
      setScrollProgress(Math.min(y / 160, 1));
      if (y > 96 && y > lastY + 4) setHidden(true);
      else if (y < lastY - 4 || y <= 96) setHidden(false);
      lastY = y;
      queued = false;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClass = [
    "site-header",
    open ? "site-header--menu-open" : "",
    hidden && !open ? "site-header--hidden" : "",
  ].filter(Boolean).join(" ");
  const headerStyle = {
    "--header-opacity": scrollProgress * 0.96,
    "--header-border-opacity": scrollProgress * 0.1,
    "--header-shadow-opacity": scrollProgress * 0.06,
    "--header-blur": `${scrollProgress * 10}px`,
  } as CSSProperties;

  function switchPath(target: Locale) {
    if (!pathname) return `/${target}`;
    return pathname.replace(/^\/(en|vi)(?=\/|$)/, `/${target}`);
  }

  const navigation = (
    <nav id="primary-navigation" className={open ? "nav nav--open" : "nav"}>
      {links.map(([label, href]) => (
        <Link className="nav-link" key={href} href={href} onClick={() => setOpen(false)}>
          {label}<span aria-hidden="true">↗</span>
        </Link>
      ))}
      <div className="locale-switch" aria-label={copy.language}>
        {(["en", "vi"] as Locale[]).map((locale) => (
          <Link key={locale} href={switchPath(locale)} className={locale === lang ? "is-active" : ""} onClick={() => setOpen(false)} hrefLang={locale}>{locale.toUpperCase()}</Link>
        ))}
      </div>
      <Link className="nav-cta" href={withLocale(lang, "/join")} onClick={() => setOpen(false)}>{copy.workWithUs}<span aria-hidden="true">↗</span></Link>
    </nav>
  );

  return (
    <header className={headerClass} style={headerStyle}>
      <div className="shell header-inner">
        <Link href={`/${lang}`} aria-label="Vision and Learning Lab home">
          <LogoMark compact top={brand.top} bottom={brand.bottom} />
        </Link>
        <button
          className={open ? "menu-toggle is-open" : "menu-toggle"}
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
          <span className="sr-only">{copy.menu}</span>
        </button>
        {isMobile && mounted ? createPortal(navigation, document.body) : navigation}
      </div>
    </header>
  );
}
