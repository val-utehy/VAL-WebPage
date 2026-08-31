"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ResearchHighlightsSlider } from "./ResearchHighlightsSlider";

const ResearchMotionScene = dynamic(() => import("./ResearchMotionScene"), { ssr: false, loading: () => null });
type FilmCopy = { eyebrow: string; title: string; intro: string; label: string; note: string };

export function LabFilm({ copy }: { copy: FilmCopy }) {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => { const query = window.matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setReduceMotion(query.matches); update(); query.addEventListener("change", update); return () => query.removeEventListener("change", update); }, []);
  return <section className="film-section section--dark" aria-labelledby="film-title"><div className="film-three" aria-hidden="true">{reduceMotion ? null : <ResearchMotionScene />}</div><div className="film-grid-overlay" aria-hidden="true" /><div className="shell film-layout"><div className="film-copy"><p className="eyebrow"><span /> {copy.eyebrow}</p><h2 id="film-title">{copy.title}</h2><p>{copy.intro}</p><div className="film-meta"><span>{copy.label}</span><span>{copy.note}</span></div></div><div className="film-stage-wrap"><div className="film-stage film-stage--static" aria-label={copy.eyebrow}><ResearchHighlightsSlider /></div></div></div></section>;
}
