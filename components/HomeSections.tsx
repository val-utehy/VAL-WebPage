import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import { getDictionary } from "@/data/content";
import { getSiteData } from "@/data/site";
import { getAllMembers } from "@/lib/members";
import { SectionHeading } from "./SectionHeading";
import { MemberCard } from "./MemberCard";
import { IntroStats } from "./IntroStats";
import { ResearchAreasGrid } from "./ResearchAreasGrid";
import { PublicationRow } from "./PublicationRow";
import { getPublicationMemberNames, getPublications } from "@/lib/publications";
import { getAllPosts } from "@/lib/posts";
import { NewsList } from "./NewsList";

/**
 * CANONICAL INTRODUCTION PROMPT
 * Premium academic AI-lab website for Vision and Learning Lab. Keep the existing
 * identity and information architecture. Use restrained copper-orange, generous
 * whitespace, rounded editorial typography and quiet Three.js depth. Keep the hero
 * focused on one slowly moving VL mark, soft studio light and a very small amount of
 * visual dust—no scan beams, neon networks or dense particles. Support English and
 * Vietnamese, preserving legibility for Vietnamese diacritics. Include one cinematic
 * film section and one Markdown-driven gallery without turning the site into a gaming
 * landing page.
 */
export function Introduction({ lang }: { lang: Locale }) {
  const dictionary = getDictionary(lang);
  const { stats } = getSiteData(lang);
  return (
    <section id="introduction" className="section section--light intro-section">
      <div className="shell">
        <SectionHeading
          index="01"
          eyebrow={dictionary.introduction.eyebrow}
          title={dictionary.introduction.title}
          intro={dictionary.introduction.intro}
        />
        <IntroStats stats={stats} />
      </div>
    </section>
  );
}

export function ResearchPreview({ lang }: { lang: Locale }) {
  const dictionary = getDictionary(lang);
  const { researchAreas } = getSiteData(lang);
  return (
    <section className="section section--paper research-preview">
      <div className="shell">
        <SectionHeading index="03" eyebrow={dictionary.research.eyebrow} title={dictionary.research.title} />
        <ResearchAreasGrid areas={researchAreas} />
        <div className="section-link"><Link href={withLocale(lang, "/research")}>{dictionary.research.link} <span>↗</span></Link></div>
      </div>
    </section>
  );
}

export function PublicationsPreview({ lang }: { lang: Locale }) {
  const dictionary = getDictionary(lang);
  const publications = getPublications();
  return (
    <section className="section section--dark">
      <div className="shell">
        <SectionHeading index="05" eyebrow={dictionary.publications.eyebrow} title={dictionary.publications.title} />
        <div className="publication-list">
          {publications.slice(0, 4).map((paper) => <PublicationRow key={paper.title} paper={paper} memberNames={getPublicationMemberNames(paper)} />)}
        </div>
        <div className="section-link section-link--light"><Link href={withLocale(lang, "/publications")}>{dictionary.publications.link} <span>↗</span></Link></div>
      </div>
    </section>
  );
}

export function PeoplePreview({ lang }: { lang: Locale }) {
  const dictionary = getDictionary(lang);
  const people = getAllMembers(lang).slice(0, 4);
  return (
    <section className="section section--light">
      <div className="shell">
        <SectionHeading index="06" eyebrow={dictionary.people.eyebrow} title={dictionary.people.title} />
        <div className="people-grid">
          {people.map((member, index) => (
            <MemberCard key={member.slug} member={member} lang={lang} index={index} />
          ))}
        </div>
        <div className="section-link"><Link href={withLocale(lang, "/people")}>{dictionary.people.link} <span>↗</span></Link></div>
      </div>
    </section>
  );
}

export function NewsAndPartners({ lang }: { lang: Locale }) {
  const dictionary = getDictionary(lang);
  const { partners } = getSiteData(lang);
  const posts = getAllPosts(lang).slice(0, 3);
  return (
    <section className="section section--paper">
      <div className="shell news-partners-grid">
        <div>
          <SectionHeading index="07" eyebrow={dictionary.latest.eyebrow} title={dictionary.latest.title} />
          <NewsList posts={posts} lang={lang} compact />
          <div className="section-link"><Link href={withLocale(lang, "/news")}>{dictionary.latest.link} <span>↗</span></Link></div>
        </div>
        <aside className="partners-panel">
          <p className="eyebrow"><span /> {dictionary.collaborators.eyebrow}</p>
          <h3>{dictionary.collaborators.title}</h3>
          <div className="partner-cloud">{partners.map((partner) => <span key={partner}>{partner}</span>)}</div>
        </aside>
      </div>
    </section>
  );
}

export function JoinBanner({ lang }: { lang: Locale }) {
  const dictionary = getDictionary(lang);
  return (
    <section className="join-banner">
      <div className="join-grid" aria-hidden="true" />
      <div className="shell join-inner">
        <p className="eyebrow"><span /> {dictionary.joinBanner.eyebrow}</p>
        <h2>{dictionary.joinBanner.title1}<br />{dictionary.joinBanner.title2}</h2>
        <p>{dictionary.joinBanner.intro}</p>
        <Link className="button button--primary" href={withLocale(lang, "/join")}>{dictionary.joinBanner.cta} <span>↗</span></Link>
      </div>
    </section>
  );
}
