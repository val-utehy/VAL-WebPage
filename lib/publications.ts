import fs from "node:fs";
import path from "node:path";
import { getAllMembers, type MemberGroup } from "@/lib/members";

export type PublicationCategory = "Books" | "Journal Papers" | "Conference Papers";
export type Publication = {
  title: string;
  authors: string[];
  memberSlugs: string[];
  venue: string;
  year: number;
  category: PublicationCategory;
  highlight?: string;
  url?: string;
};

const membersDirectory = path.join(process.cwd(), "content", "members");
const groupPriority: Record<MemberGroup, number> = {
  faculty: 0,
  phd_student: 1,
  masters_student: 2,
  undergraduate_researcher: 3,
  research_associate: 3,
  alumni: 4,
};

function splitList(value?: string) {
  return value?.split("|").map((item) => item.trim()).filter(Boolean) ?? [];
}

function parsePublicationRecord(record: string): Publication | null {
  const fields: Record<string, string> = {};
  for (const line of record.split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1 || line.trimStart().startsWith("<!--")) continue;
    fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  if (!fields.title || !fields.venue || !fields.year || !fields.category) return null;
  if (!["Books", "Journal Papers", "Conference Papers"].includes(fields.category)) return null;

  return {
    title: fields.title,
    authors: splitList(fields.authors),
    memberSlugs: splitList(fields.members),
    venue: fields.venue,
    year: Number(fields.year),
    category: fields.category as PublicationCategory,
    highlight: fields.highlight || undefined,
    url: fields.url || undefined,
  };
}

function priorityForPublication(publication: Publication) {
  const groupsBySlug = new Map(getAllMembers("en").map((member) => [member.slug, member.group]));
  return Math.min(...publication.memberSlugs.map((slug) => groupPriority[groupsBySlug.get(slug) ?? "alumni"]), 99);
}

export function getPublications(): Publication[] {
  if (!fs.existsSync(membersDirectory)) return [];
  const sources = fs.readdirSync(membersDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .flatMap((entry) => {
      const file = path.join(membersDirectory, entry.name, "publications.md");
      return fs.existsSync(file) ? [{ memberSlug: entry.name, file }] : [];
    });

  const merged = new Map<string, Publication>();
  for (const source of sources) {
    const records = fs.readFileSync(source.file, "utf8")
      .split(/^---\s*$/m)
      .map(parsePublicationRecord)
      .filter((publication): publication is Publication => Boolean(publication));
    for (const record of records) {
      const key = record.url || record.title.toLocaleLowerCase();
      const existing = merged.get(key);
      merged.set(key, existing
        ? { ...existing, memberSlugs: [...new Set([...existing.memberSlugs, source.memberSlug])] }
        : { ...record, memberSlugs: [source.memberSlug] });
    }
  }

  const publications = [...merged.values()];
  return publications.sort((a, b) => b.year - a.year || priorityForPublication(a) - priorityForPublication(b));
}

export function getPublicationsForMember(memberSlug: string) {
  return getPublications().filter((publication) => publication.memberSlugs.includes(memberSlug));
}

export function getPublicationMemberNames(publication: Publication) {
  const namesBySlug = new Map(getAllMembers("en").map((member) => [member.slug, member.name]));
  return publication.memberSlugs.flatMap((slug) => namesBySlug.get(slug) ? [namesBySlug.get(slug)!] : []);
}
