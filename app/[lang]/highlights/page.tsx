import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HighlightsTimeline } from "@/components/HighlightsTimeline";
import { PageHero } from "@/components/PageHero";
import { getDictionary } from "@/data/content";
import { isLocale } from "@/lib/i18n";
import { getAllHighlights } from "@/lib/highlights";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "vi" ? "Điểm nhấn" : "Highlights" };
}

export default async function HighlightsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getDictionary(lang).pages.highlights;
  return <><PageHero eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} /><section className="section section--light highlights-page"><div className="shell"><HighlightsTimeline highlights={getAllHighlights(lang)} lang={lang} /></div></section></>;
}
