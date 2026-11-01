"use client";

import { useState, useEffect, useCallback } from "react";
import SiteHeader from "./SiteHeader";

type Theme = "dark" | "light";
type FontSize = "sm" | "md" | "lg";

function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored) as T);
    } catch { /* ignore */ }
  }, [key]);

  const set = useCallback((v: T) => {
    setValue(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
  }, [key]);

  return [value, set] as const;
}

// ── AppShell ──────────────────────────────────────────────────────────────────

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>("wt-theme", "light");
  const [fontSize, setFontSize] = useLocalStorage<FontSize>("wt-font", "md");

  // Sync theme/font to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-font", fontSize);
  }, [theme, fontSize]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const cycleFont = () => {
    const order: FontSize[] = ["sm", "md", "lg"];
    setFontSize(order[(order.indexOf(fontSize) + 1) % order.length]);
  };

  return (
    <div className="page-bg" style={{ width: "100%", minHeight: "100vh" }}>
      <div style={{ width: "100%", padding: 16, display: "flex", flexDirection: "column", gap: 16, minHeight: "100vh" }}>
        <SiteHeader theme={theme} fontSize={fontSize} onToggleTheme={toggleTheme} onCycleFont={cycleFont} />

        <main className="cut-box" style={{
          flex: 1, minWidth: 0,
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
