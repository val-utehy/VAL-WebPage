import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { getDictionary } from "@/data/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "vi" ? "Tham gia" : "Join" };
}

export default async function JoinPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getDictionary(lang).pages.join;
  const contact = getDictionary(lang).pages.contact;

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
      <section className="section section--paper"><div className="shell join-page-grid">
        <div>{copy.roles.map(([title, description], index) => <article className="role-card" key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{description}</p></article>)}</div>
        <aside className="application-card"><p className="eyebrow"><span /> {copy.application}</p><h2>{copy.applicationTitle}</h2><p>{copy.applicationCopy}</p><a className="button button--primary" href="mailto:vallab.utehy@gmail.com">{copy.email} <span>↗</span></a></aside>
      </div></section>
      <section id="contact" className="section section--light join-contact-section">
        <div className="shell">
          <header className="join-contact__heading">
            <p className="eyebrow"><span /> {contact.eyebrow}</p>
            <h2>{contact.title}</h2>
            <p>{contact.intro}</p>
          </header>
          <div className="contact-grid">
            <div className="contact-card"><span>{contact.email}</span><h3>vallab.utehy@gmail.com</h3><p>{contact.emailCopy}</p></div>
            <div className="contact-card"><span>{contact.location}</span><h3>{contact.locationTitle}</h3><p>{contact.locationCopy}</p></div>
            <div className="contact-map">
              <iframe
                title={lang === "vi" ? "Bản đồ Khoa Công nghệ Thông tin UTEHY, Cơ sở 2" : "Map to UTEHY Faculty of Information Technology, Campus 2"}
                src="https://www.google.com/maps?q=Khoa%20C%C3%B4ng%20ngh%E1%BB%87%20Th%C3%B4ng%20tin%2C%20UTEHY%2C%20Nh%C3%A2n%20H%C3%B2a%2C%20M%E1%BB%B9%20H%C3%A0o%2C%20H%C6%B0ng%20Y%C3%AAn&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
