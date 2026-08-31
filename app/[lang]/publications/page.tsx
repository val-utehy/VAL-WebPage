import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { PublicationRow } from "@/components/PublicationRow";
import { getDictionary } from "@/data/content";
import { isLocale } from "@/lib/i18n";
import { getPublicationMemberNames, getPublications } from "@/lib/publications";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "vi" ? "Công bố" : "Publications" };
}

export default async function PublicationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dictionary = getDictionary(lang);
  const publications = getPublications();
  const copy = dictionary.pages.publications;
  const categories = ["Books", "Journal Papers", "Conference Papers"] as const;

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} variant="publications" />
      <section className="section section--dark"><div className="shell publication-list--page">
        {categories.map((category) => {
          const items = publications.filter((paper) =>
            paper.category === category && (category === "Books" || (paper.highlight ?? "Accepted") === "Accepted"),
          );
          if (!items.length) return null;
          return <section className="publication-category" key={category}><p>{category}</p><div className="publication-list">{items.map((paper) => <PublicationRow key={paper.title} paper={paper} memberNames={getPublicationMemberNames(paper)} />)}</div></section>;
        })}
      </div></section>
    </>
  );
}
