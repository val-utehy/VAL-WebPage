"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({
  lightLabel,
  darkLabel,
}: {
  lightLabel: string;
  darkLabel: string;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const frame = window.requestAnimationFrame(() => {
      const current = document.documentElement.dataset.theme;
      if (current === "light" || current === "dark") setTheme(current);
    });
    const syncSystemTheme = () => {
      if (localStorage.getItem("vllab-theme")) return;
      const next = query.matches ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      document.documentElement.dataset.themeSource = "system";
      document.documentElement.style.colorScheme = next;
      setTheme(next);
    };

    query.addEventListener("change", syncSystemTheme);
    return () => {
      window.cancelAnimationFrame(frame);
      query.removeEventListener("change", syncSystemTheme);
    };
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("vllab-theme", next);
    document.documentElement.dataset.theme = next;
    document.documentElement.dataset.themeSource = "user";
    document.documentElement.style.colorScheme = next;
    setTheme(next);
  }

  const label = theme === "dark" ? lightLabel : darkLabel;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__sun">☀</span>
        <span className="theme-toggle__moon">☾</span>
        <span className="theme-toggle__thumb" />
      </span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
