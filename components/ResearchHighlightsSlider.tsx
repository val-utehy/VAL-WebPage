"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/assets";

const slideDuration = 4000;
type Highlight = { title: string; description: string; image: string; video?: string };
const highlights: Highlight[] = [
  { title: "Machine & deep learning", description: "Robust representations learned from visual data.", image: "/research-highlights/machine-deep-learning.jpg" },
  { title: "Image-to-image translation", description: "Turning visual inputs into useful new representations.", image: "/research-highlights/image-to-image.jpg" },
  { title: "Enhancement & restoration", description: "Recovering detail and improving image quality.", image: "/research-highlights/enhancement-restoration.jpg" },
  { title: "Object detection & tracking", description: "Understanding objects and movement across time.", image: "/research-highlights/detection-tracking.jpg", video: "/research-highlights/detection-tracking.mp4" },
  { title: "Crowd counting", description: "Estimating density and scale in complex scenes.", image: "/research-highlights/crowd-counting.jpg" },
];

export function ResearchHighlightsSlider() {
  const [active, setActive] = useState(0); const [failedImages, setFailedImages] = useState<number[]>([]); const [failedVideos, setFailedVideos] = useState<number[]>([]);
  useEffect(() => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const timer = window.setTimeout(() => setActive((current) => (current + 1) % highlights.length), slideDuration); return () => window.clearTimeout(timer); }, [active]);
  const select = (index: number) => setActive((index + highlights.length) % highlights.length);
  return <div className="research-slider" aria-roledescription="carousel" aria-label="Research highlights"><div className="research-slider__viewport">{highlights.map((highlight, index) => { const hasImage = !failedImages.includes(index); const hasVideo = Boolean(highlight.video) && !failedVideos.includes(index); return <article className={`research-slide${index === active ? " is-active" : ""}`} key={highlight.title} aria-hidden={index !== active}>{hasVideo ? <video className="research-slide__image" autoPlay muted loop playsInline preload="metadata" onError={() => setFailedVideos((current) => current.includes(index) ? current : [...current, index])}><source src={assetPath(highlight.video ?? "")} type="video/mp4" /></video> : hasImage && <Image src={assetPath(highlight.image)} alt="" fill sizes="(max-width: 980px) 100vw, 60vw" className="research-slide__image" onError={() => setFailedImages((current) => current.includes(index) ? current : [...current, index])} />}<div className="research-slide__fallback" aria-hidden="true"><span /><span /><span /></div><div className="research-slide__copy"><span>{String(index + 1).padStart(2, "0")} / {String(highlights.length).padStart(2, "0")}</span><h3>{highlight.title}</h3><p>{highlight.description}</p></div></article>; })}</div><div className="research-slider__footer"><div className="research-slider__controls"><button type="button" onClick={() => select(active - 1)} aria-label="Previous research highlight">←</button><div className="research-slider__pagination"><div className="research-slider__dots">{highlights.map((highlight, index) => <button key={highlight.title} type="button" className={index === active ? "is-active" : ""} onClick={() => select(index)} aria-label={`Show ${highlight.title}`} aria-current={index === active ? "true" : undefined}>{index === active && <span key={active} />}</button>)}</div></div><button type="button" onClick={() => select(active + 1)} aria-label="Next research highlight">→</button></div></div></div>;
}
