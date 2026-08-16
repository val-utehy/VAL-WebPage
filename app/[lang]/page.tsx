import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { LabFilm } from "@/components/LabFilm";
import { GalleryPreview } from "@/components/GalleryPreview";
import {
  Introduction,
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
      <Introduction lang={lang} />
      <LabFilm copy={dictionary.film} />
      <ResearchPreview lang={lang} />
      <GalleryPreview lang={lang} />
      <PublicationsPreview lang={lang} />
      <PeoplePreview lang={lang} />
      <NewsAndPartners lang={lang} />
      <JoinBanner lang={lang} />
    </>
  );
}
