import Image from "next/image";
import { getDictionary } from "@/data/content";
import type { Locale } from "@/lib/i18n";
import { assetPath } from "@/lib/assets";
import { AboutGroupReveal } from "./AboutGroupReveal";

function PrincipleIcon({ index }: { index: number }) {
  const common = { width: 25, height: 25, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (index === 0) return <svg {...common}><path d="M2.5 12s3.4-5 9.5-5 9.5 5 9.5 5-3.4 5-9.5 5S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.3" /><path d="m18.2 3 .45 2.25L21 5.7l-2.35.45L18.2 8.5l-.45-2.35-2.25-.45 2.25-.45L18.2 3Z" /></svg>;
  if (index === 1) return <svg {...common}><circle cx="5" cy="7" r="2" /><circle cx="18.5" cy="6.5" r="2" /><circle cx="12" cy="17" r="2.2" /><path d="m6.8 8.1 3.7 6.7M16.8 8.2l-3.5 6.5M7 7.1l9.5-.4" /></svg>;
  return <svg {...common}><path d="M5 18 18.5 4.5" /><path d="M10 4.5h8.5V13" /><path d="M5 7.5v10h10" /></svg>;
}

function SocialIcon({ name }: { name: "facebook" | "github" | "huggingface" | "email" }) {
  if (name === "facebook") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.6 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.4V13h2.8v8h3.4Z" /></svg>;
  if (name === "github") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.5 2.3 1.1 2.9.8.1-.6.4-1.1.7-1.3-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.4 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" /></svg>;
  if (name === "huggingface") return <span aria-hidden="true">🤗</span>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5h17v13h-17zM4.5 6.5 12 12l7.5-5.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function AboutGroupSection({ lang, showSectionLabel = true }: { lang: Locale; showSectionLabel?: boolean }) {
  const copy = getDictionary(lang).pages.about;
  const photos = [
    { className: "about-collage__item--group", src: "/about/team-group.jpg", alt: "Vision and Learning Lab members together" },
    { className: "about-collage__item--dinner", src: "/about/team-dinner.jpg", alt: "Vision and Learning Lab members sharing a meal" },
    { className: "about-collage__item--presentation", src: "/about/research-presentation.jpg", alt: "Research presentation at Vision and Learning Lab" },
    { className: "about-collage__item--meeting", src: "/about/research-meeting.jpg", alt: "Research meeting with Vision and Learning Lab collaborators" },
  ];
  const socialLinks = [
    { name: "facebook" as const, label: "Facebook", detail: "Updates & community", href: "https://www.facebook.com/profile.php?id=61591226464518" },
    { name: "github" as const, label: "GitHub", detail: "Code & open projects", href: "https://github.com/val-utehy" },
    { name: "huggingface" as const, label: "Hugging Face", detail: "Models & datasets", href: "https://huggingface.co/val-utehy" },
    { name: "email" as const, label: "Email", detail: "Collaborate with us", href: "mailto:vallab.utehy@gmail.com" },
  ];

  return (
    <AboutGroupReveal>
      <div className={`shell about-page__shell${showSectionLabel ? "" : " about-page__shell--detail"}`}>
        <div className="about-page__lead">
          <div className="about-page__copy">
            <header className="about-page__header">
              {showSectionLabel ? <p className="about-page__eyebrow" data-about-reveal><b>01</b><em>{copy.eyebrow}</em></p> : null}
              <h1 data-about-reveal>{copy.titleLead}<br /><strong>{copy.titleAccent}</strong><br />{copy.titleTail}</h1>
              <p data-about-reveal>{copy.intro}</p>
            </header>
            <div className="about-principles">
              {copy.paragraphs.map((paragraph, index) => (
                <article key={paragraph} data-about-reveal>
                  <span><PrincipleIcon index={index} /></span>
                  <p>{paragraph}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="about-collage" data-about-reveal>
            {photos.map((photo) => (
              <figure className={`about-collage__item ${photo.className}`} key={photo.src}>
                <Image src={assetPath(photo.src)} alt={photo.alt} fill sizes="(max-width: 820px) 100vw, 50vw" />
              </figure>
            ))}
          </div>
        </div>
        <section className="about-connect" data-about-reveal aria-label="Connect with Vision and Learning Lab">
          <div className="about-connect__heading">
            <h2>Explore <em>VAL Lab</em></h2>
            <p>Updates, open resources, and ways to collaborate.</p>
          </div>
          <div className="about-connect__links">
            {socialLinks.map((link) => <a href={link.href} key={link.name} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}><i className={`about-connect__icon--${link.name}`}><SocialIcon name={link.name} /></i><div><strong>{link.label}</strong><small>{link.detail}</small></div><b aria-hidden="true">↗</b></a>)}
          </div>
        </section>
      </div>
    </AboutGroupReveal>
  );
}
