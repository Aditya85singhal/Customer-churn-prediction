"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center justify-center w-8 h-8 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--brand-dim)] transition-colors"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.3" />
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <line x1="7.5" y1="0.75" x2="7.5" y2="2.25" />
        <line x1="7.5" y1="12.75" x2="7.5" y2="14.25" />
        <line x1="0.75" y1="7.5" x2="2.25" y2="7.5" />
        <line x1="12.75" y1="7.5" x2="14.25" y2="7.5" />
        <line x1="2.63" y1="2.63" x2="3.69" y2="3.69" />
        <line x1="11.31" y1="11.31" x2="12.37" y2="12.37" />
        <line x1="2.63" y1="12.37" x2="3.69" y2="11.31" />
        <line x1="11.31" y1="3.69" x2="12.37" y2="2.63" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M12.5 8.6A5.4 5.4 0 0 1 6.4 2.5a5.4 5.4 0 1 0 6.1 6.1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
