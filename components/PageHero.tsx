export function PageHero({ eyebrow, title, intro, variant }: { eyebrow: string; title: string; intro: string; variant?: "publications" }) {
  return (
    <section className={`page-hero${variant ? ` page-hero--${variant}` : ""}`}>
      <div className="page-hero-grid" aria-hidden="true" />
      {variant === "publications" ? <div className="publication-flow" aria-hidden="true"><span /><span /><span /><span /><span /></div> : null}
      <div className="shell">
        <p className="eyebrow"><span /> {eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}
