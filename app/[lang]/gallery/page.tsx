import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getDictionary } from "@/data/content";
import { getGalleryItems } from "@/lib/gallery";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "vi" ? "Thư viện ảnh" : "Gallery" };
}

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getDictionary(lang).pages.gallery;
  const gallery = getDictionary(lang).gallery;
  const items = getGalleryItems(lang);

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
      <section className="section section--light gallery-page">
        <div className="shell">
          <GalleryGrid items={items} closeLabel={gallery.close} />
        </div>
      </section>
    </>
  );
}
