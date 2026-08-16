import type { Publication } from "@/lib/publications";

export function PublicationRow({ paper, memberNames = [] }: { paper: Publication; memberNames?: string[] }) {
  const status = paper.highlight ?? (paper.category === "Books" ? undefined : "Accepted");
  const labAuthors = new Set(memberNames);

  return (
    <article className="publication-row">
      <span className="publication-year">{paper.year}</span>
      <div>
        <h3>{paper.title}</h3>
        <p>{paper.authors.map((author, index) => (
          <span key={author}>{index ? ", " : ""}{labAuthors.has(author) ? <strong>{author}</strong> : author}</span>
        ))}</p>
      </div>
      <div className="publication-venue"><strong>{paper.venue}</strong>{status ? <span>{status}</span> : null}</div>
      {paper.url ? <a className="publication-row__link" href={paper.url} target="_blank" rel="noreferrer" aria-label={`Open ${paper.title}`}>↗</a> : <span className="publication-row__link publication-row__link--muted" aria-hidden="true">↗</span>}
    </article>
  );
}
