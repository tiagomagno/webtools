"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Wrench, PanelLeft } from "lucide-react";
import { TOOLS, CATEGORIES, CATEGORY_META, categorySlug } from "../lib/tools";
import ContentHeader from "./ContentHeader";

const CAT_META = CATEGORY_META;

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
  const pathname = usePathname();
  const [theme, setTheme] = useLocalStorage<Theme>("wt-theme", "light");
  const [fontSize, setFontSize] = useLocalStorage<FontSize>("wt-font", "md");
  const [collapsed, setCollapsed] = useLocalStorage<boolean>("wt-collapsed", false);

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

  // Ferramenta atual (se houver) — usada só pra saber qual categoria destacar.
  const currentTool = pathname !== "/" ? TOOLS.find((t) => pathname.startsWith(t.href)) : undefined;

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "var(--surface-2)" }}>

      {/* ── Sidebar — rail estreito, ícones em cima do rótulo ─────────────────── */}
      <aside style={{
        width: collapsed ? 60 : 84,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 40,
        transition: "width 0.2s",
      }}>
        {/* Logo */}
        <Link
          href="/"
          onClick={() => { if (collapsed) setCollapsed(false); }}
          aria-label="webtools — início"
          title="webtools — início"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0 12px" }}
        >
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
              <rect x="3" y="5" width="5" height="18" rx="1.5" fill="white" opacity="0.9" />
              <rect x="10" y="5" width="15" height="8" rx="1.5" fill="white" opacity="0.7" />
              <rect x="10" y="15" width="15" height="8" rx="1.5" fill="white" opacity="0.5" />
            </svg>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          className="sidebar-icon-btn"
          style={{
            width: 26, height: 26, borderRadius: 7, border: "1px solid transparent",
            background: "transparent", color: "var(--text-muted)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0, marginBottom: 12,
          }}
        >
          <PanelLeft size={13} />
        </button>

        {/* Divisor entre o topo (logo) e a lista de categorias */}
        <div style={{ width: 28, height: 1, background: "var(--border)", marginBottom: 12, flexShrink: 0 }} />

        {/* Nav — lista plana de categorias em quadradinhos (ícone em cima, rótulo embaixo) */}
        <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", width: "100%", padding: "0 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          {CATEGORIES.map((cat) => {
            const meta = CAT_META[cat] ?? { icon: Wrench, color: "#888" };
            const Icon = meta.icon;
            const href = `/categoria/${categorySlug(cat)}`;
            const isActive = pathname === href || currentTool?.category === cat;

            return (
              <Link key={cat} href={href} title={cat} aria-current={isActive ? "page" : undefined}
                style={{ textDecoration: "none", display: "block", width: "100%" }}>
                <div
                  className="sidebar-cat-btn"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    padding: collapsed ? "8px 2px" : "10px 4px",
                    borderRadius: 10,
                    background: isActive ? meta.color + "18" : "transparent",
                    color: isActive ? meta.color : "var(--text-muted)",
                  }}
                >
                  <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, textAlign: "center", lineHeight: 1.15 }}>
                      {cat}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── Coluna direita: header suspenso + cartão de conteúdo ─────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header suspenso — fora do cartão, flutuando sobre o fundo da página */}
        <div style={{ padding: "16px 16px 0" }}>
          <ContentHeader theme={theme} fontSize={fontSize} onToggleTheme={toggleTheme} onCycleFont={cycleFont} />
        </div>

        <main style={{
          flex: 1, minWidth: 0, margin: "12px 16px 16px",
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
            {children}
          </div>
        </main>
      </div>

      <style>{`
        .sidebar-cat-btn:hover { background: var(--surface) !important; color: var(--text) !important; }
        .sidebar-icon-btn:hover { background: var(--surface) !important; border-color: var(--border) !important; color: var(--text) !important; }
      `}</style>
    </div>
  );
}
