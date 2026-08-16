"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ResearchArea } from "@/data/site";

export function ResearchAreasGrid({ areas }: { areas: ResearchArea[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.16 });
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={gridRef} className={`research-grid research-grid--reveal${visible ? " is-visible" : ""}`}>
      {areas.map((area, index) => (
        <article key={area.title} className="research-card" style={{ "--research-delay": `${index * 100}ms` } as CSSProperties}>
          <p>{area.eyebrow}</p>
          <h3>{area.title}</h3>
          <span className={`research-orbit research-orbit--${index + 1}`} aria-hidden="true"><i /><b /><em /></span>
          <div className="research-card-copy">
            <p>{area.description}</p>
            <ul>{area.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          </div>
        </article>
      ))}
    </div>
  );
}
