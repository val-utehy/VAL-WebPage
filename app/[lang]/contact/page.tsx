import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { withLocale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "vi" ? "Liên hệ" : "Contact" };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  redirect(`${withLocale(lang, "/join")}#contact`);
}
