import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import "@fontsource-variable/nunito/wght.css";
import "@fontsource-variable/roboto/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/brand/vl-lab-logo.png", type: "image/png" }],
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
