import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { AboutGroupSection } from "@/components/AboutGroupSection";
import { GalleryPreview } from "@/components/GalleryPreview";
import {
  JoinBanner,
  NewsAndPartners,
  PeoplePreview,
  PublicationsPreview,
  ResearchPreview,
} from "@/components/HomeSections";
import { getDictionary } from "@/data/content";
import { isLocale } from "@/lib/i18n";

export const dynamicParams = false;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dictionary = getDictionary(lang);

  return (
    <>
      <Hero lang={lang} copy={dictionary.hero} />
      <AboutGroupSection lang={lang} />
      <ResearchPreview lang={lang} />
      <PublicationsPreview lang={lang} />
      <GalleryPreview lang={lang} />
      <PeoplePreview lang={lang} />
      <NewsAndPartners lang={lang} />
      <JoinBanner lang={lang} />
    </>
  );
}
