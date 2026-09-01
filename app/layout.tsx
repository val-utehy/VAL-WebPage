import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import "@fontsource-variable/nunito/wght.css";
import "@fontsource-variable/roboto/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-locale="en"
      data-theme="light"
      data-theme-source="fixed"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
