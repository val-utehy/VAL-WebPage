import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Content admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <Script src="https://unpkg.com/decap-cms@3.8.3/dist/decap-cms.js" strategy="afterInteractive" />
    </main>
  );
}
