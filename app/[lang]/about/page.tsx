import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutGroupSection } from "@/components/AboutGroupSection";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "vi" ? "Về nhóm nghiên cứu" : "About the Lab" };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <AboutGroupSection lang={lang} showSectionLabel={false} />;
}
