import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { MemberCard } from "@/components/MemberCard";
import { getDictionary } from "@/data/content";
import { getAllMembers, type MemberGroup } from "@/lib/members";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "vi" ? "Thành viên" : "People" };
}

const groupOrder: MemberGroup[] = ["faculty", "phd_student", "masters_student", "undergraduate_researcher", "research_associate", "alumni"];

export default async function PeoplePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getDictionary(lang).pages.people;
  const members = getAllMembers(lang);
  const labels = lang === "vi"
    ? { faculty: "Giảng viên", phd_student: "Nghiên cứu sinh", masters_student: "Học viên cao học", undergraduate_researcher: "Sinh viên nghiên cứu", research_associate: "Cộng tác viên nghiên cứu", alumni: "Cựu thành viên" }
    : { faculty: "Faculty", phd_student: "PhD Students", masters_student: "Master’s Students", undergraduate_researcher: "Undergraduate Researchers", research_associate: "Research Associates", alumni: "Alumni" };

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
      <section className="section section--light people-directory-section">
        <div className="shell member-directory">
          {groupOrder.map((group) => {
            const groupMembers = members.filter((member) => member.group === group);
            if (!groupMembers.length) return null;
            return (
              <section className="member-group" key={group}>
                <div className="member-group__heading">
                  <span>{String(groupOrder.indexOf(group) + 1).padStart(2, "0")}</span>
                  <h2>{labels[group]}</h2>
                </div>
                <div className="people-grid people-grid--page">
                  {groupMembers.map((member, index) => (
                    <MemberCard key={member.slug} member={member} lang={lang} index={index} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}
