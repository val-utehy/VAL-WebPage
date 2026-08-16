import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { LocaleDocument } from "@/components/LocaleDocument";
import { Footer } from "@/components/Footer";
import { assetPath } from "@/lib/assets";
import { getDictionary } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";


function getMetadataBase() {
  const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const owner = process.env.GITHUB_REPOSITORY_OWNER;
  if (repository?.endsWith(".github.io")) return new URL(`https://${repository}`);
  if (owner && repository) return new URL(`https://${owner}.github.io/`);
  return new URL("http://localhost:3000");
}

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dictionary = getDictionary(locale);

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: "Vision and Learning Lab",
      template: "%s · Vision and Learning Lab",
    },
    description: dictionary.metadata.description,
    alternates: {
      languages: {
        en: assetPath("/en/"),
        vi: assetPath("/vi/"),
      },
    },
    openGraph: {
      title: "Vision and Learning Lab",
      description: dictionary.metadata.description,
      images: [assetPath("/brand/vl-lab-logo.png")],
      locale: locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dictionary = getDictionary(lang);
  return (
    <>
      <LocaleDocument lang={lang} />
      <Header lang={lang} copy={dictionary.nav} brand={dictionary.brand} />
      <main>{children}</main>
      <Footer lang={lang} copy={dictionary.footer} brand={dictionary.brand} nav={dictionary.nav} />
    </>
  );
}
