import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import { LogoMark } from "./LogoMark";

export function Footer({
  lang,
  copy,
  brand,
  nav,
}: {
  lang: Locale;
  copy: {
    description: string;
    explore: string;
    connect: string;
    location: string;
    join: string;
    address: string;
    bottom: string;
  };
  brand: { top: string; bottom: string };
  nav: { about: string; publications: string; people: string; gallery: string; news: string; contact: string };
}) {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div>
          <LogoMark top={brand.top} bottom={brand.bottom} />
          <p>{copy.description}</p>
        </div>
        <div>
          <h3>{copy.explore}</h3>
          <Link href={withLocale(lang, "/about")}>{nav.about}</Link>
          <Link href={withLocale(lang, "/publications")}>{nav.publications}</Link>
          <Link href={withLocale(lang, "/people")}>{nav.people}</Link>
          <Link href={withLocale(lang, "/gallery")}>{nav.gallery}</Link>
          <Link href={withLocale(lang, "/news")}>{nav.news}</Link>
        </div>
        <div>
          <h3>{copy.connect}</h3>
          <Link href={withLocale(lang, "/join")}>{copy.join}</Link>
          <Link href={withLocale(lang, "/contact")}>{nav.contact}</Link>
          <a href="mailto:vallab.utehy@gmail.com">vallab.utehy@gmail.com</a>
        </div>
        <div>
          <h3>{copy.location}</h3>
          <p>{copy.address.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</p>
        </div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 Vision and Learning Lab</span><span>{copy.bottom}</span></div>
    </footer>
  );
}
