import { getDictionary } from "@/data/content";
import { getSiteData } from "@/data/site";
import type { Locale } from "@/lib/i18n";
import { AboutGroupReveal } from "./AboutGroupReveal";

function ResearchThemeIcon({ index }: { index: number }) {
  const common = { width: 19, height: 19, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (index === 0) return <svg {...common}><path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" /><circle cx="12" cy="12" r="2.4" /></svg>;
  if (index === 1) return <svg {...common}><circle cx="6" cy="7" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="12" cy="17" r="2" /><path d="m7.8 8.2 2.5 6.5M16.2 9.3l-2.6 5.4M8 7.3l7.8.5" /></svg>;
  if (index === 2) return <svg {...common}><path d="m12 3 7 4v9l-7 4-7-4V7l7-4Z" /><path d="m5 7 7 4 7-4M12 11v9" /></svg>;
  return <svg {...common}><path d="m12 3 .9 5.2L18 10l-5.1.9L12 16l-.9-5.1L6 10l5.1-1.8L12 3Z" /><path d="m19 16 .4 2.6L22 19l-2.6.4L19 22l-.4-2.6L16 19l2.6-.4L19 16Z" /></svg>;
}

export function AboutGroupSection({ lang }: { lang: Locale }) {
  const copy = getDictionary(lang).pages.about;
  const { researchAreas } = getSiteData(lang);

  return (
    <AboutGroupReveal>
      <div className="shell about-page__shell">
        <header className="about-page__header">
          <p className="about-page__eyebrow" data-about-reveal>{copy.eyebrow}</p>
          <h1 data-about-reveal>{copy.title}</h1>
          <p data-about-reveal>{copy.intro}</p>
        </header>
        <div className="about-page__body">
          <div className="about-page__copy">
            {copy.paragraphs.map((paragraph) => <p key={paragraph} data-about-reveal>{paragraph}</p>)}
          </div>
          <aside className="about-page__themes" data-about-reveal>
            <h2>{copy.themesTitle}</h2>
            {researchAreas.map((area, index) => (
              <article className="about-theme" key={area.title} data-about-reveal>
                <span><ResearchThemeIcon index={index} /></span>
                <div><h3>{area.title}</h3><p>{area.description}</p></div>
              </article>
            ))}
          </aside>
        </div>
      </div>
    </AboutGroupReveal>
  );
}
