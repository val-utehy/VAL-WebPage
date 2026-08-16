export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-kicker">
        <span>{index}</span>
        <p>{eyebrow}</p>
      </div>
      <div>
        <h2>{title}</h2>
        {intro ? <p className="section-intro">{intro}</p> : null}
      </div>
    </div>
  );
}
