"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";

const LabScene = dynamic(() => import("./LabScene"), {
  ssr: false,
  loading: () => <div className="hero-fallback" aria-hidden="true" />,
});

type HeroCopy = {
  eyebrow: string;
  line1: string;
  line2: string;
  lead: string;
  primary: string;
  secondary: string;
  scroll: string;
};

export function Hero({ lang, copy }: { lang: Locale; copy: HeroCopy }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <section className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-scene" aria-hidden="true">
        {reduceMotion ? <div className="hero-fallback" /> : <LabScene />}
      </div>
      <div className="shell hero-content">
        <div className="hero-copy hero-copy--animated">
          <p className="eyebrow"><span /> {copy.eyebrow}</p>
          <h1>
            {copy.line1}<br />
            <em>{copy.line2}</em>
          </h1>
          <p className="hero-lead">{copy.lead}</p>
          <div className="hero-actions">
            <Link className="button button--primary" href={withLocale(lang, "/research")}>
              {copy.primary} <span>↗</span>
            </Link>
            <Link className="button button--ghost" href={withLocale(lang, "/publications")}>
              {copy.secondary} <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
      <a className="scroll-cue" href="#introduction" aria-label={copy.scroll}>
        <span />
      </a>
    </section>
  );
}
