import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { getDictionary } from "@/data/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "vi" ? "Tham gia" : "Join" };
}

export default async function JoinPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getDictionary(lang).pages.join;

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
      <section className="section section--paper"><div className="shell join-page-grid">
        <div>{copy.roles.map(([title, description], index) => <article className="role-card" key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{description}</p></article>)}</div>
        <aside className="application-card"><p className="eyebrow"><span /> {copy.application}</p><h2>{copy.applicationTitle}</h2><p>{copy.applicationCopy}</p><a className="button button--primary" href="mailto:vallab.utehy@gmail.com">{copy.email} <span>↗</span></a></aside>
      </div></section>
    </>
  );
}
