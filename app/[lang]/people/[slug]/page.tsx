import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { assetPath } from "@/lib/assets";
import { getMember, getMemberSlugs } from "@/lib/members";
import { isLocale, locales, withLocale } from "@/lib/i18n";
import { getPublicationMemberNames, getPublicationsForMember } from "@/lib/publications";
import { PublicationRow } from "@/components/PublicationRow";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getMemberSlugs().map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const member = getMember(slug, lang);
  return member ? { title: member.displayName, description: `${member.role} · ${member.interests.join(", ")}` } : {};
}

export default async function MemberPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const member = getMember(slug, lang);
  if (!member) notFound();

  const back = lang === "vi" ? "Quay lại danh sách thành viên" : "Back to people";
  const interestsLabel = lang === "vi" ? "Hướng quan tâm" : "Research interests";
  const academicLabel = lang === "vi" ? "Hồ sơ học thuật" : "Academic profile";
  const degreeLabel = lang === "vi" ? "Học vị" : "Degree";
  const affiliationLabel = lang === "vi" ? "Đơn vị công tác" : "Affiliation";
  const educationLabel = lang === "vi" ? "Đào tạo" : "Education";
  const appointmentsLabel = lang === "vi" ? "Quá trình công tác" : "Appointments";
  const linksLabel = lang === "vi" ? "Liên kết" : "Links";
  const phoneLabel = lang === "vi" ? "Điện thoại" : "Phone";
  const sourceLabel = lang === "vi" ? "Nguồn hồ sơ công khai" : "Public profile source";
  const publicationsLabel = lang === "vi" ? "Công bố liên quan" : "Selected publications";
  const paragraphs = member.bio.split(/\n\s*\n/).filter(Boolean);
  const publications = getPublicationsForMember(member.slug);

  return (
    <section className="member-profile">
      <div className="member-profile__grid" aria-hidden="true" />
      <div className="shell member-profile__shell">
        <Link className="member-profile__back" href={withLocale(lang, "/people")}>← {back}</Link>
        <div className="member-profile__layout">
          <div className="member-profile__visual-column">
            <div className="member-profile__visual">
              {member.photo ? (
                <Image src={assetPath(member.photo)} alt={member.displayName} width={760} height={900} priority />
              ) : (
                <div className="member-profile__initials">{member.initials}</div>
              )}
            </div>
            <div className="member-profile__details">
              {(member.degree || member.affiliation || member.education.length || member.appointments.length) ? <section className="member-academic">
                <h2>{academicLabel}</h2>
                {member.degree ? <div><span>{degreeLabel}</span><p>{member.degree}</p></div> : null}
                {member.affiliation ? <div><span>{affiliationLabel}</span><p>{member.affiliation}</p></div> : null}
                {member.education.length ? <div className="member-academic__list"><span>{educationLabel}</span><ul>{member.education.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
                {member.appointments.length ? <div className="member-academic__list"><span>{appointmentsLabel}</span><ul>{member.appointments.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
              </section> : null}
              <aside className="member-profile__support">
                {member.interests.length ? <div><h2>{interestsLabel}</h2><div className="member-tags">{member.interests.map((interest) => <span key={interest}>{interest}</span>)}</div></div> : null}
                <div><h2>{linksLabel}</h2><div className="member-links">
                  {member.email ? <a href={`mailto:${member.email}`}>Email ↗</a> : null}
                  {member.phone ? <a href={`tel:${member.phone.replace(/\s/g, "")}`}>{phoneLabel} · {member.phone} ↗</a> : null}
                  {member.website ? <a href={member.website} target="_blank" rel="noreferrer">Website ↗</a> : null}
                  {member.github ? <a href={member.github} target="_blank" rel="noreferrer">GitHub ↗</a> : null}
                  {member.huggingface ? <a href={member.huggingface} target="_blank" rel="noreferrer">Hugging Face ↗</a> : null}
                  {member.scholar ? <a href={member.scholar} target="_blank" rel="noreferrer">Google Scholar ↗</a> : null}
                  {member.source ? <a href={member.source} target="_blank" rel="noreferrer">{sourceLabel} ↗</a> : null}
                </div></div>
              </aside>
            </div>
          </div>
          <article className="member-profile__content">
            <p className="eyebrow"><span /> {member.role}</p>
            <h1>{member.displayName}</h1>
            <div className="member-profile__bio">
              {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {publications.length ? <section className="member-publications member-publications--inline">
              <p className="eyebrow"><span /> {publicationsLabel}</p>
              <div className="publication-list">{publications.map((paper) => <PublicationRow key={paper.title} paper={paper} memberNames={getPublicationMemberNames(paper)} />)}</div>
            </section> : null}
          </article>
        </div>
      </div>
    </section>
  );
}
