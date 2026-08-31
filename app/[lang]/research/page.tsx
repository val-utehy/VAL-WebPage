import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isLocale, withLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "vi" ? "Nghiên cứu" : "Research" };
}

export default async function ResearchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  redirect(withLocale(isLocale(lang) ? lang : "en", "/about"));
}
