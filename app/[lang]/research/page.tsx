import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { ResearchAreasGrid } from "@/components/ResearchAreasGrid";
import { getDictionary } from "@/data/content";
import { getSiteData } from "@/data/site";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "vi" ? "Nghiên cứu" : "Research" };
}

export default async function ResearchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dictionary = getDictionary(lang);
  const { researchAreas } = getSiteData(lang);
  const copy = dictionary.pages.research;

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
      <section className="section section--paper research-preview">
        <div className="shell"><ResearchAreasGrid areas={researchAreas} /></div>
      </section>
    </>
  );
}
