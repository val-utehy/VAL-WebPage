import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { ScrollReveal } from "@/components/ScrollReveal";
import "@fontsource-variable/nunito/wght.css";
import "@fontsource-variable/roboto/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/brand/vl-lab-logo.png", type: "image/png" }],
    apple: [{ url: "/brand/vl-lab-logo.png", type: "image/png" }],
  },
};

const themeScript = `
(function () {
  try {
    document.documentElement.classList.add("js");
    document.documentElement.dataset.theme = "light";
    document.documentElement.dataset.themeSource = "fixed";
    document.documentElement.style.colorScheme = "light";
  } catch (error) {
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-locale="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Script id="vllab-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
