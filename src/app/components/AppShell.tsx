"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Palette, Code, FileText, Database, Search,
  Image, FilePlus2, Wrench, HardHat, Calculator, Flag, Wallet,
  ChevronLeft, ChevronRight, Sun, Moon, Type, Home,
} from "lucide-react";
import { TOOLS, HOME, CATEGORIES } from "../lib/tools";

// ── Category config ───────────────────────────────────────────────────────────

const CAT_META: Record<string, { icon: React.ElementType; color: string }> = {
  "Design":       { icon: Palette,       color: "#ec4899" },
  "CSS":          { icon: Code,          color: "#6366f1" },
  "Texto":        { icon: Type,          color: "#22c55e" },
  "Dev":          { icon: Code,          color: "#eab308" },
  "Dados":        { icon: Database,      color: "#14b8a6" },
  "SEO":          { icon: Search,        color: "#0ea5e9" },
  "Imagens":      { icon: Image,         color: "#f59e0b" },
  "PDF":          { icon: FileText,      color: "#ef4444" },
  "Utilidades":   { icon: Wrench,        color: "#a855f7" },
  "Construção":   { icon: HardHat,       color: "#84cc16" },
  "Calculadoras": { icon: Calculator,    color: "#f97316" },
  "Utilidades BR":{ icon: Flag,          color: "#22c55e" },
  "Finanças":     { icon: Wallet,        color: "#06b6d4" },
};

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
  const [theme, setTheme] = useLocalStorage<Theme>("wt-theme", "dark");
  const [fontSize, setFontSize] = useLocalStorage<FontSize>("wt-font", "md");
  const [collapsed, setCollapsed] = useLocalStorage<boolean>("wt-collapsed", false);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  // Sync theme/font to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-font", fontSize);
  }, [theme, fontSize]);

  // Detect active category from current route
  useEffect(() => {
    if (pathname === "/") { setActiveCat(null); return; }
    const tool = TOOLS.find((t) => pathname.startsWith(t.href));
    if (tool) setActiveCat(tool.category);
  }, [pathname]);

  const innerTools = activeCat ? TOOLS.filter((t) => t.category === activeCat) : [];
  const showInner = activeCat !== null;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const cycleFont = () => {
    const order: FontSize[] = ["sm", "md", "lg"];
    setFontSize(order[(order.indexOf(fontSize) + 1) % order.length]);
  };

  // Group innerbar tools by subcategory
  const subcats: (string | undefined)[] = [];
  innerTools.forEach((t) => {
    if (!subcats.includes(t.subcategory)) subcats.push(t.subcategory);
  });

  const catColor = activeCat ? CAT_META[activeCat]?.color ?? "var(--accent)" : "var(--accent)";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Col 1 — Icon Rail ──────────────────────────────────────────────── */}
      <aside style={{
        width: collapsed ? 56 : 72,
        minHeight: "100vh",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
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
        <Link href="/" onClick={() => setActiveCat(null)} style={{ textDecoration: "none", padding: "16px 0 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, borderBottom: "1px solid var(--border)", width: "100%" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
              <rect x="3" y="5" width="5" height="18" rx="1.5" fill="white" opacity="0.9" />
              <rect x="10" y="5" width="15" height="8" rx="1.5" fill="white" opacity="0.7" />
              <rect x="10" y="15" width="15" height="8" rx="1.5" fill="white" opacity="0.5" />
            </svg>
          </div>
          {!collapsed && <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>tools</span>}
        </Link>

        {/* Home */}
        <div style={{ padding: "8px 0 4px", width: "100%", display: "flex", justifyContent: "center" }}>
          <RailItem
            icon={Home}
            label="Início"
            active={pathname === "/"}
            color="var(--text-muted)"
            collapsed={collapsed}
            onClick={() => { setActiveCat(null); }}
            href="/"
          />
        </div>

        <div style={{ height: 1, background: "var(--border)", width: "70%", marginBottom: 6 }} />

        {/* Categories */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 0", width: "100%", overflowY: "auto" }}>
          {CATEGORIES.map((cat) => {
            const meta = CAT_META[cat] ?? { icon: Wrench, color: "#888" };
            const Icon = meta.icon;
            const isActive = activeCat === cat;
            return (
              <RailItem
                key={cat}
                icon={Icon}
                label={cat}
                active={isActive}
                color={meta.color}
                collapsed={collapsed}
                onClick={() => setActiveCat(isActive ? null : cat)}
              />
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div style={{ borderTop: "1px solid var(--border)", width: "100%", padding: "10px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          {/* Theme */}
          <button onClick={toggleTheme} title={theme === "dark" ? "Tema claro" : "Tema escuro"}
            style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Font size */}
          <button onClick={cycleFont} title={`Fonte: ${fontSize}`}
            style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s", fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>
            {fontSize === "sm" ? "A" : fontSize === "md" ? "A·" : "A+"}
          </button>

          {/* Collapse toggle */}
          <button onClick={() => setCollapsed(!collapsed)} title={collapsed ? "Expandir" : "Recolher"}
            style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </aside>

      {/* ── Col 2 — Innerbar ───────────────────────────────────────────────── */}
      <aside style={{
        width: showInner ? 220 : 0,
        minHeight: "100vh",
        background: "var(--surface)",
        borderRight: showInner ? "1px solid var(--border)" : "none",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.2s",
        zIndex: 30,
      }}>
        {showInner && activeCat && (
          <div style={{ width: 220 }}>
            {/* Category header */}
            <div style={{
              padding: "14px 14px 10px",
              borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              {(() => {
                const meta = CAT_META[activeCat];
                const Icon = meta?.icon ?? Wrench;
                return <Icon size={14} style={{ color: catColor, flexShrink: 0 }} />;
              })()}
              <span style={{ fontSize: 11, fontWeight: 800, color: catColor, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                {activeCat}
              </span>
            </div>

            {/* Tools list grouped by subcategory */}
            <nav style={{ padding: "8px 6px" }}>
              {subcats.map((sc) => {
                const tools = innerTools.filter((t) => t.subcategory === sc);
                return (
                  <div key={sc ?? "__none"}>
                    {sc && (
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "8px 8px 4px" }}>
                        {sc}
                      </div>
                    )}
                    {tools.map((tool) => {
                      const isActive = pathname === tool.href;
                      return (
                        <Link key={tool.slug} href={tool.href} style={{ textDecoration: "none", display: "block" }}>
                          <div style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "7px 8px", borderRadius: 8, marginBottom: 1,
                            background: isActive ? catColor + "18" : "transparent",
                            color: isActive ? catColor : "var(--text-muted)",
                            fontSize: 12, fontWeight: isActive ? 600 : 400,
                            transition: "all 0.1s", cursor: "pointer",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}
                            className="inner-item"
                          >
                            <span style={{ fontSize: 14, flexShrink: 0 }}>{tool.emoji}</span>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{tool.label}</span>
                            {isActive && <div style={{ width: 4, height: 4, borderRadius: "50%", background: catColor, marginLeft: "auto", flexShrink: 0 }} />}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </nav>
          </div>
        )}
      </aside>

      {/* ── Col 3 — Content ────────────────────────────────────────────────── */}
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", minHeight: "100vh", padding: "32px 36px" }}>
        {children}
      </main>

      <style>{`
        .inner-item:hover { background: var(--surface-2) !important; color: var(--text) !important; }
      `}</style>
    </div>
  );
}

// ── RailItem ─────────────────────────────────────────────────────────────────

function RailItem({
  icon: Icon, label, active, color, collapsed, onClick, href,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  color: string;
  collapsed: boolean;
  onClick: () => void;
  href?: string;
}) {
  const inner = (
    <div
      onClick={onClick}
      title={label}
      style={{
        width: collapsed ? 40 : 48,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "8px 4px",
        borderRadius: 10,
        cursor: "pointer",
        transition: "all 0.15s",
        background: active ? color + "1a" : "transparent",
        border: `1px solid ${active ? color + "44" : "transparent"}`,
      }}
      className="rail-item"
    >
      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} style={{ color: active ? color : "var(--text-muted)", transition: "color 0.15s" }} />
      {!collapsed && (
        <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? color : "var(--text-subtle)", letterSpacing: "0.04em", textAlign: "center", lineHeight: 1.2, maxWidth: 52, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label}
        </span>
      )}
    </div>
  );

  return href
    ? <Link href={href} style={{ textDecoration: "none" }}>{inner}</Link>
    : inner;
}
