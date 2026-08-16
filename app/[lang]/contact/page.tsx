import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { getDictionary } from "@/data/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "vi" ? "Liên hệ" : "Contact" };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getDictionary(lang).pages.contact;

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
      <section className="section section--light"><div className="shell contact-grid">
        <div className="contact-card"><span>{copy.email}</span><h2>vallab.utehy@gmail.com</h2><p>{copy.emailCopy}</p></div>
        <div className="contact-card"><span>{copy.location}</span><h2>{copy.locationTitle}</h2><p>{copy.locationCopy}</p></div>
        <div className="contact-map"><div className="map-lines" /><span>21.0285° N</span><strong>VL LAB</strong><span>105.8542° E</span></div>
      </div></section>
    </>
  );
}
