import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/PostBody";
import { assetPath } from "@/lib/assets";
import { isLocale, locales, withLocale } from "@/lib/i18n";
import { getPost, getPostSlugs } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getPostSlugs().map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const post = getPost(slug, lang);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const post = getPost(slug, lang);
  if (!post) notFound();
  const date = new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${post.date}T00:00:00`));

  return (
    <article className="post-page section section--light">
      <div className="shell post-page__shell">
        <Link className="member-profile__back" href={withLocale(lang, "/news")}>← {lang === "vi" ? "Quay lại tin tức" : "Back to news"}</Link>
        <header className="post-page__header"><time dateTime={post.date}>{date}</time><h1>{post.title}</h1><p>{post.excerpt}</p>{post.author ? <span>{post.author}</span> : null}</header>
        {post.cover ? <Image className="post-page__cover" src={assetPath(post.cover)} alt={post.coverAlt} width={1600} height={900} priority /> : null}
        <PostBody markdown={post.body} />
      </div>
    </article>
  );
}
