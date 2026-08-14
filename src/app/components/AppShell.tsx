"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Wrench,
  PanelLeft, ChevronDown, Sun, Moon, Home,
} from "lucide-react";
import { TOOLS, CATEGORIES, CATEGORY_META } from "../lib/tools";
import FavoritesMenu from "./FavoritesMenu";

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
  const router = useRouter();
  const [theme, setTheme] = useLocalStorage<Theme>("wt-theme", "light");
  const [fontSize, setFontSize] = useLocalStorage<FontSize>("wt-font", "md");
  const [collapsed, setCollapsed] = useLocalStorage<boolean>("wt-collapsed", false);
  const [openCat, setOpenCat] = useState<string | null>(null);

  // Sync theme/font to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-font", fontSize);
  }, [theme, fontSize]);

  // Auto-open the category of the current tool
  useEffect(() => {
    if (pathname === "/") return;
    const tool = TOOLS.find((t) => pathname.startsWith(t.href));
    if (tool) setOpenCat(tool.category);
  }, [pathname]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const cycleFont = () => {
    const order: FontSize[] = ["sm", "md", "lg"];
    setFontSize(order[(order.indexOf(fontSize) + 1) % order.length]);
  };

  const handleCatClick = (cat: string) => {
    if (collapsed) {
      const firstTool = TOOLS.find((t) => t.category === cat);
      if (firstTool) router.push(firstTool.href);
      return;
    }
    setOpenCat(openCat === cat ? null : cat);
  };

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside style={{
        width: collapsed ? 64 : 252,
        minHeight: "100vh",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 40,
        transition: "width 0.2s",
      }}>
        {/* Logo + toggle */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "16px 0" : "16px 14px 16px 18px",
          borderBottom: "1px solid var(--border)",
        }}>
          <Link
            href="/"
            onClick={() => { setOpenCat(null); if (collapsed) setCollapsed(false); }}
            aria-label="webtools — início"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}
          >
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="5" width="5" height="18" rx="1.5" fill="white" opacity="0.9" />
                <rect x="10" y="5" width="15" height="8" rx="1.5" fill="white" opacity="0.7" />
                <rect x="10" y="15" width="15" height="8" rx="1.5" fill="white" opacity="0.5" />
              </svg>
            </div>
            {!collapsed && <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>webtools</span>}
          </Link>

          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              title="Recolher menu"
              aria-label="Recolher menu lateral"
              className="sidebar-icon-btn"
              style={{
                width: 30, height: 30, borderRadius: 8, border: "1px solid transparent",
                background: "transparent", color: "var(--text-muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}
            >
              <PanelLeft size={15} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "10px 10px" }}>
          <SidebarLink
            icon={Home}
            label="Início"
            active={pathname === "/"}
            collapsed={collapsed}
            href="/"
            onClick={() => setOpenCat(null)}
          />

          <div style={{ height: 1, background: "var(--border)", margin: "10px 6px" }} />

          {!collapsed && (
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.06em", padding: "6px 10px 8px" }}>
              Ferramentas
            </div>
          )}

          {CATEGORIES.map((cat) => {
            const meta = CAT_META[cat] ?? { icon: Wrench, color: "#888" };
            const Icon = meta.icon;
            const isOpen = openCat === cat;
            const catTools = TOOLS.filter((t) => t.category === cat);

            const subcats: (string | undefined)[] = [];
            catTools.forEach((t) => {
              if (!subcats.includes(t.subcategory)) subcats.push(t.subcategory);
            });

            return (
              <div key={cat} style={{ marginBottom: 1 }}>
                <button
                  type="button"
                  onClick={() => handleCatClick(cat)}
                  title={cat}
                  aria-expanded={isOpen}
                  className="sidebar-cat-btn"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: collapsed ? "10px 0" : "9px 10px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderRadius: 9,
                    border: "none",
                    background: isOpen ? meta.color + "14" : "transparent",
                    color: isOpen ? meta.color : "var(--text-muted)",
                    cursor: "pointer",
                    font: "inherit",
                    fontSize: 13,
                    fontWeight: isOpen ? 700 : 500,
                    transition: "background 0.12s, color 0.12s",
                  }}
                >
                  <Icon size={16} strokeWidth={isOpen ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
                  {!collapsed && <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat}</span>}
                  {!collapsed && (
                    <ChevronDown size={14} style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s", opacity: 0.7 }} />
                  )}
                </button>

                {isOpen && !collapsed && (
                  <div style={{ padding: "4px 0 8px 14px", borderLeft: "1px solid var(--border)", marginLeft: 18 }}>
                    {subcats.map((sc) => {
                      const tools = catTools.filter((t) => t.subcategory === sc);
                      return (
                        <div key={sc ?? "__none"}>
                          {sc && (
                            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.06em", padding: "6px 8px 3px" }}>
                              {sc}
                            </div>
                          )}
                          {tools.map((tool) => {
                            const isActive = pathname === tool.href;
                            return (
                              <Link key={tool.slug} href={tool.href} style={{ textDecoration: "none", display: "block" }}>
                                <div
                                  className="sidebar-tool-item"
                                  style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "7px 8px", borderRadius: 8, marginBottom: 1,
                                    background: isActive ? meta.color + "18" : "transparent",
                                    color: isActive ? meta.color : "var(--text-muted)",
                                    fontSize: 12.5, fontWeight: isActive ? 600 : 400,
                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                  }}
                                >
                                  <span style={{ fontSize: 14, flexShrink: 0 }}>{tool.emoji}</span>
                                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{tool.label}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div style={{
          borderTop: "1px solid var(--border)", padding: "10px",
          display: "flex", gap: 6,
          flexDirection: collapsed ? "column" : "row",
          alignItems: "center",
        }}>
          <FavoritesMenu placement="up-left" />

          <button onClick={toggleTheme} title={theme === "dark" ? "Tema claro" : "Tema escuro"}
            aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
            aria-pressed={theme === "dark"}
            style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button onClick={cycleFont} title={`Fonte: ${fontSize}`}
            aria-label={`Tamanho da fonte: ${fontSize}. Clique para alterar`}
            style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>
            {fontSize === "sm" ? "A" : fontSize === "md" ? "A·" : "A+"}
          </button>
        </div>
      </aside>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", minHeight: "100vh", padding: "32px 36px" }}>
        {children}
      </main>

      <style>{`
        .sidebar-cat-btn:hover { background: var(--surface-2) !important; color: var(--text) !important; }
        .sidebar-tool-item:hover { background: var(--surface-2) !important; color: var(--text) !important; }
        .sidebar-icon-btn:hover { background: var(--surface-2) !important; border-color: var(--border) !important; color: var(--text) !important; }
      `}</style>
    </div>
  );
}

// ── SidebarLink ──────────────────────────────────────────────────────────────

function SidebarLink({
  icon: Icon, label, active, collapsed, href, onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  collapsed: boolean;
  href: string;
  onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} title={label} aria-label={label} aria-current={active ? "page" : undefined}
      style={{ textDecoration: "none", display: "block" }}>
      <div className="sidebar-cat-btn" style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: collapsed ? "10px 0" : "9px 10px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 9,
        background: active ? "#6366f114" : "transparent",
        color: active ? "var(--accent)" : "var(--text-muted)",
        fontSize: 13, fontWeight: active ? 700 : 500,
      }}>
        <Icon size={16} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
        {!collapsed && <span>{label}</span>}
      </div>
    </Link>
  );
}
