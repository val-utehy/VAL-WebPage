"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/gallery";
import { assetPath } from "@/lib/assets";

const slideDuration = 4000;

export function GalleryGrid({
  items,
  closeLabel,
}: {
  items: GalleryItem[];
  closeLabel: string;
}) {
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const selectImage = (index: number) => setActiveImage(index);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight" && active.images.length > 1) setActiveImage((activeImage + 1) % active.images.length);
      if (event.key === "ArrowLeft" && active.images.length > 1) setActiveImage((activeImage - 1 + active.images.length) % active.images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, activeImage]);

  useEffect(() => {
    if (!active || active.images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setActiveImage((index) => (index + 1) % active.images.length), slideDuration);
    return () => window.clearTimeout(timer);
  }, [active, activeImage]);

  return (
    <>
      <div className="gallery-grid">
        {items.map((item, index) => (
          <button
            className={`gallery-card gallery-card--${(index % 5) + 1}`}
            key={item.slug}
            type="button"
            onClick={() => { setActive(item); setActiveImage(0); }}
            aria-label={`${item.title}: ${item.description}`}
          >
            <Image
              src={assetPath(item.image)}
              alt={item.alt}
              width={1600}
              height={1100}
              sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw"
            />
            <span className="gallery-card__overlay" />
            <span className="gallery-card__meta">
              <small>{item.category} · {item.date}</small>
              <strong>{item.title}</strong>
            </span>
          </button>
        ))}
      </div>

      {active ? (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={active.title}>
          <button className="gallery-lightbox__backdrop" type="button" onClick={() => setActive(null)} aria-label={closeLabel} />
          <div className="gallery-lightbox__panel">
            <button className="gallery-lightbox__close" type="button" onClick={() => setActive(null)} aria-label={closeLabel}>×</button>
            <div className="gallery-lightbox__image">
              <Image src={assetPath(active.images[activeImage] || active.image)} alt={active.alt} width={1600} height={1100} priority />
              {active.images.length > 1 ? <>
                <div className="research-slider__footer gallery-lightbox__slider-footer">
                  <div className="research-slider__controls">
                    <button type="button" onClick={() => selectImage((activeImage - 1 + active.images.length) % active.images.length)} aria-label="Previous image">←</button>
                    <div className="research-slider__pagination">
                      <div className="research-slider__dots">
                        {active.images.map((image, index) => <button key={image} type="button" className={index === activeImage ? "is-active" : ""} onClick={() => selectImage(index)} aria-label={`View image ${index + 1}`} aria-current={index === activeImage ? "true" : undefined}>{index === activeImage && <span key={activeImage} />}</button>)}
                      </div>
                    </div>
                    <button type="button" onClick={() => selectImage((activeImage + 1) % active.images.length)} aria-label="Next image">→</button>
                  </div>
                </div>
              </> : null}
            </div>
            <div className="gallery-lightbox__copy">
              <small>{active.category} · {active.date}</small>
              <h2>{active.title}</h2>
              <p>{active.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
