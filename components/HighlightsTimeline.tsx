"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import type { Highlight } from "@/lib/highlights";

function dateParts(item: Highlight, lang: Locale) {
  const value = new Date(`${item.date}T00:00:00`);
  return {
    year: item.timelineYear || new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", { year: "numeric" }).format(value),
    month: item.timelineMonth ?? new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-US", { month: "short" }).format(value).replace(".", "").toUpperCase(),
  };
}

export function HighlightsTimeline({ highlights, lang, compact = false }: { highlights: Highlight[]; lang: Locale; compact?: boolean }) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (compact || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeline = timelineRef.current;
    if (!timeline) return;
    const items = Array.from(timeline.querySelectorAll<HTMLElement>("[data-timeline-item]"));
    let frame = 0;
    const update = () => {
      const viewport = window.innerHeight;
      const focusLine = viewport * 0.54;
      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - focusLine);
        const visibility = Math.max(0.08, Math.min(1, 1 - Math.max(0, distance - viewport * 0.08) / (viewport * 0.64)));
        item.style.setProperty("--timeline-visibility", visibility.toFixed(3));
        item.style.setProperty("--timeline-shift", `${Math.min(20, distance * 0.025).toFixed(1)}px`);
      }
      const bounds = timeline.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (focusLine - bounds.top) / Math.max(bounds.height, 1)));
      timeline.style.setProperty("--timeline-progress", progress.toFixed(3));
      frame = 0;
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => { window.removeEventListener("scroll", requestUpdate); window.removeEventListener("resize", requestUpdate); if (frame) window.cancelAnimationFrame(frame); };
  }, [compact, highlights.length]);

  if (!highlights.length) return <p className="content-note">{lang === "vi" ? "Điểm nhấn sẽ được cập nhật sớm." : "Highlights will be updated soon."}</p>;

  if (compact) {
    return <div className="highlights-list">{highlights.map((item) => { const date = dateParts(item, lang); return <article className="highlights-list__item" key={item.slug}><div><time dateTime={item.date}>{date.month ? `${date.month} ` : ""}{date.year}</time><h3><Link href={withLocale(lang, `/highlights/${item.slug}`)}>{item.title}</Link></h3></div><Link aria-label={item.title} href={withLocale(lang, `/highlights/${item.slug}`)}>↗</Link></article>; })}</div>;
  }

  return <div className="highlights-timeline" ref={timelineRef}>
    {highlights.map((item) => {
      const date = dateParts(item, lang);
      return <article className={`highlight-timeline__item is-${item.side}${item.featured ? " is-featured" : ""}`} data-timeline-item key={item.slug}>
        <time className="highlight-timeline__date" dateTime={item.date}><strong>{date.year}</strong>{date.month ? <span>{date.month}</span> : null}</time>
        <span className="highlight-timeline__node" aria-hidden="true" />
        <div className="highlight-timeline__card"><span>{item.category}</span><h2><Link href={withLocale(lang, `/highlights/${item.slug}`)}>{item.title}</Link></h2><p>{item.excerpt}</p><Link className="highlight-timeline__arrow" aria-label={item.title} href={withLocale(lang, `/highlights/${item.slug}`)}>↗</Link></div>
      </article>;
    })}
  </div>;
}
