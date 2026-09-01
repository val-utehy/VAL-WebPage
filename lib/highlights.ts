import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n";

export type Highlight = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  side: "left" | "right";
  timelineYear?: string;
  timelineMonth?: string;
  cover?: string;
  coverAlt: string;
  author?: string;
  body: string;
  featured: boolean;
};

const highlightsDirectory = path.join(process.cwd(), "content", "highlights");

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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    data[key] = value;
  }
  return { data, body: raw.slice(end + 4).trim() };
}

function highlightCover(slug: string, value?: string) {
  if (!value) return undefined;
  if (value.startsWith("/")) return value;
  return `/highlights/${slug}/images/${value.replace(/^images\//, "")}`;
}

function toHighlight(slug: string, filepath: string, locale: Locale): Highlight | null {
  const { data, body } = parseFrontmatter(fs.readFileSync(filepath, "utf8"));
  if (data.draft === "true" || !data.title || !data.date) return null;
  const title = locale === "vi" ? data.titleVi || data.title : data.title;
  const excerpt = locale === "vi" ? data.excerptVi || data.excerpt || body : data.excerpt || body;
  return {
    slug, title, excerpt, date: data.date,
    category: locale === "vi" ? data.categoryVi || data.category || "Điểm nhấn" : data.category || "Highlight",
    side: data.side === "left" ? "left" : "right",
    timelineYear: locale === "vi" ? data.timelineYearVi ?? data.timelineYear : data.timelineYear,
    timelineMonth: locale === "vi" ? data.timelineMonthVi ?? data.timelineMonth : data.timelineMonth,
    cover: highlightCover(slug, data.cover),
    coverAlt: locale === "vi" ? data.coverAltVi || data.coverAlt || title : data.coverAlt || title,
    author: locale === "vi" ? data.authorVi || data.author : data.author,
    body: locale === "vi" ? data.bodyVi || body : body,
    featured: data.featured === "true",
  };
}

function getHighlightSources() {
  if (!fs.existsSync(highlightsDirectory)) return [];
  return fs.readdirSync(highlightsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .flatMap((entry) => {
      const filepath = path.join(highlightsDirectory, entry.name, "index.md");
      return fs.existsSync(filepath) ? [{ slug: entry.name, filepath }] : [];
    });
}

export function getAllHighlights(locale: Locale) {
  return getHighlightSources().map((source) => toHighlight(source.slug, source.filepath, locale)).filter((item): item is Highlight => Boolean(item)).sort((a, b) => b.date.localeCompare(a.date));
}

export function getHighlight(slug: string, locale: Locale) {
  return getAllHighlights(locale).find((item) => item.slug === slug);
}

export function getHighlightSlugs() {
  return getHighlightSources().map((source) => source.slug);
}
