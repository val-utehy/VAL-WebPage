"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Stat = {
  value: string;
  label: string;
};

function splitValue(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  return match ? { amount: Number(match[1]), suffix: match[2] } : { amount: 0, suffix: value };
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const startedAt = performance.now();
    const duration = 720;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

function StatCard({ stat, index, active }: { stat: Stat; index: number; active: boolean }) {
  const { amount, suffix } = splitValue(stat.value);
  const value = useCountUp(amount, active);

  return (
    <article className="stat" style={{ "--stat-delay": `${index * 110}ms` } as CSSProperties}>
      <strong>{active ? value : amount}{suffix}</strong>
      <span>{stat.label}</span>
    </article>
  );
}

export function IntroStats({ stats }: { stats: Stat[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const frame = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setActive(true);
      observer.disconnect();
    }, { threshold: 0.24 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className={`stats-grid stats-grid--reveal${active ? " is-visible" : ""}`}>
      {stats.map((stat, index) => <StatCard key={stat.label} stat={stat} index={index} active={active} />)}
    </div>
  );
}
