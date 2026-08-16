import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
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
    var stored = localStorage.getItem("vllab-theme");
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var resolved = stored === "light" || stored === "dark"
      ? stored
      : (systemDark ? "dark" : "light");
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeSource = stored || "system";
    document.documentElement.style.colorScheme = resolved;
  } catch (error) {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
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
      </body>
    </html>
  );
}
