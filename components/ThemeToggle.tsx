"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const sync = () => setTheme(currentTheme());
    sync();
    window.addEventListener("portfolio-theme-change", sync);
    return () => window.removeEventListener("portfolio-theme-change", sync);
  }, []);

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem("dario-theme", next);
    } catch {
      // The theme still changes when storage is unavailable.
    }
    setTheme(next);
    window.dispatchEvent(new Event("portfolio-theme-change"));
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      data-theme={theme}
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="solar-mark" aria-hidden="true" />
    </button>
  );
}
