import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n";

export type GalleryItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  images: string[];
  alt: string;
  order: number;
  featured: boolean;
};

const galleryDirectory = path.join(process.cwd(), "content", "gallery");

function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---")) return { data: {} as Record<string, string>, body: raw.trim() };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { data: {} as Record<string, string>, body: raw.trim() };

  const frontmatter = raw.slice(4, end).trim();
  const body = raw.slice(end + 4).trim();
  const data: Record<string, string> = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, body };
}

function toGalleryItem(slug: string, filepath: string, locale: Locale): GalleryItem | null {
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  if (data.draft === "true" || !data.title || !data.image) return null;

  const cover = data.image.startsWith("/") ? data.image : `/gallery/${slug}/images/${data.image.replace(/^images\//, "")}`;
  const imagesDirectory = path.join(galleryDirectory, slug, "images");
  const albumImages = fs.existsSync(imagesDirectory)
    ? fs.readdirSync(imagesDirectory)
      .filter((filename) => /\.(avif|gif|jpe?g|png|webp)$/i.test(filename))
      .sort((a, b) => a.localeCompare(b))
      .map((filename) => `/gallery/${slug}/images/${filename}`)
    : [];

  return {
    slug,
    title: locale === "vi" ? data.titleVi || data.title : data.title,
    description: locale === "vi" ? data.descriptionVi || body : body,
    date: data.date || "",
    category: locale === "vi" ? data.categoryVi || data.category || "Gallery" : data.category || "Gallery",
    image: cover,
    images: [cover, ...albumImages.filter((image) => image !== cover)],
    alt: locale === "vi" ? data.altVi || data.alt || data.titleVi || data.title : data.alt || data.title,
    order: Number(data.order || 100),
    featured: data.featured === "true",
  };
}

export function getGalleryItems(locale: Locale) {
  if (!fs.existsSync(galleryDirectory)) return [];
  return fs
    .readdirSync(galleryDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => toGalleryItem(entry.name, path.join(galleryDirectory, entry.name, "index.md"), locale))
    .filter((item): item is GalleryItem => Boolean(item))
    .sort((a, b) => a.order - b.order || b.date.localeCompare(a.date));
}
