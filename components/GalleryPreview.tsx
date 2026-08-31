import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import { getDictionary } from "@/data/content";
import { getGalleryItems } from "@/lib/gallery";
import { SectionHeading } from "./SectionHeading";
import { GalleryGrid } from "./GalleryGrid";

export function GalleryPreview({ lang }: { lang: Locale }) {
  const copy = getDictionary(lang).gallery;
  const items = getGalleryItems(lang).slice(0, 5);
  return <section className="section section--paper gallery-preview"><div className="shell"><SectionHeading index="05" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} /><GalleryGrid items={items} closeLabel={copy.close} /><div className="section-link" data-reveal><Link href={withLocale(lang, "/gallery")}>{copy.link} <span>↗</span></Link></div></div></section>;
}
