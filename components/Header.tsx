"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import { LogoMark } from "./LogoMark";
import { ThemeToggle } from "./ThemeToggle";

type NavCopy = {
  research: string;
  publications: string;
  people: string;
  gallery: string;
  news: string;
  join: string;
  contact: string;
  workWithUs: string;
  menu: string;
  language: string;
  switchToLight: string;
  switchToDark: string;
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
  const pathname = usePathname();

  const links = useMemo(
    () => [
      [copy.research, withLocale(lang, "/research")],
      [copy.publications, withLocale(lang, "/publications")],
      [copy.people, withLocale(lang, "/people")],
      [copy.gallery, withLocale(lang, "/gallery")],
      [copy.news, withLocale(lang, "/news")],
      [copy.join, withLocale(lang, "/join")],
      [copy.contact, withLocale(lang, "/contact")],
    ],
    [copy, lang],
  );

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  function switchPath(target: Locale) {
    if (!pathname) return `/${target}`;
    return pathname.replace(/^\/(en|vi)(?=\/|$)/, `/${target}`);
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href={`/${lang}`} aria-label="Vision and Learning Lab home">
          <LogoMark compact top={brand.top} bottom={brand.bottom} />
        </Link>
        <button
          className="menu-toggle"
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
        <nav id="primary-navigation" className={open ? "nav nav--open" : "nav"}>
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="locale-switch" aria-label={copy.language}>
            {(["en", "vi"] as Locale[]).map((locale) => (
              <Link
                key={locale}
                href={switchPath(locale)}
                className={locale === lang ? "is-active" : ""}
                onClick={() => { localStorage.setItem("vllab-locale", locale); setOpen(false); }}
                hrefLang={locale}
              >
                {locale.toUpperCase()}
              </Link>
            ))}
          </div>
          <ThemeToggle lightLabel={copy.switchToLight} darkLabel={copy.switchToDark} />
          <Link className="nav-cta" href={withLocale(lang, "/join")} onClick={() => setOpen(false)}>
            {copy.workWithUs}
          </Link>
        </nav>
      </div>
    </header>
  );
}
