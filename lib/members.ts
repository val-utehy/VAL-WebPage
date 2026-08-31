import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n";

export const memberGroups = ["faculty", "phd_student", "masters_student", "undergraduate_researcher", "research_associate", "alumni"] as const;
export type MemberGroup = (typeof memberGroups)[number];

export type Member = {
  slug: string;
  name: string;
  displayName: string;
  role: string;
  group: MemberGroup;
  order: number;
  initials: string;
  photo?: string;
  email?: string;
  phone?: string;
  website?: string;
  github?: string;
  huggingface?: string;
  scholar?: string;
  degree?: string;
  affiliation?: string;
  education: string[];
  appointments: string[];
  interests: string[];
  bio: string;
  source?: string;
};

const membersDirectory = path.join(process.cwd(), "content", "members");
type MemberSource = { slug: string; filepath: string };

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

function splitList(value?: string) {
  return value
    ? value.split("|").map((item) => item.trim()).filter(Boolean)
    : [];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function findProfilePhoto(slug: string) {
  const imagesDirectory = path.join(membersDirectory, slug, "images");
  if (!fs.existsSync(imagesDirectory)) return undefined;
  const file = fs.readdirSync(imagesDirectory, { withFileTypes: true })
    .find((entry) => entry.isFile() && path.parse(entry.name).name.toLowerCase() === "profile");
  return file ? `/members/${slug}/images/${file.name}` : undefined;
}

function memberPhoto(slug: string, value?: string) {
  if (!value) return findProfilePhoto(slug);
  if (value.startsWith("/")) return value;
  return `/members/${slug}/${value.replace(/^\/?/, "")}`;
}

function getMemberSources(): MemberSource[] {
  if (!fs.existsSync(membersDirectory)) return [];
  return fs.readdirSync(membersDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .flatMap((entry) => {
      const filepath = path.join(membersDirectory, entry.name, "main.md");
      return fs.existsSync(filepath) ? [{ slug: entry.name, filepath }] : [];
    });
}

function toMember(source: MemberSource, locale: Locale): Member | null {
  const { slug, filepath } = source;
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  if (data.draft === "true" || !data.name) return null;

  const localizedName = locale === "vi" ? data.nameVi || data.name : data.name;
  const localizedRole = locale === "vi" ? data.roleVi || data.role : data.role;
  const localizedInterests = locale === "vi"
    ? splitList(data.interestsVi || data.interests)
    : splitList(data.interests);
  const localizedEducation = locale === "vi"
    ? splitList(data.educationVi || data.education)
    : splitList(data.education);
  const localizedAppointments = locale === "vi"
    ? splitList(data.appointmentsVi || data.appointments)
    : splitList(data.appointments);
  /* Frontmatter is line-based, so a multi-paragraph Vietnamese bio writes
     its paragraph breaks as the two characters \n, restored here. */
  const localizedBio = locale === "vi"
    ? (data.bioVi ? data.bioVi.replace(/\\n/g, "\n") : body)
    : body;

  return {
    slug,
    name: data.name,
    displayName: localizedName,
    role: localizedRole || "Member",
    group: memberGroups.includes(data.group as MemberGroup) ? (data.group as MemberGroup) : "research_associate",
    order: Number(data.order || 100),
    initials: data.initials || initials(localizedName),
    photo: memberPhoto(slug, data.photo),
    email: data.email || undefined,
    phone: data.phone || undefined,
    website: data.website || undefined,
    github: data.github || undefined,
    huggingface: data.huggingface || undefined,
    scholar: data.scholar || undefined,
    degree: locale === "vi" ? data.degreeVi || data.degree : data.degree || undefined,
    affiliation: locale === "vi" ? data.affiliationVi || data.affiliation : data.affiliation || undefined,
    education: localizedEducation,
    appointments: localizedAppointments,
    interests: localizedInterests,
    bio: localizedBio,
    source: data.source || undefined,
  };
}

export function getAllMembers(locale: Locale): Member[] {
  return getMemberSources()
    .map((source) => toMember(source, locale))
    .filter((member): member is Member => Boolean(member))
    .sort((a, b) => a.order - b.order || a.displayName.localeCompare(b.displayName));
}

export function getMember(slug: string, locale: Locale) {
  return getAllMembers(locale).find((member) => member.slug === slug);
}

export function getMemberSlugs() {
  return getMemberSources().map((source) => source.slug);
}
