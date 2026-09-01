import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/PostBody";
import { assetPath } from "@/lib/assets";
import { isLocale, locales, withLocale } from "@/lib/i18n";
import { getHighlight, getHighlightSlugs } from "@/lib/highlights";

export const dynamicParams = false;
export function generateStaticParams() { return locales.flatMap((lang) => getHighlightSlugs().map((slug) => ({ lang, slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const highlight = getHighlight(slug, lang);
  return highlight ? { title: highlight.title, description: highlight.excerpt } : {};
}

export default async function HighlightPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const highlight = getHighlight(slug, lang);
  if (!highlight) notFound();
  const date = new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${highlight.date}T00:00:00`));
  return <article className="post-page section section--light"><div className="shell post-page__shell"><Link className="member-profile__back" href={withLocale(lang, "/highlights")}>← {lang === "vi" ? "Quay lại điểm nhấn" : "Back to highlights"}</Link><header className="post-page__header"><time dateTime={highlight.date}>{date}</time><h1>{highlight.title}</h1><p>{highlight.excerpt}</p>{highlight.author ? <span>{highlight.author}</span> : null}</header>{highlight.cover ? <Image className="post-page__cover" src={assetPath(highlight.cover)} alt={highlight.coverAlt} width={1600} height={900} priority /> : null}<PostBody markdown={highlight.body} /></div></article>;
}
