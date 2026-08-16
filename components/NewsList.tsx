import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import type { Post } from "@/lib/posts";
import { assetPath } from "@/lib/assets";

function formatDate(date: string, lang: Locale) {
  return new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function NewsList({ posts, lang, compact = false }: { posts: Post[]; lang: Locale; compact?: boolean }) {
  if (!posts.length) {
    return <p className="content-note">{lang === "vi" ? "Tin tức sẽ được cập nhật sớm." : "News will be updated soon."}</p>;
  }

  return (
    <div className={compact ? "news-list" : "news-page-list"}>
      {posts.map((post) => (
        <article className={compact ? "news-list__item" : "news-card"} key={post.slug}>
          {post.cover && !compact ? <Image src={assetPath(post.cover)} alt={post.coverAlt} width={900} height={560} /> : null}
          <div>
            <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
            <h3><Link href={withLocale(lang, `/news/${post.slug}`)}>{post.title}</Link></h3>
            {!compact ? <p>{post.excerpt}</p> : null}
          </div>
          {compact ? <Link aria-label={post.title} href={withLocale(lang, `/news/${post.slug}`)}>↗</Link> : null}
        </article>
      ))}
    </div>
  );
}
