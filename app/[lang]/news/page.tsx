import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsList } from "@/components/NewsList";
import { PageHero } from "@/components/PageHero";
import { getDictionary } from "@/data/content";
import { isLocale } from "@/lib/i18n";
import { getAllPosts } from "@/lib/posts";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "vi" ? "Tin tức" : "News" };
}

export default async function NewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getDictionary(lang).pages.news;

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
      <section className="section section--light"><div className="shell"><NewsList posts={getAllPosts(lang)} lang={lang} /></div></section>
    </>
  );
}
