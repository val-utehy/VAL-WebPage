import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  cover?: string;
  coverAlt: string;
  author?: string;
  body: string;
  featured: boolean;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---")) return { data: {} as Record<string, string>, body: raw.trim() };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { data: {} as Record<string, string>, body: raw.trim() };

  const data: Record<string, string> = {};
  for (const line of raw.slice(4, end).trim().split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body: raw.slice(end + 4).trim() };
}

function postCover(slug: string, value?: string) {
  if (!value) return undefined;
  if (value.startsWith("/")) return value;
  const filename = value.replace(/^images\//, "");
  return `/posts/${slug}/images/${filename}`;
}

function toPost(slug: string, filepath: string, locale: Locale): Post | null {
  const { data, body } = parseFrontmatter(fs.readFileSync(filepath, "utf8"));
  if (data.draft === "true" || !data.title || !data.date) return null;

  const title = locale === "vi" ? data.titleVi || data.title : data.title;
  const excerpt = locale === "vi" ? data.excerptVi || data.excerpt || body : data.excerpt || body;
  return {
    slug,
    title,
    excerpt,
    date: data.date,
    cover: postCover(slug, data.cover),
    coverAlt: locale === "vi" ? data.coverAltVi || data.coverAlt || title : data.coverAlt || title,
    author: locale === "vi" ? data.authorVi || data.author : data.author,
    body: locale === "vi" ? data.bodyVi || body : body,
    featured: data.featured === "true",
  };
}

function getPostSources() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .flatMap((entry) => {
      const filepath = path.join(postsDirectory, entry.name, "index.md");
      return fs.existsSync(filepath) ? [{ slug: entry.name, filepath }] : [];
    });
}

export function getAllPosts(locale: Locale) {
  return getPostSources()
    .map((source) => toPost(source.slug, source.filepath, locale))
    .filter((post): post is Post => Boolean(post))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string, locale: Locale) {
  return getAllPosts(locale).find((post) => post.slug === slug);
}

export function getPostSlugs() {
  return getPostSources().map((source) => source.slug);
}
